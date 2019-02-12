import React, { Component } from 'react';
import {Alert, Button, ButtonToolbar} from 'react-bootstrap';
import './App.css';
import {drugs, links} from './data'
import {loadModel, generate} from './model'

const Screen = Object.freeze({
  LOADING: Symbol('LOADING'),
  CHALLENGE: Symbol('CHALLENGE'),
  LOST: Symbol('LOST')
})

class App extends Component {

  setChallenge(model, score){
    const real = Math.floor(Math.random() * 2)
    const real_idx = Math.floor(Math.random() * drugs.length)
    const challenge = real ? drugs[real_idx] : generate(model)
    const link = real ? links[real_idx] : null
    const state = {
      screen: Screen.CHALLENGE,
      challenge : challenge,
      link: 'https://bnf.nice.org.uk/drug/' + link,
      real: real,
      model: model,
      score: score
    }
    this.setState(state)
  }

  setLost(model, score, real, challenge, link){
    const state = {
      screen: Screen.LOST,
      model: model,
      score: score,
      real: real,
      challenge: challenge,
      link: link
    }
    this.setState(state)
  }

  async load(){
    const self = this
    loadModel().then(function(model){
      self.setChallenge(model, 0)
    })
  }

  constructor(props) {
    super(props);
    this.state = {screen : Screen.LOADING}
    this.load()
    this.onRealClick = this.onRealClick.bind(this);
    this.onFakeClick = this.onFakeClick.bind(this);
    this.onTryAgainClick = this.onTryAgainClick.bind(this);
  }

  onRealClick(e, t){
    if (this.state.real){
      this.setChallenge(this.state.model, this.state.score + 1)
    } else {
      this.setLost(this.state.model, this.state.score, false, this.state.challenge, this.state.link)
    }
  }

  onFakeClick(e, t){
    if (this.state.real){
      this.setLost(this.state.model, this.state.score, true, this.state.challenge, this.state.link)
    } else {
      this.setChallenge(this.state.model, this.state.score + 1)
    }
  }

  onTryAgainClick(e, t){
    this.setChallenge(this.state.model, 0)
  }

  loadingUI(){
    return (
      <div className="App">
      </div>
    )
  }

  lostUI(){
    const msg = !this.state.real ?  <Alert variant='danger'> <strong> {this.state.challenge}</strong> does not exist</Alert> :
      <Alert variant='danger'> Read about <a href={this.state.link} target="_blank" rel="noopener noreferrer">{this.state.challenge}</a></Alert>
    return (
      <div className="App">
        <header className="App-header">
      <p>You scored <code>{this.state.score}</code> points</p>
        {msg}
        <Button variant="primary" size='lg' onClick={this.onTryAgainClick}>Try Again</Button>
        </header>
      </div>
    );
  }

  challengeUI(state){
    return (
      <div className="App">
        <header className="App-header">
      <p>{this.state.score}</p>
          <p>
            <code>{this.state.challenge}</code>
          </p>
      <ButtonToolbar>
        <Button className="lbutton" variant="success" size='lg' onClick={this.onRealClick}>Real</Button>
        <Button variant="danger" size='lg' onClick={this.onFakeClick}>Fake</Button>
      </ButtonToolbar>
        </header>
      </div>
    );
  }

  render() {
    switch(this.state.screen){
      case Screen.CHALLENGE:
        return this.challengeUI(this.state)
      case Screen.LOADING:
        return this.loadingUI()
      case Screen.LOST:
        return this.lostUI()
      default:
        console.log('UNEXPECTED')
        console.log(this.state)
    }
  }
}

export default App;
