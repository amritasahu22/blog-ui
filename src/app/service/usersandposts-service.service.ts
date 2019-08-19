import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../model/user';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UsersandpostsService {

  private usersAndPostsUrl: string;
  users: any;
    
  constructor(private http: HttpClient) {
     this.usersAndPostsUrl = 'http://localhost:8080/api/usersandposts';
   }

   
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

   //Method returns an Observable intance that holds an array of User objects
   public findAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersAndPostsUrl, this.httpOptions).pipe( retry(1),
     catchError(this.handleError));
   }
  
  // Error handling 
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log("Error:" + errorMessage);
    return throwError(errorMessage);
 }

}
