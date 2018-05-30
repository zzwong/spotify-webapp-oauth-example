import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import queryString from 'query-string'

class App extends Component {
  constructor() {
    super()

    this.state = {
      chicken: 'chowmein'
    }
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token

    console.log(accessToken)

    if (!accessToken) {
      return
    }

    fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({
          user: {
            name: data.email
          }
        }) 
      })
  }


  render() {
    return (
      <div className="App">
        {
          this.state.user ? 
            (
              <div>
                <h1 style={{'fontSize': '45px', 'marginTop': '5px'}}> {this.state.user.name} Playlists</h1>
              </div>
            )
            : <button onClick={
                () => {
                  window.location = window.location.href.includes('localhost') ? 'http://localhost:8888/login' : 'http://somebackend.com/login'
                }               
            } style={{'marginTop': '20px', 'padding': '20px'}}> Sign in with Spotify </button>
        }
      </div>
    );
  }
}

export default App;
