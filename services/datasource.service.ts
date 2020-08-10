import { Injectable } from '@angular/core';
import { Datasource } from '../model/datasource';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DatasourceService {

  sources: Datasource[] = [];
  sourcesFromOneUser : Datasource[] = [];

  constructor(private httpService: HttpService) { }

  getAllDataSources() : Datasource[] {    
    this.httpService.findAllDatasources().subscribe(data  => {

      if(data === null){
        console.log("datasources are empty")
        return false;
      }

      this.sources = Object.keys(data).map(key => data[key]);

      this.sources.reverse();

      return this.sources;

    });

    return this.sources;
  }

  getAllDataSourcesFromOne(userid: number): Datasource[] {


    if(localStorage.getItem('position') == "Admin" || localStorage.getItem('position') == "Administrator"){

      this.sourcesFromOneUser = this.getAllDataSources();

      return this.sourcesFromOneUser;

    }else{
     
      this.httpService.findAllDatasourcesFromOne(userid).subscribe(data => {

        if(data === null){
          return false;
        }

        this.sourcesFromOneUser = Object.keys(data).map(key => data[key]);
  
        this.sourcesFromOneUser.reverse();
       // alert(this.sourcesFromOneUser);
        return this.sourcesFromOneUser;
  
      });
    }
    

    return this.sourcesFromOneUser;

  }

}
