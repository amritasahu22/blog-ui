import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Comment} from '../model/comment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private commentsUrl: string;
  private httpHeader: HttpHeaders;
  //private postId:number;

  constructor(private http:HttpClient) {
    this.commentsUrl="https://jsonplaceholder.typicode.com/comments?postId=";
   }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

  //Method returns an Observable intance that holds an array of Comment objects
  public findCommentsForPost(postId:number): Observable<Comment[]> {
      var data = this.http.get<Comment[]>(this.commentsUrl+postId, this.httpOptions).pipe(
        retry(1),
        catchError(this.handleError));
        console.log("Backend response for comments:" + data);
    return data;

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
