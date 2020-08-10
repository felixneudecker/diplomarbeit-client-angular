import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUserService } from 'src/app/services/login-user.service';
import { User } from 'src/app/model/user';
import { Datasource } from 'src/app/model/datasource';
import { HttpService } from 'src/app/services/http.service';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-add-datasource',
  templateUrl: './add-datasource.component.html',
  styleUrls: ['./add-datasource.component.scss']
})
export class AddDatasourceComponent implements OnInit {

  //Forms Module: 
  datasourceForm : FormGroup;
  datasetArray  = new Array;

  toStore : Datasource;

  userFor : User = new User();

  /**
   * Erzeugt eine Instanz des AddDataSource-Components. 
   * 
   * @param user - für alle Benutzerzugriff und zum Zugriff auf den aktuell aktiven Benutzer
   * @param router - zum Wechseln zwischen Komponenten
   * @param fb - zum Bauen von Formularen
   * @param httpService - zum Aufrufen von Rest-Methoden auf dem Server
   * @param snackBar - zum Anzeigen von Notifications (wie 'Inserted Data')
   */
  constructor(private router : Router, private fb : FormBuilder, public user :LoginUserService, private httpService: HttpService, private snackBar: MatSnackBar){
    //eine neue Datasource wird angelegt
    this.toStore = new Datasource();

    //der User wird aus dem UserService geholt und gespeichert
    this.userFor = user.loggedInUser;
  }

  ngOnInit(){
    this.createForm();
  }

  private createForm(){
    //die FormGroup datasourceForm hat die Felder device und dataset
    this.datasourceForm = this.fb.group({
      device : ['', Validators.required],
      dataset: this.fb.array([
        this.fb.control('',[Validators.required, this.patternValidator(/^-?\d+(\.)?\d+$/)])
      ])
    });
  }

  //gibt alle Werte, die in dem FormArray namens dataset drinnen sind, zurück
  get dataset() {
    return this.datasourceForm.get('dataset') as FormArray;
  }

  //fügt zu dem FormArray ein neues Element hinzu
  addDataset() {
    this.dataset.push(this.fb.control('', Validators.required));
  }

  printDatasets(){   
    //Auf die neue Datasource werden alle Daten gesetzt
    this.toStore.device = this.datasourceForm.get('device').value;
    this.toStore.dataset = this.datasourceForm.get('dataset').value;
    this.toStore.userid = this.userFor.id;

    //im httpService wird die Methode insertDataSource, mit den Parameter toStore (Datasource, die einzufügen ist ), aufgerufen
    this.httpService.insertDataSource(this.toStore).subscribe(resp => {

      //Falls die Response leer ist wird in einer Snackbar Fehler ausgegeben
         if(resp.toString() === '' || resp.toString() == null){
           this.openSnackBar("Some errors apperead. Please update your Settings again.", "dismiss");

           return false;
         }else{
          this.openSnackBar("Added Datasource '" + this.toStore.device + "' successfully.", "dismiss");

          this.router.navigate(['allCharts']);
         }

    });
  }

  /**
   * Die Methode navigateToAllCharts() navigiert zur Seite Login (zum schnellen Wechseln zwischen Login und Register). 
   */
  navigateToAllCharts(){
    this.router.navigate(["allCharts"]);
  }
  

   private patternValidator(regexp: RegExp){
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      if (value === '') {
        return null;
      }
      return !regexp.test(value) ? { 'patternInvalid': { regexp } } : null;
    };

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


  deleteField(i : number){

    const ob = this.datasourceForm.get("dataset") as FormArray; 

    ob.removeAt(i);
  }

}