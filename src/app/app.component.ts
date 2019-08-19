import { Component, Output } from '@angular/core';
import { UsersandpostsService } from './service/usersandposts-service.service';
import { User } from './model/user';
import { Post } from './model/post';
import { Comment} from './model/comment';
import { timeout } from 'q';
import { s } from '@angular/core/src/render3';
import { CommentsService } from './service/comments-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  titleApp:string;
  title:string;
  users: User[];
  selectedUser: String;
  postsForUser:Post[];
  postsFlag: boolean;
  maxPostRows: number;
  imgLoader :boolean = true;
  comments: Comment[];
  selectedPost: number;
  commentsFlag: boolean;

  constructor(private usersandpostsService: UsersandpostsService, 
    private commentsService: CommentsService
    ) {}

  ngOnInit() {
    this.imgLoader = true;
    this.postsFlag = false;
    this.commentsFlag =false;
    this.postsForUser =[];
    this.comments =[];
    this.titleApp = "Welcome to Blog UI Application";
    this.title= "Please select a user to find their posts:"
    this.loadUsers();
    this.imgLoader =false;
  }

  errorMsgForUsers:string;
  errorMsgForComment:string;

   // Get user list
   loadUsers() {
    return this.usersandpostsService.findAllUsers()
    .subscribe(
      data =>{ this.users = data;
      console.log("Response::"+ this.users.length);
    },
    err => this.errorMsgForUsers = err
    )
  }

  headinglbl:string;
  collapselbl:string;

  //Onclick on user 
  onSelect(user: User):  void{
    this.selectedUser = user.name;
    this.postsForUser = user.posts;
    this.postsFlag = true;
    this.maxPostRows = 2;
  }

  //OnLoad button click
  onLoadAllClick(posts:Post[]): void{
    this.maxPostRows = posts.length;

  }

  //Onclick on post 
  onSelectPost(postId:number): void{
    this.selectedPost = postId;
    this.commentsFlag = true;
    this.commentsService.findCommentsForPost(postId)
    .subscribe(
      data => this.comments = data,
      err => this.errorMsgForComment = err
    );
  }

}


