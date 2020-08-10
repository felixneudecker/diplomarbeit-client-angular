import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DiagramService } from 'src/app/services/diagram.service';
import { DatasourceService } from 'src/app/services/datasource.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Diagram } from 'src/app/model/diagram';
import { Datasource } from 'src/app/model/datasource';
import { HttpService } from 'src/app/services/http.service';
import { MatSnackBar } from '@angular/material';
import { ViewService } from 'src/app/services/view.service';

@Component({
  selector: 'app-diagram-settings',
  templateUrl: './diagram-settings.component.html',
  styleUrls: ['./diagram-settings.component.scss']
})
export class DiagramSettingsComponent implements OnInit {

  diagramForm: FormGroup;

  charts: string[] = ["pie-chart", "bar-chart", "linechart", "donut-chart"]

  activeDiagram: Diagram;

  numb : number;

  diagramToUpdate: Diagram = new Diagram();

  pressed: boolean = false;

  values;

  /**
   * Erzeugt eine Instanz des Navigations-Components. 
   * 
   * @param diagramService - für alle Diagrammzugriffen und zum Zugriff auf ein Array mit Diagrammen
   * @param router - zum Wechseln zwischen Komponenten
   * @param fb - zum Bauen von Formularen
   * @param httpService - zum Aufrufen von Rest-Methoden auf dem Server
   * @param snackBar - zum Anzeigen von Notifications (wie 'Inserted Data')
   * @param datasourceService - für alle Datasourcezugriffe und zum Zugriff auf ein Array mit Datasources
   */
  constructor(private router: Router, public diagramService: DiagramService, public datasourceService: DatasourceService, private fb: FormBuilder, private httpService: HttpService, private snackBar: MatSnackBar, public viewService : ViewService) { }


  ngOnInit() {
    //laden der Datensources und user-Diagrammen mithilfe der userId
    //this.datasourceService.getAllDataSourcesFromOne(Number(localStorage.getItem("userid")));
    this.diagramService.getUserDiagrams(Number(localStorage.getItem("userid")));
    this.createForm();
  }


  createForm() {
    //das Formular hat die Felder title, type, labels und datasource
    this.diagramForm = this.fb.group({
      title: ['', Validators.required],
      type: new FormControl(this.charts[3], Validators.required),
      labels: this.fb.array([
        this.fb.control('')
      ]),
      datasource: new FormControl(Datasource, Validators.required)
    })

  }

  //gibt die Label zurück
  get labels() {
    return this.diagramForm.get('labels') as FormArray;
  }

  //fügt einen neues Label ein
  addLabel() {
    this.labels.push(this.fb.control(''));
  }

  //zum Auswählen des Diagrammes, das zu Ändern ist
  activeButton(i: number) {

    this.numb = i;
    this.pressed = true;

    //das aktive Diagramm wird vom Array an der Stelle des gepresseten Buttons(i) gesetzt
    this.activeDiagram = this.diagramService.userDiagrams[i];

    //bisherige Werte werden auf den Array values gesetzt
    this.values = this.activeDiagram.labels;

    //alle Felder werden zurückgesetzt
    this.diagramForm.get("title").reset;
    this.diagramForm.get("type").reset;
    this.diagramForm.get("datasource").reset;

    //der Title, der Typ und die Datasource werden beim Klick auf den Button automatisch gesetzt
    this.diagramForm.get("title").setValue(this.activeDiagram.title);
    this.diagramForm.get("type").setValue(this.activeDiagram.type);
    this.diagramForm.get("datasource").setValue(this.activeDiagram.datasource_id);
  }

  updateValues(event: any, i: number) {
    //values[i] bekommt den eingegebenen/geänderten Wert
    this.values[i] = event.target.value;
  }

  sendToServer(): boolean {
    //setzen der Werte für das "upgedatete" Diagramm
    this.diagramToUpdate.id = this.activeDiagram.id;
    this.diagramToUpdate.title = this.diagramForm.get("title").value;
    this.diagramToUpdate.type = this.diagramForm.get("type").value;

    //falls keine Datensource eingetragen wurde, wird die alte Datensource eingetragen
    if (this.diagramForm.get("datasource").value == null || this.diagramForm.get("datasource").value == '' || this.diagramForm.get("datasource").value == "") {
      this.diagramToUpdate.datasource_id = this.activeDiagram.datasource_id;
    } else {
      this.diagramToUpdate.datasource_id = this.diagramForm.get("datasource").value;
    }

    this.diagramToUpdate.userid = this.activeDiagram.userid;

    //falls keine Label eingetragen wurde, werden die "alten" Label verwendet
    if (this.diagramForm.get("labels").value == null || this.diagramForm.get("labels").value == '') {
      this.diagramToUpdate.labels = this.values;
    } else {
      //sonst werden diese durchgegangen und zu dem values (den bisherigen Werten) mit push hinzugefügt
      for (var i = 0; i < this.diagramForm.get("labels").value.length; i++) {
        this.values.push(this.diagramForm.get("labels").value[i]);
      }
      this.diagramToUpdate.labels = this.values;

    }

    //im httpService wird die Methode updateDiagram mit der Diagram-Id der zu updateten Datasource und der Datasource, die die Werte hat, aufgerufen. 
    this.httpService.updateDiagram(this.diagramToUpdate.id, this.diagramToUpdate).subscribe(data => {
      //falls der Rückgabewert null ist, dann werden in einer Snackbar Fehlerangezeigt und mit einem false wird aus der Methode herausgegangen
      if (data === null || data == "" || data == '') {
        this.openSnackBar("Some errors apperead. Please try again. ", "dismiss");
        return false;

      }

      //dann wird eine Snackbar angeziegt, dass alles funktioniert hat und es wird zur Startseite geleitet
      this.openSnackBar("Diagram '" + this.diagramToUpdate.title + "' updated. ", "dismiss");
      //this.viewService.getAllViews(Number(localStorage.getItem('userid')));
      //this.diagramService.getUserDiagrams(Number(localStorage.getItem('userid')));
      this.refreshDiagrams();
      this.navigateToAllCharts();
      return true;
    });
    return false;
  }

  /**
  * Die Methode navigateToAllCharts() navigiert zur Seite Login (zum schnellen Wechseln zwischen Login und Register). 
  */
  navigateToAllCharts() {
    this.router.navigate(['allCharts']);
  }

  deleteDiagram() {
    //im httpService wird die Methode deleteDiagram mit der Diagram-Id aufgerufen. 
    this.httpService.deleteDiagram(this.activeDiagram.id).subscribe(data => {
      //ist der Rückgabewert leer wird eine Snackbar mit Errors geöffnet
      if (data === null || data == "" || data == '') {
        this.openSnackBar("Some errors apperead. Please update your Settings again. ", "dismiss");
        return false;
      }

      //dann wird eine Snackbar angeziegt, dass das Löschen funktioniert hat und es wird zur Startseite geleitet
      this.openSnackBar("Diagram deleted. ", "dismiss");

      this.refreshDiagrams();
      this.navigateToAllCharts();

      return true;
    })
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
  deleteField(i: number) {

    const ob = this.diagramForm.get("labels") as FormArray;

    ob.removeAt(i);
  }

  //Deletes a field 
  removeField(i: number) {
    this.values.splice(i, 1)
  }

  refreshDiagrams(){
    let userid = Number(localStorage.getItem("userid"))
    this.diagramService.getDiagramArray()
    this.viewService.updateAllViews(userid)
  }



}
