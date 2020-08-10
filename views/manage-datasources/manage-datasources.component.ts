import { Component, OnInit } from '@angular/core';
import { DatasourceService } from 'src/app/services/datasource.service';
import { Datasource } from 'src/app/model/datasource';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { MatSnackBar } from '@angular/material';
import { ViewService } from 'src/app/services/view.service';
import { DiagramService } from 'src/app/services/diagram.service';

@Component({
  selector: 'app-manage-datasources',
  templateUrl: './manage-datasources.component.html',
  styleUrls: ['./manage-datasources.component.scss']
})
export class ManageDatasourcesComponent implements OnInit {

  datasourceForm: FormGroup;
  activeDatasource: Datasource;
  updateDatasource: Datasource = new Datasource();

  dataSourcesToChooseFrom: Datasource[];

  numb : number;

  pressed: boolean = false;

  values: [number];


  /**
   * Erzeugt eine Instanz des Navigations-Components. 
   * 
   * @param datasourceService - für alle Diagrammzugriffen und zum Zugriff auf ein Array mit Diagrammen
   * @param router - zum Wechseln zwischen Komponenten
   * @param fb - zum Bauen von Formularen
   * @param httpService - zum Aufrufen von Rest-Methoden auf dem Server
   * @param snackBar - zum Anzeigen von Notifications (wie 'Inserted Data')
   */
  constructor(public datasourceService: DatasourceService, private router: Router, private fb: FormBuilder, private httpService: HttpService, private snackBar: MatSnackBar, public viewService : ViewService, public diagramService : DiagramService) { }

  ngOnInit() {
    //Es werden alle Datensources von einem User geladen
    this.dataSourcesToChooseFrom = this.datasourceService.getAllDataSourcesFromOne(Number(localStorage.getItem("userid")));

    //Erstellen des ReactiveForm-Formulares
    this.createForm();
  }


  createForm() {
    //das Formular hat die Felder device und Dataset
    this.datasourceForm = this.fb.group({
      device: ['', Validators.required],
      dataset: this.fb.array([
        //validator -> dass nur Nummern eingegeben werden dürfen
        this.fb.control('', [this.patternValidator(/^-?\d+(\.)?\d+$/)])
      ])
    });

  }

  //gibt die dataset-werte zurück
  get dataset() {
    return this.datasourceForm.get('dataset') as FormArray;
  }

  //fügt einen neuen dataset mit einem Validator ein
  addDataset() {
    this.dataset.push(this.fb.control('', [this.patternValidator(/^-?\d+(\.)?\d+$/)]));
  }


  //zum Auswählen der Datasource, die zu Ändern ist
  activeButton(i: number) {
    this.numb = i;

    //Variable pressed wird beim pressen auf true gesetzt
    this.pressed = true;

    //die aktive Datasource wird vom Array an der Stelle des gepresseten Buttons(i) gesetzt
    this.activeDatasource = this.datasourceService.sourcesFromOneUser[i];

    //bisherige Werte werden auf den Array values gesetzt
    this.values = this.activeDatasource.dataset;

    this.datasourceForm.get("dataset").reset;

    //die Gerätebezeichnung wird automatisch gesetzt
    this.datasourceForm.get("device").setValue(this.activeDatasource.device);
  }

  /**
   * Die Methode navigateToAllCharts() navigiert zur Seite Login (zum schnellen Wechseln zwischen Login und Register). 
   */
  navigateToAllCharts() {
    this.router.navigate(["allCharts"]);
  }


  /**
   * Schaut ob eine Eingabe einem gewissen Eingabemuster entspricht und gibt unterschiedliche Werte zurück,
   * falls dies funktioniert hat oder nicht.
   * 
   * @param regexp - Expression nach der überprüft werden soll
   * @returns  patternInvalid - falls der Test nicht funktioniert hat
   *            null - falls der Test funktionierte
   */
  private patternValidator(regexp: RegExp) {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      if (value === '') {
        return null;
      }
      return !regexp.test(value) ? { 'patternInvalid': { regexp } } : null;
    };

  }


  sendToServer(): Boolean {

    //Überprüfen, ob nummer vorkommt: 

    console.log("ID" + this.activeDatasource.id);

    //Dem neuen Objekt, welches in der DB aktualisert werden soll ,werden die ID und der Gerätename gesetzt. 
    this.updateDatasource.id = this.activeDatasource.id;
    this.updateDatasource.device = this.datasourceForm.get("device").value;

    //Falls die Werte im FormArray 'dataset' leer sind 
    if (this.datasourceForm.get("dataset").value == null || this.datasourceForm.get("dataset").value == '') {
      //werden die 'alten' Werte verwendet
      this.updateDatasource.dataset = this.values;
    } else {
      //sonst werden diese durchgegangen und zu dem values (den bisherigen Werten) mit push hinzugefügt
      for (var i = 0; i < this.datasourceForm.get("dataset").value.length; i++) {
        this.values.push(this.datasourceForm.get("dataset").value[i]);
      }
      //dem Datasource-Objekt werden auch diese Werte zugewiesen
      this.updateDatasource.dataset = this.values;
    }

    this.updateDatasource.userid = this.activeDatasource.userid;

    //im httpService wird die Methode updateDatasource mit der DataSource-Id der zu updateten Datasource und der Datasource, die die Werte hat, aufgerufen. 
    this.httpService.updateDatasource(this.updateDatasource, this.updateDatasource.id).subscribe(data => {

      //falls die zurückkommende Nachricht leer ist, wird eine Snackbar geöffnet
      if (data === null) {
        this.snackBar.open("Could not update the Datasource", "dismiss")
        return false;
      }

      //sonst wird eine neue Snackbar erstellt und auf die Startseite weitergeleitet
      this.snackBar.open("Updated Datasource successfully", "dismiss");
      this.datasourceService.getAllDataSources();
      
     
      //this.router.navigate(['allCharts']);


    });

    
    this.diagramService.getUserDiagrams(Number(localStorage.getItem("userid")));
    this.viewService.updateAllViews(Number(localStorage.getItem('userid')));

    this.router.navigateByUrl('allCharts');

    return true;
  }

  updateDatasets(event: any, i: number) {
    //values[i] bekommt den eingegebenen/geänderten Wert
    this.values[i] = Number(event.target.value);
  }

  deleteDataSource() {

    //im httpService wird die Methode deleteDatasource mit der DataSource-Id aufgerufen 
    this.httpService.deleteDatasource(this.activeDatasource.id).subscribe(data => {

      //falls die zurückkommende Nachricht leer ist, wird eine Snackbar geöffnet
      if (data = null) {
        this.snackBar.open("Could not delete the datasource. Please try again.", "dismiss")
        return false;
      }

      //sonst wird eine neue Snackbar erstellt und auf die Startseite weitergeleitet
      this.snackBar.open("Could not delete the datasource. Please try again.", "dismiss")
      this.router.navigate(['allCharts']);

      return true;
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

    //Deletes a field 
    deleteField(i : number){

      const ob = this.datasourceForm.get("dataset") as FormArray; 
  
      ob.removeAt(i);
    }

    //Deletes a field 
    removeField(i : number){
      this.values.splice(i,1);
    }
  


}
