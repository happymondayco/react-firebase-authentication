import React from 'react';
import * as ROUTES from '../../constants/routes';
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false, needsVerification: true };
    }

    componentDidMount() {
      this.needsEmailVerification(this.context)
    }

    onSendEmailSignIn = (authUser) => {
      this.props.firebase
        .doSendEmailSignIn(authUser.email)
        .then(() => this.setState({ isSent: true }));
    };

    needsEmailVerification = (authUser) => {
      if(authUser) {
        this.props.firebase.hasSignedInWithEmail(authUser.email)
        .then(function(signInMethods) {
          debugger;
          const needsVerification = authUser &&
          !signInMethods.includes("emailLink") &&
          authUser.providerData
          .map(provider => provider.providerId)
          .includes('password');
          this.setState({ verified: !needsVerification })
          if(needsVerification) {
            this.props.firebase.doSignOut()
            .then(() => {
              this.props.history.push(ROUTES.HOME);
            })
          }
        }.bind(this));
      }
    }

    render() {
      return (
        <div>
          {
            this.state.needsVerification ? (
              <div>
                {this.state.isSent ? (
                  <p>
                    E-Mail confirmation sent: Check your E-Mails (Spam
                    folder included) for a confirmation E-Mail.
                    Refresh this page once you confirmed your E-Mail.
                  </p>
                ) : (
                  <p>
                    Verify your E-Mail: Check your E-Mails (Spam folder
                    included) for a confirmation E-Mail or send
                    another confirmation E-Mail.
                  </p>
                )}

                <button
                  type="button"
                  onClick={this.onSendEmailSignIn}
                  disabled={this.state.isSent}
                >
                  Send confirmation E-Mail
                </button>
              </div>
            ) : (
            <Component {...this.props} />
            )
          }
        </div>
      );
    }
  }

  WithEmailVerification.contextType = AuthUserContext;

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;