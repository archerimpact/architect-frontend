import React, { Component } from 'react';
  

const urlForUsername = username =>
  `https://api.github.com/users/${username}`


const rosetteKey = '554b291cfc61e3f3338b9f02065bd1a5'
const rosetteEntitiesUrl = 'https://api.rosette.com/rest/v1/entities'

class Rosette extends Component {
  constructor(props) {
    super(props)
    this.state = {
      requestFailed: false
    }
  }

  componentDidMount() {
    var content = 'I\'m sending a lot of Chinese text from President Donald Trump!'

    var myHeaders = {
      'x-rosetteapi-key': rosetteKey,
      'content-type': 'application/json',
      'accept': 'application/json',
      'cache-control': 'no-cache'
    };

    var obj = {
      method: "POST",
      body: JSON.stringify({"content": content}),
      headers: myHeaders
    }
    console.log("this is your options: " + obj.body)
    fetch(rosetteEntitiesUrl, obj)
      .then(response => {
        debugger
        console.log("got a response: " + response)
        if (!response.ok) {
          throw Error("Network request failed")
        }

        return response
      })
      .then(d => d.json())
      .then(d => {
        console.log("here's the data name:  " + d)
        debugger
        this.setState({
          rosetteData: d
        })
      }, () => {
        this.setState({
          requestFailed: true
        })
      })
  }


  render() {

    if (this.state.requestFailed) return <p>Failed!</p>
    if (!this.state.rosetteData) return <p>Loading...</p>
    return (
      <div>
        <h2>{this.state.rosetteData.login}</h2>
      </div>
    )
  }

}

export default Rosette;