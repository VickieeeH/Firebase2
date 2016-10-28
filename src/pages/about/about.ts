import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Loader } from '../../shared/providers/loader';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  authSubscription: any;
  userDetails = { uid: '', provider: '', fullName: '', email: '', avatar: ''};
  chatControl: any;

  messages: FirebaseListObservable<any[]>;
  message: string = '';

  constructor(
    public navCtrl: NavController,
    public af: AngularFire,
    private loader: Loader,
    private formBuilder: FormBuilder
  ) {
    // Get messages and join with user details
    this.messages = <FirebaseListObservable<any>> af.database.list('messages', {
      query: { limitToLast: 5, orderByKey: true }
    });

    // Get details from the user currently logged in
    this.authSubscription = this.af.auth.subscribe((auth) => {
      if (auth) { this.populateUser(auth) }
    });
  }

  sendMessage() {
    this.af.database.list('/messages')
    .push({
      fullName: this.userDetails.fullName,
      provider: this.userDetails.provider,
      avatar: this.userDetails.avatar,
      value: this.message
    });
    this.message = '';
  }

  // Verify if there is an avatar, if not assign a default one
  loadAvatar(avatarUrl) {
    return avatarUrl ? avatarUrl : 'assets/icon/no-avatar.png';
  }

  // Resolve provider ids
  getProvider(id) {
    var providerNames = [
      '',
      'Twitter',                //1
      'Facebook',               //2
      'GooglePlus',             //3
      'Firebase user/password', //4
      'Anonymous'               //5
    ];
    return providerNames[id];
  }

  ionViewDidLoad() {
    this.chatControl = this.formBuilder.group({
      message: ['', Validators.required]
    });
  }

  ionViewWillUnload() {
    this.authSubscription.unsubscribe();
  }

  populateUser(user) {
    this.userDetails.uid = user.uid;
    let userObservable = this.af.database.object(`/users/${user.auth.uid}`);
    userObservable.subscribe(snapshot => {
      // Load custom fields from your user registration
      this.userDetails.provider = this.getProvider(snapshot.provider);
      this.userDetails.fullName = snapshot.fullName ? snapshot.fullName : this.userDetails.provider;
      this.userDetails.email = snapshot.email;
      this.userDetails.avatar = this.loadAvatar(snapshot.avatar);
    });
  }

  logout() {
    this.af.auth.logout();
    this.navCtrl.pop();
  }
}
