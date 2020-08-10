import { Injectable } from '@angular/core';
import { View } from '../model/view';
import { HttpService } from './http.service';
import { DiagramService } from './diagram.service';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  viewArray : View[];

  viewToChange : View;

  activeView : View;

  diagramId : number[];
  
  constructor(private httpService: HttpService) { }

  getAllViews(userid : number){
   // console.log("bin doooooo " + userid)
   if(this.activeView == null){

    this.httpService.findAllViews(userid).subscribe(data => {
      console.log(data);
      this.viewArray = Object.keys(data).map(key => data[key]);

      this.viewArray = this.viewArray.reverse();
      //alert(this.viewArray.length)
      this.activeView = this.viewArray[0];

    /*  for(var i = 0; i < this.viewArray.length; i++){
        if(this.viewArray[i].name == "Default View"){
          //this.activeView = this.viewArray[i];
          alert(this.viewArray[i].name)
        }
      }*/
      
      console.log("NACHM MAPN");
      console.log(this.viewArray);

    });
  
  }
    

  }

  updateAllViews(userid : number){
    this.httpService.findAllViews(userid).subscribe(data => {
      console.log(data);
      this.viewArray = Object.keys(data).map(key => data[key]);

      this.viewArray.reverse();
    
    });
  }



  getActiveView() : View {
    return this.activeView;
  }

  setActiveView(view : View) {
    this.activeView = view;
  }

  
}
