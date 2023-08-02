import React from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../lib/app-context';

export default class SendMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoading: true,
      bottleId: 0,
      recipientEmail: null,
      emailSent: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const bottleId = this.context.currentBottleId;
    this.setState({ bottleId: bottleId });

    fetch(`/api/messages/${bottleId}`)
      .then(response => {
        if (!response.ok) {
          return response.text().then(errorText => Promise.reject(errorText));
        }
        return response.json();
      })
      .then(data => {
        const { recipientEmail } = data;
        this.setState({ recipientEmail: recipientEmail, isLoading: false });
      })
      .catch(error => {
        console.error('There was an unexpected error', error);
        this.setState({
          error: 'An unexpected error occurred. Please try again.',
          isLoading: false
        });
      });
  }

  handleClick(event) {
    const sendId = { bottleId: this.state.bottleId };
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendId)
    };
    fetch('/api/send', myInit)
      .then(response => {
        if (!response.ok) {
          return response.text().then(errorText => Promise.reject(errorText));
        }
        return response.json();
      })
      .then(data => {
        // ... rest of your code
      })
      .catch(error => {
        console.error('There was an unexpected error', error);
        this.setState({
          error: 'An unexpected error occurred. Please try again.',
          isLoading: false
        });
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <>
          <div className="overlay position-absolute"></div>
          <div className="row align-center flex-column position-absolute padding-3rem desktop-style absolute-center">
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </>
      );
    } else if (!this.state.recipientEmail) {
      return (
        <>
          <div className="overlay position-absolute"></div>
          <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
            <h1 className="font-size-36 no-margin text-center">
              {"Unable to find recipient's email!"}
            </h1>
            <h2 className="font-size-24 text-center">
              Click on the parrot to go back!
            </h2>
            <Link to="/menu">
              <img src="/images/parrot.png" className="width-100" />
            </Link>
          </div>
        </>
      );
    } else if (this.state.error) {
      return (
        <>
          <div className="overlay position-absolute"></div>
          <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
            <h1 className="font-size-36 no-margin text-center">
              Unable to send email!
            </h1>
            <h2 className="font-size-24 text-center">
              Click on the parrot to go back!
            </h2>
            <Link to="/menu">
              <img src="/images/parrot.png" className="width-100" />
            </Link>
          </div>
        </>
      );
    } else if (!this.state.emailSent) {
      return (
        <>
          <div className="overlay position-absolute"></div>
          <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
            <h1 className="font-size-48 no-margin">Send message to</h1>
            <h2 className="font-size-36 text-center">{`${this.state.recipientEmail}?`}</h2>
            <button onClick={this.handleClick}>
              <img src="/images/wave.png" className="width-120" />
            </button>
            <h1 className="font-size-36 no-margin text-center mb-24">
              Click the wave to confirm
            </h1>
            <Link to="/menu">
              <img src="/images/parrot.png" className="width-120" />
            </Link>
            <h1 className="font-size-36 no-margin text-center">Go back?</h1>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="overlay position-absolute"></div>
          <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
            <h1 className="font-size-48 no-margin">Email Sent!</h1>
            <h2 className="font-size-36 text-center">{`${this.state.recipientEmail}?`}</h2>
            <Link to="/">
              <img src="/images/parrot.png" className="width-120" />
            </Link>
            <h1 className="font-size-36 no-margin text-center">
              Make another Bottle?
            </h1>
          </div>
        </>
      );
    }
  }
}

SendMessage.contextType = AppContext;
