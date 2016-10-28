import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { AngularFireModule } from 'angularfire2';
import { EqualValidator } from '../shared/directives/equal-validator';  // import validator
import { Loader } from '../shared/providers/loader';
import { AuthenticationModule } from './authentication/authentication.module';
import { MenuModule } from './menu/menu.module';
import { AboutPage } from '../pages/about/about';
import { SettingsPage } from '../pages/settings/settings';

export const firebaseConfig = {
  apiKey: "AIzaSyDIGVuRp6PUDAolg09egomjSzDgCZGQiKU",
  authDomain: "ibeacon-afa61.firebaseapp.com",
  databaseURL: "https://ibeacon-afa61.firebaseio.com",
  storageBucket: "ibeacon-afa61.appspot.com"
};

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    AboutPage,
    SettingsPage,
    EqualValidator
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AuthenticationModule,
    MenuModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    AboutPage,
    SettingsPage
  ],
  providers: [Loader]
})
export class AppModule {}
