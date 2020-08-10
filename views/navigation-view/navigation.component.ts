import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ViewService } from 'src/app/services/view.service';
import { View } from 'src/app/model/view';
import { DiagramService } from 'src/app/services/diagram.service';
import { LoginUserService } from 'src/app/services/login-user.service';
import { DatasourceService } from 'src/app/services/datasource.service';

/**
 * @author Felix Neudecker
 */
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;

  activeViews : View[];
  activeView : View;

  /**
   * Erzeugt eine Instanz des Navigations-Components. 
   * 
   * @param router - zum Wechseln zwischen Komponenten
   * @param viewService - für alle Viewzugriffe und zum Zugriff auf ein Array mit den Views für einen Benutzer
   * @param diagramService - für alle Diagrammzugriffen und zum Zugriff auf ein Array mit Diagrammen
   * @param userService - für alle Benutzerzugriffe und zum Zugriff auf den eingeloggten Benutzer
   * @param datasourceService - für alle Datasourcenzugriffe
   * @param snackBar - zum Anzeigen von Notifications (wie 'Inserted Data')
   */
  constructor(private router : Router, public viewService : ViewService, public diagramService : DiagramService, public userService : LoginUserService, public datasourceService : DatasourceService, private snackBar: MatSnackBar) { }

  /**
   * Im ngOnInit() werden alle Views und Diagramme, die zu einem User gehören geladen. Die Views, die zum User gehören werden auf die activeViews gesetzt. 
   */
  ngOnInit() {
  //  alert(Number(localStorage.getItem('userid')))

    this.viewService.getAllViews(Number(localStorage.getItem('userid')));

    this.diagramService.getAllDiagrams(Number(localStorage.getItem('userid')));

    this.activeViews = this.viewService.viewArray;

    this.activeView = this.viewService.getActiveView();
  }

  title = 'Datenvisualisierung';

  /**
   * navigiert zu den Einstellungen durch den Router
   */
  navigateToSettings(){
    this.router.navigate(['settings']);
  }

  /**
   * navigiert zu der Startseite über den Router
   */
  navigateToAllCharts(){
    this.router.navigate(['allCharts']);
  }

  /**
   * navigiert zu dem Component "View einfügen"
   */
  navigateToAddView(){
    this.router.navigate(['addView']);
  }

  /**
   * Die Methode navigateToLogOut() sorgt dafür, dass der User sich abmelden kann. Dazu werden bei den ganzen Services die Arrays und Werte auf null gesetzt. Zudem werden
   * alle localStorage-items entfernt und man wird mit dem Router auf die Login-Seite navigiert. 
   */
  navigateToLogOut(){
    this.diagramService.diagramArray = null;
    this.diagramService.userDiagrams = null;

    this.viewService.activeView = null;
    this.viewService.diagramId = null;
    this.viewService.viewArray = null;
    this.viewService.viewToChange = null;

    this.userService.loggedInUser = null;

    this.datasourceService.sources = null;
    this.datasourceService.sourcesFromOneUser = null;

    //Entfernen der localStorage-Items
    localStorage.removeItem('position');
    localStorage.removeItem('userid');
    
    //Aufruf der Snackbar mit der Nachricht "You are now logged out." und der Action "dismiss" zum Wegdrücken der Nachricht
    this.openSnackBar("You are now logged out.", "dismiss");
    this.router.navigate(["login"]);
  }

  /**
   * Die Methode activeButton() setzt beim viewService das Feld viewToChange = viewArray[i]. Und navigiert danach zu den Component viewSettings. Diese viewToChange soll
   * in diesem Component upgedated werden können. 
   * 
   * @param i - die Stelle an der der Button gedrückt wurde
   */
  activeButton(i:number){
    //alert(this.viewService.viewArray[i].name)
   // alert("bin do cdrinnandfsd ");

    this.viewService.viewToChange = this.viewService.viewArray[i];
    this.router.navigate(['viewSettings']);
  }

  /**
   * Die Methode changingValue() wird bei einem Klick auf einen der View-Buttons aufgerufen. Dieser Methode wird ein Event mitgegeben. Durch event.target.value erhält 
   * man den Wert (die ID der geklickten View). In einer for-Schleife werden alle Views durchgegangen und falls eine ID übereinstimmt wird beim viewService die geklickte 
   * View gespeichert. 
   * 
   * @param event 
   */
  changingValue(event){

   //console.log(this.checkView.get("selectedView").value.name);

   // console.log(i)
    let clicked_id = event.target.value;

    for(let i = 0; i < this.viewService.viewArray.length; i++){
      console.log(this.viewService.viewArray[i].name)
      if(this.viewService.viewArray[i].id == clicked_id){
        //alert("Yes" + this.viewService.viewArray[i].name )
        this.viewService.setActiveView(this.viewService.viewArray[i]);
      }
    }


  }

  /**
   * Schließen des Hamburger-Menüs.
   * 
   * @param reason - Grund für das Schließen
   */
  close(reason: string) {
    this.sidenav.close();

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

  openMat(){
    this.sidenav.open()
  }
 
}