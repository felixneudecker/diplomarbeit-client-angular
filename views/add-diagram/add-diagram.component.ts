import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUserService } from 'src/app/services/login-user.service';
import { HttpService } from 'src/app/services/http.service';
import { Diagram } from 'src/app/model/diagram';
import { Datasource } from 'src/app/model/datasource';
import { DatasourceService } from 'src/app/services/datasource.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-diagram',
  templateUrl: './add-diagram.component.html',
  styleUrls: ['./add-diagram.component.scss']
})
export class AddDiagramComponent implements OnInit {

  diagramForm : FormGroup;

  charts = [
    "pie-chart",
    "bar-chart",
    "linechart",
    "donut-chart"
  ]

  testDataSources = [
    "Maschinenauslstung",
    "Serverauslastung",
    "balbalbalub"
  ]

  toInsert : Diagram;

  /**
   * Erzeugt eine Instanz des Navigations-Components. 
   * 
   * @param user - für alle Benutzerzugriff und zum Zugriff auf den aktuell aktiven Benutzer
   * @param dservice - zum Zugriff auf alle Datasource-Daten/Funktionen
   * @param router - zum Wechseln zwischen Komponenten
   * @param fb - zum Bauen von Formularen
   * @param httpService - zum Aufrufen von Rest-Methoden auf dem Server
   * @param snackBar - zum Anzeigen von Notifications (wie 'Inserted Data')
   */
  constructor(private router : Router, private fb : FormBuilder, public user :LoginUserService, private httpService: HttpService, public dservice : DatasourceService, private snackBar: MatSnackBar ){
    this.toInsert = new Diagram();
  }

  ngOnInit(){
    //Erstellen des ReactiveForm-Formulares
    this.createForm();
  }

  private createForm(){
    //Das ReactiveForm hat die Felder Titel, Typ, Labels, Datasources/ alle diese Felder haben ein 'required' als Validator (=> sie sind notwendig!)
    this.diagramForm = this.fb.group({
      title : ['', Validators.required],
      type : new FormControl(this.charts[0], Validators.required),
      labels: this.fb.array([
        this.fb.control('',[Validators.required])
      ]),
      datasource: new FormControl(Datasource, Validators.required)
    });

  }

  //retuniert alle Labels
  get labels() {
    return this.diagramForm.get('labels') as FormArray;
  }

  //hinzufügen eines Labels 
  addLabel() {
    this.labels.push(this.fb.control('', Validators.required));
  }

  //Deletes a field 
  deleteField(i : number){
    const ob = this.diagramForm.get("labels") as FormArray; 
    ob.removeAt(i);
  }
 
  printDatasets(){

    //sezten der Werte auf ein leeres Diagram
    this.toInsert.title = this.diagramForm.get("title").value;
    this.toInsert.type = this.diagramForm.get("type").value;
    this.toInsert.userid = this.user.loggedInUser.id;
    this.toInsert.labels = this.diagramForm.get("labels").value;
    this.toInsert.datasource_id = this.diagramForm.get("datasource").value;

    //im HttpService wird die Methode insertDiagram, mit den Paramter Userid und einem Diagram aufgerufen
    this.httpService.insertDiagram(this.toInsert, this.user.loggedInUser.id).subscribe(data => {

      //falls der Rückgabewert leer ist wird eine Snackbar mit einer Fehlermeldung ausgegeben
      if(data.toString() === '' || data.toString() == null){
        this.openSnackBar("Some errors ocurred. Please try again. ", "dismiss");
        alert("Failed to insert a new DataSource")
        return false;
      }else{
        //sonst wird eine Snackbar mit einer Erfolgsmeldung geöffnet und auf die Startseite umgeleitet. 
        this.openSnackBar("The Diagram was inserted successfully.", "dismiss");
       this.router.navigate(['allCharts']);
      }
    });

  }

  /**
   * Die Methode navigateToAllCharts() navigiert zur Seite Login (zum schnellen Wechseln zwischen Login und Register). 
   */
  navigateToAllCharts(){
    this.router.navigate(['allCharts']);
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
      duration: 2000,
    });
  }




}
