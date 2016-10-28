import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Events } from 'ionic-angular';
import { Menu } from './menu/menu';
import { LoginPage } from './authentication/pages/login/login';
import { AngularFire } from 'angularfire2';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(public platform: Platform, private events: Events, private af: AngularFire) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // Verify if user is logged in
      this.af.auth.subscribe(user => {
        if (user) {
          console.info("Authenticated - pushing menu");
          this.rootPage = Menu;
        } else {
          console.info("User not logged in");
          this.rootPage = LoginPage;
        }
      });

      // Available events for Authentication
      this.events.subscribe('user:login', user => {
        console.info("This was trigger by the user:login event.");
      });

      this.events.subscribe('user:create', user => {
        console.info("This was trigger by the user:create event.");
      });

      this.events.subscribe('user:resetPassword', user => {
        console.info("This was trigger by the user:resetPassword event.");
      });

      Splashscreen.hide();
    });
  }
}
