import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { Datasource } from '../model/datasource';
import { Diagram } from '../model/diagram';
import { View } from '../model/view';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private url = "localhost:8080/services";

  constructor(private http: HttpClient) {
  }

  register(user: User) {
    return this.http.post('http://localhost:8080/services/insertUser', user, {responseType: 'text'});
  }

  login(user : User) {
    return this.http.post<User>('http://localhost:8080/services/loginUser', user);
  }

  updateUser(toUpdate: User, userid: number) {
    return this.http.put<User>('http://localhost:8080/services/updateUser/' + userid, toUpdate);
  }

  getUser(userid: number) {
    return this.http.get('http://localhost:8080/services/getUser/' + userid);
  }

  //Datensource

  insertDataSource(dataSource : Datasource) {
    return this.http.post('http://localhost:8080/services/insertDatasource/' + dataSource.userid, dataSource, {responseType: 'text'});
  }

  findAllDatasources() {
    return this.http.get('http://localhost:8080/services/findAllDatasources');
  }

  updateDatasource(updateDatasource: Datasource, id: number) {
    return this.http.put('http://localhost:8080/services/updateDatasource/' + id, updateDatasource, {responseType: 'text'});
  }

  findAllDatasourcesFromOne(userid: number) {
    return this.http.get('http://localhost:8080/services/findAllDatasourcesByUserid/' + userid);
  }

  deleteDatasource(id: number) {
    return this.http.delete('http://localhost:8080/services/deleteDatasource/' + id, {responseType: 'text'});
  }

  //Diagram

  insertDiagram(diagram : Diagram, userid: number) {
    return this.http.post('http://localhost:8080/services/insertDiagram/' + userid, diagram, {responseType: 'text'});
  }

  getAllDiagrams(userid : number) {
    return this.http.get('http://localhost:8080/services/getAllDiagrams/' + userid);
  }

  findAllDiagrams() {
    return this.http.get('http://localhost:8080/services/findAllDiagrams/');
  }

  updateDiagram(id: number, diagramToUpdate: Diagram) {
    return this.http.put('http://localhost:8080/services/updateDiagram/' + id, diagramToUpdate, {responseType: 'text'});
  }

  deleteDiagram(id: number) {
    return this.http.delete('http://localhost:8080/services/deleteDiagram/' + id, {responseType: 'text'});
  }


  //Views
  findAllViews(userid : number) {
    return this.http.get('http://localhost:8080/services/getAllViews/' + userid);
  }

  insertView(userid : number, view : View) {
    return this.http.post('http://localhost:8080/services/insertView/' + userid, view, {responseType: 'text'});
  }

  updateView(viewToUpdate: View, viewid: number) {
    return this.http.put('http://localhost:8080/services/updateView/' + viewid, viewToUpdate, {responseType: 'text'});
  }

  deleteView(viewid: number) {
    return this.http.delete('http://localhost:8080/services/deleteView/' + viewid, {responseType: 'text'});
  }

}
