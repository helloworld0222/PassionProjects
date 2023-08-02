import React from 'react';
import M from 'materialize-css';
import AppContext from '../lib/app-context';
import { Link, useParams } from 'react-router-dom';

function injectUseParams(Component) {
  const InjectedUseParams = function (props) {
    const routeParams = useParams();
    return <Component {...props} routeParams={routeParams} />;
  };
  return InjectedUseParams;
}

class ViewMessage extends React.Component {
  constructor(props) {
    super(props);
    this.carousel = this.carousel.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.previousSlide = this.previousSlide.bind(this);
    this.state = {
      error: null,
      isLoading: true,
      bottleId: 0,
      isRecipient: false,
      message: null,
      currentSlide: 0,
      slideCount: 5,
      currentTimer: setInterval(this.carousel, 10000)
    };
  }

  carousel() {
    if (this.state.currentSlide < this.state.slideCount - 1) {
      this.setState({ currentSlide: this.state.currentSlide + 1 });
    } else {
      clearInterval(this.currentTimer);
    }
  }

  nextSlide(event) {
    clearInterval(this.state.currentTimer);
    if (this.state.currentSlide < this.state.slideCount - 1) {
      this.setState({
        currentSlide: this.state.currentSlide + 1,
        currentTimer: setInterval(this.carousel, 10000)
      });
    }
  }

  previousSlide(event) {
    clearInterval(this.state.currentTimer);
    if (this.state.currentSlide > 0) {
      this.setState({
        currentSlide: this.state.currentSlide - 1,
        currentTimer: setInterval(this.carousel, 10000)
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.currentTimer);
  }

  componentDidMount() {
    M.AutoInit();

    const { bottleId } = this.props.routeParams;
    if (!bottleId) {
      console.error('bottleId is undefined');
      // Update the state to show an error message
      this.setState({ error: 'Bottle ID is missing!', isLoading: false });
      return;
    }

    console.log('Bottle ID:', bottleId);

    this.setState({ bottleId: bottleId });
    const { user } = this.props.routeParams;
    if (user === 'recipient') {
      this.setState({ isRecipient: true });
    }

    const { assignBottleId } = this.context;
    assignBottleId(parseInt(bottleId));

    fetch(`/api/messages/${bottleId}`)
      .then(response => {
        if (!response.ok) {
          // Handle HTTP errors
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({ message: data });
        }
        this.setState({ isLoading: false });
        this.setState({ slideCount: this.state.message.mementos.length + 2 });
      })
      .catch(error => {
        console.error('There was an unexpected error', error);
        // Update the state to show an error message
        this.setState({ error: error.toString(), isLoading: false });
      });
  }

  componentDidUpdate() {
    M.AutoInit();
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
    } else if (this.state.error) {
      let redirect;
      if (this.state.isRecipient) {
        redirect = '/recipient';
      } else {
        redirect = '/';
      }
      return (
        <>
          <div className="overlay position-absolute"></div>
          <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
            <h1 className="font-size-36 no-margin text-center">
              Unable to find message!
            </h1>
            <h2 className="font-size-24 text-center">
              Click on the parrot to go back!
            </h2>
            <Link to={redirect}>
              <img src="/images/parrot.png" className="width-100" />
            </Link>
          </div>
        </>
      );
    } else {
      const { messageTitle, recipientName, senderName, mementos, playlistId } =
        this.state.message;
      return (
        <>
          <div className="slides-overlay position-absolute"></div>
          <div>
            <IntroSlide
              isRecipient={this.state.isRecipient}
              nextSlide={this.nextSlide}
              title={messageTitle}
              sender={senderName}
              recipient={recipientName}
            />
            <RenderList
              isRecipient={this.state.isRecipient}
              nextSlide={this.nextSlide}
              previousSlide={this.previousSlide}
              entries={mementos}
              currentSlide={this.state.currentSlide}
            />
            <PlaylistSlide
              isRecipient={this.state.isRecipient}
              previousSlide={this.previousSlide}
              playlistId={playlistId}
              currentSlide={this.state.currentSlide}
              slideIndex={this.state.slideCount - 1}
            />
          </div>
        </>
      );
    }
  }
}

ViewMessage.contextType = AppContext;

function IntroSlide(props) {
  let redirect;
  if (props.isRecipient) {
    redirect = '/';
  } else {
    redirect = '/menu';
  }
  return (
    <div className="message-slide intro-slide-bg pt-75">
      <Link to={redirect}>
        <i className="material-icons position-absolute exit-slides">close</i>
      </Link>
      <div onClick={props.nextSlide} className="next"></div>
      <h1 className="font-size-48 text-center">{props.title}</h1>
      <h2 className="font-size-36 text-center">{`from ${props.sender}`}</h2>
      <h2 className="font-size-36 text-center">{`to ${props.recipient}`}</h2>
      <div className="row mt-40">
        <div className="column-half text-right">
          <img src="/images/parrot.png" className="width-140" />
        </div>
        <div className="column-half">
          <p className="font-size-24 text-center width-140">
            turn up your volume!
          </p>
        </div>
      </div>
    </div>
  );
}

class ContentSlide extends React.Component {
  render() {
    if (this.props.currentSlide !== this.props.slideIndex) {
      return null;
    } else {
      let redirect;
      if (this.props.isRecipient) {
        redirect = '/';
      } else {
        redirect = '/menu';
      }

      return (
        <div className="padding-1rem message-slide content-slide-yellow pt-75">
          <Link to={redirect}>
            <i className="material-icons position-absolute exit-slides">
              close
            </i>
          </Link>
          <div onClick={this.props.nextSlide} className="next"></div>
          <div onClick={this.props.previousSlide} className="previous"></div>
          <h1 className="font-size-36 text-center no-margin-top">
            {this.props.memento.title}
          </h1>
          <div className="row justify-center">
            <img
              className="materialboxed img-container"
              src={this.props.memento.image}
            />
          </div>
          <p className="font-size-36 text-center">
            {this.props.memento.caption}
          </p>
        </div>
      );
    }
  }
}

ContentSlide.contextType = AppContext;

function RenderList(props) {
  const entries = props.entries;
  const slideItems = entries.map(slide => (
    <li key={slide.slideIndex}>
      <ContentSlide
        isRecipient={props.isRecipient}
        nextSlide={props.nextSlide}
        previousSlide={props.previousSlide}
        memento={slide}
        slideIndex={slide.slideIndex}
        currentSlide={props.currentSlide}
      />
    </li>
  ));
  return <ul className="position-fixed">{slideItems}</ul>;
}

class PlaylistSlide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savedPlaylist: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const info = {
      token: this.context.accessToken,
      playlistId: this.props.playlistId
    };
    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
    };
    fetch('/api/playlist', init)
      .then(result => {
        return result.json();
      })
      .then(message => {
        this.setState({ savedPlaylist: true });
      })
      .catch(error => {
        console.error('There was an unexpected error', error);
      });
  }

  render() {
    const playlistLink = `https://open.spotify.com/embed/playlist/${this.props.playlistId}?utm_source=generator`;
    if (this.props.currentSlide !== this.props.slideIndex) {
      return null;
    } else {
      let redirect;
      if (this.props.isRecipient) {
        redirect = '/';
      } else {
        redirect = '/menu';
      }
      let saved;
      if (!this.state.savedPlaylist) {
        saved = 'Click me!';
      } else {
        saved = 'Saved!';
      }
      return (
        <div className="padding-1rem message-slide playlist-slide-bg pt-75">
          <Link to={redirect}>
            <i className="material-icons position-absolute exit-slides">
              close
            </i>
          </Link>
          <div onClick={this.props.previousSlide} className="previous"></div>
          <h1 className="font-size-36 text-center no-margin-top mb-12">
            Save this playlist?
          </h1>
          <div className="row justify-center align-center no-margin">
            <a onClick={this.handleClick}>
              <img src="/images/shell.png" className="width-60" />
            </a>
            <p className="font-size-24 pl-1rem">{saved}</p>
          </div>
          <div className="row justify-center padding-1rem">
            <iframe
              src={playlistLink}
              width="100%"
              height="380"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            ></iframe>
          </div>
        </div>
      );
    }
  }
}

PlaylistSlide.contextType = AppContext;

const ViewMessageWithParams = injectUseParams(ViewMessage);

export default ViewMessageWithParams;
