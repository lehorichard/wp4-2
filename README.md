# API
## POST /api/register
### Request
```
{
	"username": "test",
	"password": "123456"
}
```
### Response
```
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWZkMWI2NDZjMzk3NTBmMWZkY2U4OWNhIn0sImlhdCI6MTYwNzc5MjI3MSwiZXhwIjoxNjA3ODc4NjcxfQ.IK8iL8rGRPv43OuyqNk_zgCjfHEQQvwdXoJpAZmIn2U"
}
```
## POST /api/login
```
{
	"username": "test",
	"password": "123456"
}
```
### Response
```
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWZkMWI2NDZjMzk3NTBmMWZkY2U4OWNhIn0sImlhdCI6MTYwNzc5MjI3MSwiZXhwIjoxNjA3ODc4NjcxfQ.IK8iL8rGRPv43OuyqNk_zgCjfHEQQvwdXoJpAZmIn2U"
}
```
## POST /api/upload
### Request
#### Head
```
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWZkMWI2NDZjMzk3NTBmMWZkY2U4OWNhIn0sImlhdCI6MTYwNzc5MjI3MSwiZXhwIjoxNjA3ODc4NjcxfQ.IK8iL8rGRPv43OuyqNk_zgCjfHEQQvwdXoJpAZmIn2U"
}
```
#### Body
```
{
	"image": <file>,
	"name": "title",
	"desc": "description"
}
```
### Response
```
{
	"message": "success"
}
```
## GET /api/user/:id
### Response
#### 200
```
 [{
        "_id": "5fd62e6484526600176084d6",
        "desc": "look at my cool image",
        "uploadedAt": "2020-12-13T15:07:59.265Z",
        "name": "cool image",
        "img": {
            "data": "<data>",
            "contentType": "image/png"
        },
        "user": {
            "id": "5fd1b646c39750f1fdce89ca"
        },
        "__v": 0
    },
    {
        "_id": "5fd62e8d84526600176084d7",
        "desc": "this should work now (pls)",
        "uploadedAt": "2020-12-13T15:07:59.265Z",
        "name": "cooler image",
        "img": {
            "data": "<data>",
            "contentType": "image/png"
        },
        "user": {
            "id": "5fd1b646c39750f1fdce89ca"
        },
        "__v": 0
    }]
```
#### 400
```
{
	"message": "Invalid ID"
}
```
## GET /api/images
### Response
```
[{
        "_id": "5fd62e6484526600176084d6",
        "desc": "look at my cool image",
        "uploadedAt": "2020-12-13T15:07:59.265Z",
        "name": "cool image",
        "img": {
            "data": "<data>",
            "contentType": "image/png"
        },
        "user": {
            "id": "5fd1b646c39750f1fdce89ca"
        },
        "__v": 0
},
]
```

## GET /api/image/:id
### Response
```
{
    "img": {
        "data": {
            "type": "Buffer",
            "data": <data>
        },
        "contentType": "image/png"
    },
    "desc": "look at my cool image",
    "uploadedAt": "2020-12-12T03:55:36.689Z",
    "_id": "5fd43f90677746c03783ee66",
    "name": "cool image",
    "__v": 0
}
```

## DELETE /api/images
#### Head
```
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWZkMWI2NDZjMzk3NTBmMWZkY2U4OWNhIn0sImlhdCI6MTYwNzc5MjI3MSwiZXhwIjoxNjA3ODc4NjcxfQ.IK8iL8rGRPv43OuyqNk_zgCjfHEQQvwdXoJpAZmIn2U"
}
```
#### Body
```
{
	"id": "5fd448330602b3d6f6f574ca"
}
```
### Response
#### 200
```
{
	"message": "success"
}
```
#### 400
```
{
	"message": "invalid id"
}
```
#### 401
```
{
	"message": "Can't perform that action."
}
```