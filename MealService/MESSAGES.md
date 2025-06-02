# MealService Messages

Alle messages worden gepost in de queue: `mealQueue`, met een header genaamd `MessageType` wat aangeeft welk type message het is. De volgende hoofdstukken zijn deze MessageTypes en heeft een voorbeeld wat erin zit.

## UserJoinedMeal

```
{
    "user": {
        "_id": "628e7aa137280cb202245ccb",
        "email": "testing@user.com",
        "__v": 0
    },
    "meal": {
        "_id": "628e800c2ae4448dec546476",
        "name": "Test1",
        "description": "Dit is een lekkere maaltijd.",
        "offeredBy": {
            "_id": "628e7aa137280cb202245ccb",
            "email": "testing@user.com",
            "__v": 0
        },
        "participants": [
            {
                "_id": "628e7aa137280cb202245ccb",
                "email": "testing@user.com",
                "__v": 0
            }
        ],
        "__v": 3
    }
}
```

## UserLeavesMeal

```
{
    "user": {
        "_id": "628e7aa137280cb202245ccb",
        "email": "testing@user.com",
        "__v": 0
    },
    "meal": {
        "_id": "628e800c2ae4448dec546476",
        "name": "Test1",
        "description": "Dit is een lekkere maaltijd.",
        "offeredBy": {
            "_id": "628e7aa137280cb202245ccb",
            "email": "testing@user.com",
            "__v": 0
        },
        "participants": [],
        "__v": 4
    }
}
```

## MealCreated

```
{
    "name": "TEST",
    "description": "Dit is een lekkere maaltijd.",
    "offeredBy": {
        "_id": "628e7aa137280cb202245ccb",
        "email": "testing@user.com",
        "__v": 0
    },
    "participants": [],
    "_id": "628e830e45763303d3fe546f",
    "__v": 0
}
```

## MealUpdated

```
{
    "name": "Test1",
    "description": "Dit is een lekkere maaltijd.",
    "offeredBy": {
        "_id": "628e7aa137280cb202245ccb",
        "email": "testing@user.com",
        "__v": 0
    },
    "participants": [],
    "_id": "628e800c2ae4448dec546476",
    "__v": 4
}
```

## MealDeleted

```
{
    "_id": "628e830e45763303d3fe546f",
    "name": "TEST",
    "description": "Dit is een lekkere maaltijd.",
    "offeredBy": {
        "_id": "628e7aa137280cb202245ccb",
        "email": "testing@user.com",
        "__v": 0
    },
    "participants": [],
    "__v": 0
}
```
