import { NgModule } from '@angular/core';
import { LoginPage } from "./pages/login/login";
import { AuthenticatorService } from "./providers/authenticator";
import { RegistrationPage } from "./pages/registration/registration";
import { IonicModule } from 'ionic-angular';


@NgModule({
  imports: [IonicModule],
  declarations: [LoginPage, RegistrationPage],
  providers: [AuthenticatorService],
  entryComponents: [LoginPage, RegistrationPage]
})
export class AuthenticationModule {
}
