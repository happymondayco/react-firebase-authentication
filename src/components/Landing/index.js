import React, { Component } from 'react';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

import { withFirebase } from '../Firebase';

class Landing extends Component {
  constructor(props) {
    super(props);

    if(this.props.firebase.isSignInWithEmailLink()) {
      var email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      }
      
      this.props.firebase.signInWithEmailLink(email, window.location.href)
      .then(() => {
        window.localStorage.removeItem('emailForSignIn');
        this.props.history.push(ROUTES.ACCOUNT);
      })
      .catch(error => {
        this.setState({ error });
      });
    }

  }
  render() {
    return (
      <div>
        <h1>Landing</h1>
      </div>
    );
  }
}

export default compose(
  withFirebase,
)(Landing);

