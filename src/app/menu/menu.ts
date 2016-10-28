import { Component, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular';
import { LoginPage } from '../authentication/pages/login/login';
import { AngularFire } from 'angularfire2';
import { Page1 } from '../../pages/page1/page1';
import { Page2 } from '../../pages/page2/page2';
import { AboutPage } from '../../pages/about/about';
import { SettingsPage } from '../../pages/settings/settings';

@Component({
  templateUrl: 'menu.html'
})
export class Menu {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = AboutPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    private af: AngularFire
  ) {
    // Add your pages to be displayed in the menu

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Page One', component: Page1 },
      { title: 'Page Two', component: Page2 },
      { title: 'About Page', component: AboutPage },
      { title: 'Setting Page', component: SettingsPage }
    ];
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.af.auth.logout();
    this.nav.setRoot(LoginPage);
  }
}
