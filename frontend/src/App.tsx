
import './App.css';
import React, { Component } from 'react'
import io from "socket.io-client";

interface Props {

}
interface State {
  isConnected: boolean
}

export default class App extends Component<Props, State> {
  state = {
    isConnected: false
  }

  socket!:SocketIOClient.Socket

  componentDidMount() {
    this.socket = io("http://localhost:3500");

    this.socket.on("connect", (info: any) => {
      console.log("Connected!");
      this.setState({
        isConnected: true
      })
    });
  }

  render() {
    return (
      <div className="App">
        {this.state.isConnected ? "Sockets Connected" : "Waiting for connection"}
      </div>
    )
  }
}
