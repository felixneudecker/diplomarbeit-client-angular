import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/model/user';
import { MustMatch } from '../settings/password-validation';
import { LoginUserService } from 'src/app/services/login-user.service';
import { MatSnackBar } from '@angular/material';

/**
 * @author Felix Neudecker
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})


export class RegisterComponent implements OnInit {

  newUser: User;
  registerForm: FormGroup;
  response: string;

  /**
   * Generiert eine Instanz der Regiser-Component.
   * @param router - zum Wechseln zwischen Komponenten
   * @param httpService - zum Aufrufen von Rest-Methoden auf dem Server
   * @param fb - zum Bauen von Formularen (Reactive Forms)
   * @param loginUser - für alle Benutzerzugriffe und zum Zugriff auf den eingeloggten Benutzer
   * @param snackBar - zum Anzeigen von Notifications (wie 'Inserted Data')
   */
  constructor(private router: Router, private httpService: HttpService, private fb: FormBuilder, public loginUser: LoginUserService, private snackBar: MatSnackBar) {
    this.newUser = new User();
  }

  /**
   * ruft die Methode createForm() auf. 
   */
  ngOnInit() {
    this.createForm();
  }

  /**
   * Die Methode createForm() legt bei einer FormGroup die Felder fest, für welche der Benutzer dann Werte eingeben kann. Das registerForm hat die Felder
   * Vorname, Nachname, Email, Passwort und Passwort wiederholen. Alle diese Felder sind notwendig, sprich der User muss sie eingeben. Ist ein Feld leer,
   * so ist der Button "save" nicht drückbar. Das Passwort muss noch mindestens 8 Zeichen lang sein. Ist es nicht 8 Zeichen lang, so ist der Button "save"
   * auch nicht drückbar.
   */
  private createForm() {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(200)]],
      lastname: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]]
    }, { validator: MustMatch('password', 'confirmPassword') });
  }

  /**
   * Die Methode getErrorMessageEmail() gibt den Error "You must enter a value" zurück, falls kein Wert für das Feld eingegeben wird.
   * 
   * @returns string - Error Message
   */
  getErrorMessageEmail() {
    return this.registerForm.get('email').hasError('required') ? 'You must enter a value' :
      this.registerForm.get('email').hasError('email') ? 'Not a valid email' :
        '';
  }

  /**
   * Die Methode getErrorMessagePassword() gibt entweder den Error "You must enter a value" oder den Error "Your passwords do not match or is too short"
   * zurück, falls das Feld leer ist oder die Passwörter nicht übereinstimmen.  
   * 
   * @returns string - Error Message
   */
  getErrorMessagePassword() {
    return this.registerForm.get('password').hasError('required') ? 'You must enter a value' :
      this.registerForm.get('password').hasError ? 'Your passwords do not match or is too short' :
        '';
  }

  /**
   * Die Methode register() ruft zuerst die Methode checkInputs() auf. Gibt diese true zurück, so wird die Methode register im httpService aufgerufen. Diese bekommt 
   * den zu einzufügenen Benutzer mit. Ist der Rückgabewert leer, so wird eine Snackbar mit einem Error geöffnet und false zurückgegebn und dadurch wird die Methode 
   * verlassen. Ist der User nicht leer (hat das Updaten funktioniert) wird eine Snackbar mit einer Rückmeldung geöffnet und man wird zur Login-Seite navigiert. 
   * 
   * @returns register 
   */
  register(): Boolean {
    if (this.checkInputs()) {

      
      this.httpService.register(this.newUser).subscribe(resp => {

        if (resp.toString() === '' || resp.toString() == null) {
          this.openSnackBar("Registration failed. Please try it again.", "dismiss");
          return false;
        } else {
          this.openSnackBar("You are now registered! Please log in.", "dismiss");
          this.router.navigate(['login']);
        }

      });

    }
    return true;

  }

  /**
   * Die Methode checkInputs() überprüft, ob jedes Feld auch einen Wert hat. Ist dies der Fall wird true zurückgeben. Anderfalls wird eine Snackbar aufgerufen, 
   * die einen Fehler anzeigt und false zurückgibt. 
   * 
   * @returns true - jedes Feld einen Wert hat
   *          false - falls Felder leer sind
   */
  checkInputs(): Boolean {

    this.newUser.firstname = this.registerForm.get("firstname").value;
    this.newUser.lastname = this.registerForm.get("lastname").value;
    this.newUser.email = this.registerForm.get("email").value;
    this.newUser.password = this.registerForm.get("password").value;
    this.newUser.position = "Mitarbeiter";

    if (this.newUser.firstname === '' || this.newUser.firstname == null
      || this.newUser.password === '' || this.newUser.password == null
      || this.newUser.email === '' || this.newUser.email == null
      || this.newUser.lastname === '' || this.newUser.lastname == null
    ) {
      // if input is empty -> snackbar: 'register failed'
      this.openSnackBar("Registration failed. Please try it again.", "dismiss");
      return false;
    } else {

      return true;
    }

  }

  /**
   * Die Methode navigateToLogin() navigiert zur Seite Login (zum schnellen Wechseln zwischen Login und Register). 
   */
  navigateToLogin() {
    this.router.navigate(["login"]);
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

}
