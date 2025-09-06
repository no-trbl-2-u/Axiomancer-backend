# Axiomancer-backend

## Endpoints
### Create User [POST]
`/create-user`
```js
// Request
{
    username: string;
    password: string;
    email: string;
}

// Response (200 success) 
{
    uid: string;
    username: string;
}

// Response (200 username exists)
{
    message: string;
}
```
### Login User [POST]
`/login-user`
```js
// Request
{
    username: string;
    password: string;
}

// Response (200)
{
    uid: string;
}

// Response (200 incorrect username or password)
{
    message: string;
}

```

### Delete User [POST]
`/delete-user`

```js
// Request
{
    uid: string;
}

// Response (200)
{
    message: string;
}
```

### TODO: Determine these route shapes
/get-game-state

/update-game-state

/get-player-stats

/get-player-inventory

/update-player-stats

/update-player-inventory