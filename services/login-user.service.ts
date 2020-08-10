import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginUserService {
  

  loggedInUser;
  constructor(private httpService : HttpService) { }

  updateLoggedIn(data: User) {
    this.loggedInUser = data;
  }

  getUser(userid : number){
    this.httpService.getUser(userid).subscribe( data => {
      if(data === null || data == ""){
        return false;
      }else{
      this.loggedInUser = data;
      }

     
    })
  }

}



