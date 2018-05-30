const express = require('express')
const request = require('request')
const querystring = require('querystring')

require('dotenv').config()


const app = express()


const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8888/callback'

// Handle Login
app.get('/login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: 'user-read-private user-read-email',
        redirect_uri
    }))
})


// Callback
app.get('/callback', function(req, res) {
    let code = req.query.code || null

    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
        }
    }

    console.log('posting to accounts api token')

    request.post(authOptions, function (err, response, body) {
        const access_token = JSON.parse(body).access_token

        const uri = process.env.FRONTEND_URI || 'http://localhost:3000'
        console.log(access_token)
        res.redirect(uri + '?access_token=' + access_token)
    })
})

// hello
app.get('/', function (req, res) {
    res.send('hello world')
    res.end()
})

const port = process.env.PORT || 8888

app.listen(port, function () {
    console.log(`Listening on port: ${port}. Go to Login to initiate authentication flow`)
})