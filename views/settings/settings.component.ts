import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from './password-validation';
import { LoginUserService } from 'src/app/services/login-user.service';
import { HttpService } from 'src/app/services/http.service';
import { User } from 'src/app/model/user';
import { MatSnackBar } from '@angular/material';

/**
 * @author Felix Neudecker
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settingsForm: FormGroup;

  toUpdate: User;

  /**
   * 
   * Erzeugt eine Instanz von
   * 
   * @param router - zum Wechseln zwischen Komponenten
   * @param fb - zum Bauen von Formularen (Reactive Forms)
   * @param user - für alle Benutzerzugriffe und zum Zugriff auf den eingeloggten Benutzer
   * @param httpService - zum Aufrufen von Rest-Methoden auf dem Server
   * @param snackBar - zum Anzeigen von Notifications (wie 'Inserted Data')
   */
  constructor(private router: Router, private fb: FormBuilder, public user: LoginUserService, private httpService: HttpService, private snackBar: MatSnackBar) { }

  /**
   * Die ngOnInit()-Methode setzt zuerst einen neuen, leeren Benutzer. Danach wird die Methode buildForm aufgerufen, welche
   * die Form-Group initialisiert. 
   */
  ngOnInit() {
    //alert(Number(localStorage.getItem("userid")));
    // this.user.getUser(Number(localStorage.getItem("userid")));

    this.toUpdate = new User();

    console.log(this.user.loggedInUser.lastname);

    this.buildForm();

  }


  /**
   * Die Methode buildForm() legt bei einer FormGroup die Felder fest, für welche der Benutzer dann Werte eingeben kann. Das Settingsform hat die Felder
   * Vorname, Nachname, Email, Passwort und Passwort wiederholen. Alle diese Felder sind notwendig, sprich der User muss sie eingeben. Ist ein Feld leer,
   * so ist der Button "save" nicht drückbar. Das Passwort muss noch mindestens 8 Zeichen lang sein. Ist es nicht 8 Zeichen lang, so ist der Button "save"
   * auch nicht drückbar. Zum Schluss wird noch die Methode presetValues() aufgerufen.   
   */
  buildForm() {
    this.settingsForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    },
      { validator: MustMatch('password', 'confirmPassword') }
    );

    this.presetValues();

  }

  /**
   * In der Methode presetValues() werden die Werte des Vornamens, Nachnamens und der Email mit den bisherigen Eingaben, sprich die bisher beim Benutzer 
   * in der Datenbank stehen auf die FormGroup gesetzt. 
   */
  presetValues() {
    //    this.user.getUser(Number(localStorage.getItem("userid")));
    this.settingsForm.get("firstname").setValue(this.user.loggedInUser.firstname)
    this.settingsForm.get("lastname").setValue(this.user.loggedInUser.lastname)
    this.settingsForm.get("email").setValue(this.user.loggedInUser.email)
  }

  /**
   * Die Methode getErrorMessagePassword() gibt entweder den Error "You must enter a value" oder den Error "Your passwords do not match or is too short"
   * zurück, falls das Feld leer ist oder die Passwörter nicht übereinstimmen.  
   * 
   * @returns string - Error Message
   */
  getErrorMessagePassword() {
    return this.settingsForm.get('password').hasError('required') ? 'You must enter a value' :
      this.settingsForm.get('password').hasError ? 'Your passwords do not match or is too short' :
        '';
  }

  /**
   * Die Methode getErrorMessageFirstname() gibt den Error "You must enter a value" zurück, falls kein Wert für das Feld eingegeben wird.
   * 
   * @returns string - Error Message
   */
  getErrorMessageFirstname() {
    return this.settingsForm.get('firstname').hasError('required') ? 'You must enter a value' :
      '';
  }

  /**
   * Die Methode getErrorMessageLastname() gibt den Error "You must enter a value" zurück, falls kein Wert für das Feld eingegeben wird.
   * 
   * @returns string - Error Message
   */
  getErrorMessageLastname() {
    return this.settingsForm.get('lastname').hasError('required') ? 'You must enter a value' :
      '';
  }

  /**
   * Die Methode getErrorMessageEmail() gibt den Error "You must enter a value" zurück, falls kein Wert für das Feld eingegeben wird.
   * 
   * @returns string - Error Message
   */
  getErrorMessageEmail() {
    return this.settingsForm.get('email').hasError('required') ? 'You must enter a value' :
      this.settingsForm.get('email').hasError('email') ? 'Not a valid email' :
        '';
  }

  /**
   * Die Methode navigateToAllCharts() navigiert wieder zur Startseite durch einen Router zurück. 
   */
  navigateToAllCharts() {
    this.router.navigate(['allCharts']);
  }

  /**
   * Die Funktion checkToServer() setzt alle Werte von der FormGroup auf einen neuen User. Es ruft dann die Methode updateUser im 
   * HttpService auf, welche den mitbekommenen User an den Server schickt. Dieser updated den User. Funktioniert dies nicht, so zeigt
   * die Snackbar an, dass Fehler aufgetreten sind. Hat das funktioniert, so wird das in der Snackbar angezeigt und man wird auf die
   * Startseite umgeleitet.   
   * 
   * @returns true - falls das Speichern funktioniert hat 
   *          false - falls das Speichern/der Serverzugriff nicht funktioniert hat. Führt dazu, dass die Methode verlassen wird.
   */
  checkToServer(): Boolean {
    console.log("bind drinnen");
    //alert("balblaalba");

    console.log(this.user.loggedInUser.id)

    //die Werte der Felder werden in einen User gespeichert
    this.toUpdate.id = this.user.loggedInUser.id;
    this.toUpdate.firstname = this.settingsForm.get("firstname").value;
    this.toUpdate.lastname = this.settingsForm.get("lastname").value;
    this.toUpdate.email = this.settingsForm.get("email").value;
    this.toUpdate.password = this.settingsForm.get("password").value;

    //Aufruf einer httpService-Methode, die eine Serverfunktion aufruft
    this.httpService.updateUser(this.toUpdate, this.user.loggedInUser.id).subscribe(data => {
      //falls der Rückgabeparameter = null ist, dann werden Fehler angezeigt und false zurückgegeben
      if (data === null) {
        this.openSnackBar("Some errors apperead. Please update your Settings again. ", "dismiss");
        return false;
      }

      //der User mit den neuesten Daten wird gesetzt.
      this.user.updateLoggedIn(data);
      this.openSnackBar("Your settings were updated. ", "dismiss");

      this.router.navigate(['allCharts']);

    });

    return true;

  }

  /**
   * Die Methode openSnackBar() legt eine neue Snackbar mit einer Nachricht an. Diese Nachricht wird für 5s (5000ms ) angezeigt und kann weggeklickt werden
   * (dismiss). 
   * 
   * @param message - die Nachricht welche angezeigt werden soll
   * @param action - die Action, die ausgeführt werden soll (z.B: "dismiss", zum Wegklicken der Snackbar)
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000, panelClass: ['snackbar']
    });
  }


  /*onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.settingsForm.invalid) {
          return;
      }

      alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.settingsForm.value))

      
  }*/

}
