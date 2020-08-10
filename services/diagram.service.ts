import { Injectable } from '@angular/core';
import { Diagram } from '../model/diagram';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {


  diagramArray : Diagram[] = [];

  userDiagrams : Diagram[] = [];

  constructor(private httpService : HttpService) { }

  getAllDiagrams(userid : number):Diagram[]{
    this.httpService.getAllDiagrams(userid).subscribe(data => {

      if(data == null){
       // alert("oh noo")
        return false;
      }

        this.diagramArray = Object.keys(data).map(key => data[key]);

        this.diagramArray.reverse();
        console.log(this.diagramArray);
        return this.diagramArray;

    });


    return this.diagramArray;
  
  }

  getDiagramArray(){
    return this.diagramArray;
  }

  getUserDiagrams(userid : number):boolean{
    if(localStorage.getItem('position') == "Admin" || localStorage.getItem('position') == "Administrator"){


      this.httpService.findAllDiagrams().subscribe(data => {

        if(data == null){
          return false;
        }

        this.userDiagrams = Object.keys(data).map(key => data[key]);
  
        this.userDiagrams.reverse();
  
        return true;
      });

    }else{

      

      this.userDiagrams = this.getAllDiagrams(userid);

      return true;
    }

  }

}
