import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss']
})
export class BottomNavigationComponent implements OnInit {

  constructor(private router : Router) { }

  //noAdmin: boolean = true;

  ngOnInit() {

  }

  /**
   * Navigates to settings
   */
  navigateToSettings(){
    this.router.navigate(['settings']);
  }

  /**
   * Navigates to manage DataSource
   */
  navigateToManageDS(){
    this.router.navigate(['manageDatasources']);
  }

  /**
   * Navigates to AddDatasource
   */
  navigateToaddDS(){
    this.router.navigate(['addDatasource']);
  }

  /**
   * Navigates to Addchart
   */
  navigateToaddChart(){
    this.router.navigate(['addDiagram']);
  }

  /**
   * Navigates to diagram settings
   */
  navigateToDiagramSettings(){
    this.router.navigate(['diagramSettings']);
  }

}
