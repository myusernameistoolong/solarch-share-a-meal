const Account = require('../model/Account')
const bcrypt = require('bcrypt');
const ApiError = require('../model/ApiError');
const assert = require('assert');
const auth = require('../model/Authentication');
const rabbitMqQueue = require('../model/RabbitQueue');



module.exports = {


    readAccounts(req, res, next) {
        res.status(200).json({
            accounts: []
        }).end();
    },


    createAccount(req, res, next) {

        const fullname = req.body.fullname;
        const username = req.body.username;
        const birthdate = req.body.birthdate;
        const email = req.body.email;
        const password = req.body.password;


        try {
            assert(fullname != undefined, 'fullname required!')
            assert(username != undefined, 'username required!')
            assert(birthdate != undefined, 'birthdate required!')
        } 
        catch(e)
        {
            console.log(e);
            next(new ApiError(e.message, 500));
            return;
        }

        const account = new Account({
            email,
            password,
            salt: bcrypt.genSaltSync()
        })

        account.validate((error) => {
            if (error !== null) {
                next(new ApiError(error.message, 412));
                return;
            }
        });

        Account.find({
                $or: [{
                    email
                }]
            })
            .then((result) => {
                if (result.length > 0) {
                    next(new ApiError('There is already with this email', 406));
                    return;
                }

                bcrypt.hash(account.password, account.salt)
                    .then((result) => {

                        account.password = result;

                        account.save()
                            .then(async (account) => {


                                //Send accountCreated event to authQueue with authExchange
                                await rabbitMqQueue.postToQueue(JSON.stringify({
                                    email: account.email,
                                    birthdate,
                                    fullname,
                                    username
                                }), 'amq.direct', 'authKey', {MessageType: "AccountCreated"})


                                const token = auth.encodeToken({
                                    account
                                });

                                res.status(200).json({
                                    email: account.email,
                                    token
                                }).end();

                            })
                            .catch((error) => {
                                next(new ApiError('Error code : 132 ask server administrator for more information'), 500);
                            });


                    })
                    .catch((error) => {
                        next(new ApiError('Error code : 131 ask server administrator for more information'), 500);
                    });

            })
            .catch((error) => {
                next(new ApiError('Error code : 130 ask server administrator for more information'), 500);
            })

    },


    validateToken(req, res, next) {

        const token = req.header('Authorization') || '';

        auth.decodeToken(token, (data, err) => {
            if (err !== null) {
                next(err);
            } else {
                req.data = data;
                next();
            }
        });

    },



    async updateAccount(req, res, next) {

        const account = req.data.account;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;


        try {
            assert(oldPassword && typeof (oldPassword) == 'string', 'oldPassword is required. oldPassword: string');
            assert(newPassword && typeof (newPassword) == 'string', 'newPassword is required. newPassword: string');
        } catch (ex) {
            next(new ApiError(ex.message, 412));
            return;
        }


        // let result = await bcrypt.compare(oldPassword, account.password)

        // if(result == false)
        // {
        //     next(new ApiError('Old password is incorrect!', 412));
        //     return;
        // }

        if (newPassword == oldPassword) {
            next(new ApiError('New password could not be the same as old password', 412));
            return;
        }


        let salt = bcrypt.genSaltSync();
        bcrypt.hash(newPassword, salt)
            .then((result) => {

                Account.findByIdAndUpdate(account._id, {
                        password: result,
                        salt
                    })
                    .then((account) => {

                        const token = auth.encodeToken({
                            account
                        });

                        res.status(200).json({
                            email: account.email,
                            token,
                            message: "Password changed!"
                        }).end();


                    })
                    .catch((error) => {
                        next(new ApiError('Error code : 144 ask server administrator for more information'), 500);
                    })

            })
            .catch((error) => {
                next(new ApiError('Error code : 143 ask server administrator for more information'), 500);
            });

    },


    deleteAccount(req, res, next) {

        const account = req.data.account;


        Account.findByIdAndDelete(account._id)
            .then(async (result) => {

                //Send accountDeleted event to authQueue with authExchange
                await rabbitMqQueue.postToQueue(JSON.stringify({
                    email: account.email
                }), 'amq.direct', 'authKey', {MessageType: 'AccountDeleted'})

                res.status(200).json({
                    message: 'success'
                }).end();
            })
            .catch((error) => {
                next(new ApiError('Error code : 145 ask server administrator for more information'), 500);
            });

    },

    loginAccount(req, res, next) {

        const email = req.body.email;
        const password = req.body.password;


        try {
            assert(email && typeof (email) == 'string', 'email is required. email: string');
            assert(password && typeof (password) == 'string', 'password is required. uassword: string');
        } catch (ex) {
            next(new ApiError(ex.message, 412));
            return;
        }

        Account.findOne({
                email
            })
            .then((account) => {

                if(account == null)
                {
                    next(new ApiError('No account found with this information!', 412));
                    return;
                }

                bcrypt.compare(password, account.password)
                    .then((result) => {

                        if (result == true) {

                            const token = auth.encodeToken({
                                account
                            });

                            res.status(200).json({
                                email: account.email,
                                token
                            }).end();

                        } else {
                            next(new ApiError('Invalid email or password', 403));
                            return;
                        }
                    })
                    .catch((error) => {
                        next(new ApiError('Error code : 142 ask server administrator for more information'), 500);
                    })


            })
            .catch((error) => {
                console.log(error);
                next(new ApiError('Error code : 141 ask server administrator for more information'), 500);
            })

    }


}