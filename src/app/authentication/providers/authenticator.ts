import { Injectable } from '@angular/core';
import { Events } from "ionic-angular";
import { AngularFire, AuthMethods, AuthProviders } from 'angularfire2';
import { Facebook, GooglePlus, TwitterConnect } from 'ionic-native'
import { Loader } from '../../../shared/providers/loader';

@Injectable()
export class AuthenticatorService {

  authSubscription: any;
  constructor(
    private events: Events,
    private af: AngularFire,
    private loader: Loader
  ) {
  }

  anonymousUser() {
    var promise = new Promise<any>((resolve, reject) => { 
      this.loader.show("Logging as Anonymous");
      this.af.auth.login({
        method: AuthMethods.Anonymous,
        provider: AuthProviders.Anonymous
      })
      .then((user) => {
        let userRef = this.af.database.object('/users/' + user.auth.uid);
        userRef.set({ provider: user.provider });
        this.loader.hide();
        this.events.publish('user:login', user);
        resolve(user);
      })
      .catch(e => {
        this.loader.hide();
        console.error(`Anonymous Login Failure:`, e)
        reject(e);
      });
    });
    return promise;
  }

  // BROWSER MODE ON
  // Use this to enable oAuth in browser - eg ionic serve
  // ---------------------------------------------------------
  signInWithOAuthBrowserMode(provider: string) {
    var promise = new Promise<any>((resolve, reject) => { 
      this.loader.show(`Logging with ${provider} (Browser Mode)`);
      this.af.auth.login({
        method: AuthMethods.Popup,
        provider: (<any>AuthProviders)[provider]
      })
      .then((user) => {
        let userRef = this.af.database.object('/users/' + user.auth.uid);
        this.authSubscription = userRef.subscribe(data => {
          if(data.$value !== null) {
            userRef.update({
              email: user.auth.email,
              avatar: user.auth.photoURL,
            }).then(() => { this.authSubscription.unsubscribe() });
          } else {
            userRef.set({
              provider: user.provider,
              fullName: user.auth.displayName,
              email: user.auth.email,
              avatar: user.auth.photoURL,
            }).then(() => { this.authSubscription.unsubscribe() });
          }
        });
        this.events.publish('user:login', user);
        this.loader.hide();
        resolve(user);
      })
      .catch(e => {
        this.loader.hide();
        console.error(`${provider} Login Failure:`, e)
        reject(e);
      });
    });
    return promise;
  }

  // BROWSER MODE OFF
  // oAuth using ionic-native plugins
  // Use this function instead of the one above to run this app on your phone
  signInWithOAuth(provider: string) {
    var promise = new Promise<any>((resolve, reject) => { 
      this.loader.show(`Logging with ${provider}`);
      switch(provider) {
        case "Google":
          GooglePlus.login(
            {
              'scopes': '',
              'webClientId': 'GET GOOGLE PLUS WEBSCLIENT ID HERE',
              'offline': true,
            }
          ).then((result) => {
            let creds = firebase.auth.GoogleAuthProvider.credential(result.idToken);
            this.oAuthWithCredential(provider, creds)
            .then((user) => { resolve(user) })
            .catch((e) => { reject(e) });
          })
          .catch((e) => {
            this.loader.hide();
            reject(e)
          });
          break;
        case "Facebook":
          Facebook.login(["email"]).then((result) => {
          let creds = firebase.auth.FacebookAuthProvider.credential(result.authResponse.accessToken);
            this.oAuthWithCredential(provider, creds)
            .then((user) => { resolve(user) })
            .catch((e) => { reject(e) });
          });
          break;
        case "Twitter":
          TwitterConnect.login().then((result) => {
            let creds = firebase.auth.TwitterAuthProvider.credential(result.token, result.secret);
            this.oAuthWithCredential(provider, creds)
            .then((user) => { resolve(user) })
            .catch((e) => { reject(e) });
          })
          .catch((e) => {
            e.message = "You don't have Twitter client";
            this.loader.hide();
            reject(e)
          });
          break;
      }
    });
    return promise;
  }

  // Signin with credentials
  private oAuthWithCredential(provider: string, creds: any) {
    var promise = new Promise<any>((resolve, reject) => { 
      this.af.auth.login(creds, {
        provider: (<any>AuthProviders)[provider],
        method: AuthMethods.OAuthToken
      })
      .then((user) => {
        // Loading some user info to firebase
        let userRef = this.af.database.object('/users/' + user.auth.uid);
        userRef.subscribe(data => {
          if(data.$value !== null) {
            userRef.update({
              email: user.auth.email,
              avatar: user.auth.photoURL
            });
          } else {
            userRef.set({
              provider: user.provider,
              fullName: user.auth.displayName,
              email: user.auth.email,
              avatar: user.auth.photoURL
            });
          }
        });
        this.events.publish('user:login', user);
        this.loader.hide();
        resolve(user);
      })
      .catch(e => {
        this.loader.hide();
        console.error(`${provider} Login Failure:`, e)
        reject(e);
      });
    });
    return promise;
  }

  // Perform login using user and password
  login(email: string, password: string) {
    var promise = new Promise<any>((resolve, reject) => { 
      this.loader.show("Logging with Firebase email/password");
      this.af.auth.login({ email, password }, {
        method: AuthMethods.Password,
        provider: AuthProviders.Password
      })
      .then((user) => {
        this.loader.hide();
        this.events.publish('user:login', user);
        resolve(user);
      })
      .catch(e => {
        this.loader.hide();
        console.error(`Password Login Failure:`, e)
        reject(e);
      });
    });
    return promise;
  }

  // Reset password
  resetPassword(email) {
    var promise = new Promise<any>((resolve, reject) => { 
      this.loader.show("Resetting your password");
      firebase.auth().sendPasswordResetEmail(email).
        then((result: any) => {
        this.loader.hide();
        this.events.publish('user:resetPassword', result);
        resolve();
      }).catch((e: any) => {
        this.loader.hide();
        reject(e);
      });
    });
    return promise;
  }
}
