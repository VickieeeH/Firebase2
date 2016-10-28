import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Loader } from '../../shared/providers/loader';
import { AngularFire } from 'angularfire2';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  userControl: any
  userSubscriber: any
  userDetails: any
  userAuth: any

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private loader: Loader,
    public af: AngularFire,
    private alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    this.userControl = this.formBuilder.group({
      fullName: ['', Validators.required]
    });

    // Get user details and UID from firebase
    this.userDetails = {};
    var userObservable: any;

    if (!this.userAuth) {
      this.af.auth.subscribe(user => {
        if (!user) { return }
        this.userAuth = user;
        userObservable = this.af.database.object('/users/' + this.userAuth.uid);
        this.userSubscriber = userObservable.subscribe(snapshot => {
          // Loads all users related details form firebase
          this.userDetails.fullName = snapshot.fullName;
        });
      });
    }
  }

  ionViewWillUnload() {
    this.userSubscriber.unsubscribe();
  }

  updateUserSettings() {
    let fullName = this.userDetails.fullName;
    this.loader.show("Updating your settings...");
    let userRef = this.af.database.object('/users/' + this.userAuth.uid);
    userRef.update({ fullName: fullName })
    .then((user) => {
        this.loader.hide();
        this.alertCtrl.create({
          title: 'Success',
          message: 'Details updated',
          buttons: [{ text: 'Ok' }]
        }).present();
    })
    .catch((e) => {
      this.loader.hide();
      console.error(`Password Login Failure:`, e)
      this.alertCtrl.create({
        title: 'Error',
        message: `Failed to update details. ${e.message}`,
        buttons: [{ text: 'Ok' }]
      }).present();
    });
  }
}
