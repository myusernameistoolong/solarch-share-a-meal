import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-screen',
  templateUrl: './register-screen.component.html',
  styleUrls: ['./register-screen.component.scss']
})
export class RegisterScreenComponent implements OnInit {

  email: String = 'test@test.nl';
  password: String = 'test';
  passwordConfirm: String = 'test';
  alertMessage = ''

  constructor() { }

  ngOnInit(): void {
  }
  

  async submitForm(data: any)
  {
    this.alertMessage = '';
    let email = data.querySelector('[name="userEmail"')?.value;
    let fullName = data.querySelector('[name="fullName"')?.value;
    let password = data.querySelector('[name="password"')?.value;
    let passwordConfirm = data.querySelector('[name="passwordConfirm"')?.value;

    if(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g.test(email) == false)
    {
      this.alertMessage = 'Email is invalid!';
      return;
    }

    if(password != passwordConfirm)
    {
      this.alertMessage = 'Passwords are not the same!';
      return;
    }


    console.log({
      email,
      fullName,
      password,
      passwordConfirm
    });
    
    //Create api call


    



  }

}
