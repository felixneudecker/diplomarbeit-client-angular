import { Component, OnInit } from '@angular/core';
import { LoginUserService } from 'src/app/services/login-user.service';
import { ViewService } from 'src/app/services/view.service';
import { DiagramService } from 'src/app/services/diagram.service';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { View } from 'src/app/model/view';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

/**
 * @author Felix Neudecker
 */
@Component({
  selector: 'app-view-settings',
  templateUrl: './view-settings.component.html',
  styleUrls: ['./view-settings.component.scss']
})
export class ViewSettingsComponent implements OnInit {

  updateViewForm: FormGroup

  viewToUpdate: View = new View()

  sourcesFormOneUser : View[]

  name: string

  diagramChecked : Boolean[]


  /**
   * Erzeugt eine Instanz des ViewSettings-Components. 
   * @param viewService - für alle Viewzugriffe und zum Zugriff auf ein Array mit den Views für einen Benutzer
   * @param diagramService - für alle Diagrammzugriffen und zum Zugriff auf ein Array mit Diagrammen
   * @param httpService - zum Aufrufen von Rest-Methoden auf dem Server
   * @param fb - zum Bauen von Formularen (Reactive Forms)
   * @param router - zum Wechseln zwischen Komponenten
   * @param snackBar - zum Anzeigen von Notifications (wie 'Inserted Data')
   */
  constructor(public viewService: ViewService, public diagramService: DiagramService, private httpService: HttpService, private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) { }



  ngOnInit() {
    //Laden der Diagramme aus der DB mit der User-Id
    if(!this.diagramService.diagramArray){
    this.diagramService.getAllDiagrams(Number(localStorage.getItem('userid')));
  }
    //Erzeugen des Formulars
    this.createForm();
  }

  createForm() {
    // In der FormGroup gibt es die Felder name und Diagrams
    this.updateViewForm = this.fb.group({
      name: [''],
      diagrams: this.fb.array([])
    });

    this.initialCheck()
  }

 /* initialCheck(diagramId : Number){
    console.log("he du i bin doo")
      const vTc = this.viewService.viewToChange;
    
      for(var i = 0; i < vTc.diagramid.length; i++){

        if(vTc.diagramid[i] === diagramId){

          return true
        }else{
          return false
        }
      }
    
  }*/

  initialCheck(){
    const chkArray = <FormArray>this.updateViewForm.get('diagrams');

    const allDiagrams : number[] = []
    this.diagramService.diagramArray.forEach(e => {
      allDiagrams.push(e.id)
    })

    console.log("Diagrame")

    allDiagrams.sort((a,b) => a-b)
    console.log(allDiagrams)

    console.log(this.viewToUpdate)
   // var checkedDiagrams = this.viewToUpdate.diagramid.sort((a,b) => a-b)

   // console.log(checkedDiagrams)

    /*for(var i = 0; i < allDiagrams.length; i++){
      for(var j = 0; j < checkedDiagrams.length; j++){

        if(allDiagrams[j]==checkedDiagrams[i]){
          console.log("Herr schüller")
        }

      }
    }*/

    //chkArray.push(new FormControl({ id: chk.id }));

  }

  /**
   * Die Methode navigateToAllCharts() navigiert wieder zur Startseite durch einen Router zurück. 
   */
  navigateToAllCharts() {
    this.router.navigate(['allCharts']);
  }


  updateChkbxArray(chk, isChecked, i) {

    //checkArray hat die Werte die bereits angehakt sind. 
    const chkArray = <FormArray>this.updateViewForm.get('diagrams');

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
  

  deleteView() {
    //nur zum Namen anzeigen in der Snackbar
    this.name = this.viewService.viewToChange.name;

    //im httpService wird die Methode deleteView mit der View-Id der zu löschenden View aufgerufen. 
    this.httpService.deleteView(this.viewService.viewToChange.id).subscribe(data => {

      //falls die zurückkommende Nachricht leer ist
      if (data === '' || data == null) {
        //wird ein Error in der Snackbar angezeigt
        this.openSnackBar("Some errors apperead. Please update your Settings again.", "dismiss");
        //durch das false wird die Methode verlassen
        return false;
      }

      //sonst werden alle Views neu geladen
      this.viewService.updateAllViews(this.viewService.viewToChange.userid);
      //eine Snackbar wird geöffnet mit der Nachricht, dass die View erfolgreich gelöscht wurde
      this.openSnackBar("Deleted View '" + this.name + "' sucessfully.", "dismiss");
      //es wird über einen Router zur Startseite navigiert
      this.router.navigate(["allCharts"]);

      return true;
    })

    return true;
  }

  updateView(): boolean {
    
    //falls kein Name eingegben wird, wird der bisherige Name genommen. 
    if (this.updateViewForm.get("name").value === null || this.updateViewForm.get("name").value == '') {
      this.viewToUpdate.name = this.viewService.viewToChange.name;
    } else {
      this.viewToUpdate.name = this.updateViewForm.get("name").value;
    }

    //falls keine Diagramme ausgewählt werden, werden die bisherigen Diagramme genommen. 
    if (this.updateViewForm.get("diagrams").value.length === 0) {
      this.viewToUpdate.diagramid = this.viewService.viewToChange.diagramid;
    } else {

      //temporärer Array von Nummern mit der Länge des Eingabe-Arrays
      const diagramIds: number[] = new Array((<FormArray>this.updateViewForm.get('diagrams')).length);

      //der Eingabe-Array wird durchgegangen und jedes Element wird auf den temporären Array gesetzt
      for (var i = 0; i < (<FormArray>this.updateViewForm.get('diagrams')).length; i++) {
        console.log(this.updateViewForm.get("diagrams").value[i].id);
        diagramIds[i] = this.updateViewForm.get("diagrams").value[i].id;
      }

      //die Felder werden auf eine neue View gesetzt (die mit den neuen Werten), welche in die DB gespeichert wird
      this.viewToUpdate.id = this.viewService.viewToChange.userid;
      this.viewToUpdate.diagramid = diagramIds;
      this.viewToUpdate.userid = this.viewService.viewToChange.userid;
    }

    //im httpService wird die Methode update mit der View-Id des zu updateten Views und der View aufgerufen. 
    this.httpService.updateView(this.viewToUpdate, this.viewService.viewToChange.id).subscribe(data => {

      //falls die zurückkommende Nachricht leer ist, wird eine Snackbar geöffnet
      if (data === '' || data == null) {
        this.openSnackBar("Some errors apperead. Please update your Settings again.", "dismiss");
        return false;
      }

      //sonst werden alle Views neu geladen und eine Snackbar geöffnet, die dem User sagt, dass alles funktioniert hat
      this.viewService.updateAllViews(this.viewToUpdate.userid);
      this.openSnackBar("Updated '" + this.viewToUpdate.name + "' sucessfully.", "dismiss");

      //es wird über einen Router zur Startseite navigiert
      this.router.navigate(["allCharts"]);
      return true;
    })

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

}
