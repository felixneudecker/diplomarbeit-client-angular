import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DiagramService } from 'src/app/services/diagram.service';
import { HttpService } from 'src/app/services/http.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Diagram } from 'src/app/model/diagram';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { LoginUserService } from 'src/app/services/login-user.service';
import { TouchSequence } from 'selenium-webdriver';
import { View } from 'src/app/model/view';
import { MatSnackBar } from '@angular/material';
import { ViewService } from 'src/app/services/view.service';


@Component({
  selector: 'app-add-view',
  templateUrl: './add-view.component.html',
  styleUrls: ['./add-view.component.scss']
})
export class AddViewComponent implements OnInit {

  userid: number = Number(localStorage.getItem('userid'));

  diaArray: Diagram[];
  diagramArray: Diagram[];
  selected = [];

  toInsert: View = new View();

  viewForm: FormGroup;

  /**
   * Erzeugt eine Instanz des ViewSettings-Components. 
   * @param user - für alle Userzugriffe und zum Zugriff auf den aktuell eingeloggten Benutzer
   * @param diagramService - für alle Diagrammzugriffen und zum Zugriff auf ein Array mit Diagrammen
   * @param httpService - zum Aufrufen von Rest-Methoden auf dem Server
   * @param fb - zum Bauen von Formularen (Reactive Forms)
   * @param router - zum Wechseln zwischen Komponenten
   * @param snackBar - zum Anzeigen von Notifications (wie 'Inserted Data')
   */
  constructor(private router: Router, public diagramService: DiagramService, private httpService: HttpService, public viewService: ViewService, private fb: FormBuilder, public user: LoginUserService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    //es werden alle Diagramme, die zum User gehören geladen
    this.diagramService.getAllDiagrams(this.userid);
    //this.diaArray = this.diagramService.diagramArray;
    // console.log(this.diagramService.diagramArray)

    //ruft die Methode zum Erstellen des ReactiveForms auf
    this.createForm();
  }

  createForm() {
    // In der FormGroup gibt es die Felder name und Diagrams
    this.viewForm = this.fb.group({
      name: ['', Validators.required],
      diagrams: this.fb.array([])
    });
  }

  updateChkbxArray(chk, isChecked, i) {
    console.log("Update " + this.viewForm.get("name").value)

    //checkArray hat die Werte die bereits angehakt sind. 
    const chkArray = <FormArray>this.viewForm.get('diagrams');

    //falls isChecked == true ist
    if (isChecked) {

      //falls der Index noch nicht im Array ist wird ein neues FormControl angelegt mit der ID des ausgewählten Diagrammes
      if (chkArray.controls.findIndex(x => x.value == chk.id) == -1)
        chkArray.push(new FormControl({ id: chk.id }));

    } else {
      //sonst wird das Feld wieder entfernt aus dem Array
      let idx = chkArray.controls.findIndex(x => x.value == chk.id);
      chkArray.removeAt(idx);

    }
  }

  /**
   * Gibt den Array von Diagramen zurück
   */
  get diagrams() {
    return <FormArray>this.viewForm.get('diagrams');
  }

  /**
   * Die Methode navigateToAllCharts() navigiert wieder zur Startseite durch einen Router zurück. 
   */
  navigateToAllCharts() {
    this.router.navigate(['allCharts']);
  }


  printDatasets(): boolean {

    //Array mit allen DiagramId, die diese View haben soll
    const diagramIds: number[] = new Array((<FormArray>this.viewForm.get('diagrams')).length);

    //Falls keine Diagrame ausgewählt werden
    if (this.viewForm.get('diagrams').value.length === 0) {

      //aufrufen einer Snackbar, die anzeigt, dass Diagramme ausgewählt werden sollen
      this.openSnackBar("Please choose a diagram ", "dismiss");

      //zum Verlassen der Methode
      return false;
    }

    //durchgehen des Diagram-Arrays und peichern auf den Array mit den DiagramIds
    for (var i = 0; i < (<FormArray>this.viewForm.get('diagrams')).length; i++) {
      diagramIds[i] = this.viewForm.get("diagrams").value[i].id;
    }

    //setzen des Namens und des DiagramId-Arrays
    this.toInsert.name = String(this.viewForm.get("name").value);
    this.toInsert.diagramid = diagramIds;

    //im httpService wird die Methode insertVuew mit der View-Id des zu updateten Views und der View, die eingefügt werden soll aufgerufen. 
    this.httpService.insertView(Number(localStorage.getItem("userid")), this.toInsert).subscribe(data => {

      //falls die zurückkommende Nachricht leer ist, wird eine Snackbar geöffnet
      if (data === '' || data == null) {
        return false;
      }

      //sonst wird eine neue Snackbar erstellt und die Diagramme neu geladen
      this.openSnackBar("View " + this.toInsert.name + " inserted successfully.", "dismiss");
      this.viewService.updateAllViews(Number(localStorage.getItem("userid")));

      //es wird über einen Router zur Startseite navigiert
      this.router.navigate(["allCharts"]);
      return true;
    })

    return false;
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
