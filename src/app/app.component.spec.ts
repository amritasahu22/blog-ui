import { async, TestBed, ComponentFixture, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import { AppComponent} from './app.component';
import { UsersandpostsService } from './service/usersandposts-service.service';
import { CommentsService } from './service/comments-service.service';
import { Observable } from 'rxjs';
import 'rxjs-compat/add/observable/from';
import 'rxjs-compat/add/observable/throw';
import 'rxjs-compat/add/observable/of';
import { User } from './model/user';
import { Post } from './model/post';
import { Comment } from './model/comment';
import { HttpClientModule } from '@angular/common/http';
import { componentFactoryName } from '@angular/compiler';


describe('AppComponent', () => {
  let appComponent: AppComponent; 
  let userservice: UsersandpostsService;
  let commentService: CommentsService;

  let appComponentTest: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ AppComponent ],
      providers: [UsersandpostsService, CommentsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    appComponentTest = fixture.componentInstance;
   
     userservice = new UsersandpostsService(null);
     commentService = new CommentsService(null);
     appComponent = new AppComponent(userservice, commentService);
  });

 
   //-------------Unit Test Cases-----------------------------------------
   it('should set users property with the data returned from server',() =>{
    let users = [{
      "userId": 1,
      "name": "Rick Martin",
      "posts": [
          {
              "postId": 1,
              "title": "Weather today",
              "body": "And it is cloudy!"
          }
       ]
    },
    { 
      "userId": 2,
       "name": "MJ Katty",
       "posts": [
           {
               "postId": 1,
               "title": "Weather today",
               "body": "Will it rain?"
           } 

         ]
    }
  ];
    //Arrange
    spyOn(userservice, 'findAllUsers').and.callFake(() => {
      return Observable.from([users]);
    });

    //Act 
     appComponent.loadUsers();

    //assert
    expect(appComponent.users).toBe(users);

  });

  it('should set comments property with the data returned from server',() =>{

    let comments = [
      {
        "postId": 1,
        "id": 1,
        "name": "What a weather!",
        "email": "Eliseo@gardner.biz",
        "body": "Its cloudy..."
      },
      {
        "postId": 1,
        "id": 2,
        "name": "Solar eclipse",
        "email": "Jayne_Kuhic@sydney.com",
        "body": "That is indeed nice click!"
      }
    ];
 
    //Arrange
    spyOn(commentService,"findCommentsForPost").and.callFake(() => {
      return Observable.from([comments]);
    });
     
    //Act
    appComponent.onSelectPost(1);

    //Assert
     expect(appComponent.comments).toBe(comments);
     expect(appComponent.selectedPost).toBe(1);
     expect(appComponent.commentsFlag).toBe(true);


  });

  it('should set the message property if the server returns an error while getting users & posts list',() => {
   
    let error ='error from the server';
    spyOn(userservice,"findAllUsers").and.returnValue(Observable.throw(error));

    appComponent.loadUsers();

    expect(appComponent.errorMsgForUsers).toBe(error);
  });

  it('should set the commentMessage property if the server returns an error while getting comments list',() => {

    let error ='error from the server';
    spyOn(commentService,"findCommentsForPost").and.returnValue(Observable.throw(error));

    appComponent.onSelectPost(1);

    expect(appComponent.errorMsgForComment).toBe(error);   
    
  });


   it('should set all properties when a user is selected', () => {
     let user: User = {userId: 1, name:"Ricky M", 
     posts:[ {
      "postId": 1,
      "title": "Weather today",
      "body": "And it is cloudy!"
  }]};

     appComponent.onSelect(user);
     expect(appComponent.postsFlag).toBe(true);
     expect(appComponent.maxPostRows).toBe(2);
     expect(appComponent.selectedUser).toBe(user.name);
     expect(appComponent.postsForUser.length).toBe(user.posts.length);

   });


   it('should set maxPostRows property when loadAll button is clicked', () => {
   let post:Post[] =[{
     "postId": 1,
     "title": "Weather today",
     "body": "And it is cloudy!"
    },
    {
      "postId": 2,
      "title": "Weather today",
      "body": "And it is cloudy!"
     }
   ];

    appComponent.onLoadAllClick(post);

    expect(appComponent.maxPostRows).toBe(post.length);
   });

   it('should set selectedPost and commentsFlag property with the data returned from server',() =>{
    let post:Post={
      "postId": 1,
      "title": "Weather today",
      "body": "And it is cloudy!"
     };
  
     spyOn(commentService,"findCommentsForPost").and.callFake(() => {
      return Observable.from([]);
    });

     appComponent.onSelectPost(post.postId);
    
     expect(appComponent.selectedPost).toBe(post.postId);
     expect(appComponent.commentsFlag).toBe(true);

  });







  // ----------Integration Test Cases---------------------------------

 it('should render title app', () => {
      appComponentTest.titleApp ="Welcome to Blog UI Application";
      fixture.autoDetectChanges();

      let de = fixture.debugElement.query(By.css('.titleApp'));
      let el: HTMLElement = de.nativeElement;
      expect(el.innerText).toContain("Welcome to Blog UI Application");
      //expect(component.titleApp).toContain("Welcome to Blog UI Application");
  });

  it('should render title', () => {
     appComponentTest.title ="Please select a user to find their posts:";
     fixture.detectChanges();

     let de = fixture.debugElement.query(By.css('.title'));
     let el: HTMLElement = de.nativeElement;
     expect(el.innerText).toContain("Please select a user to find their posts:");
 });


  it('should load userService from the server',() => {
    let users: User[] = [{
      "userId": 1,
      "name": "Rick Martin",
      "posts": [
          {
              "postId": 1,
              "title": "Weather today",
              "body": "And it is cloudy!"
          }
       ]
    }
  ];
    let service = TestBed.get(UsersandpostsService);
    spyOn(service, 'findAllUsers').and.returnValue(Observable.of(users));
    fixture.detectChanges();
    
    expect(appComponentTest.users.length).toBe(users.length);
  });

  it('should load CommentService from the server',() => {
    let comments: Comment[] = [
      {
        "postId": 1,
        "id": 1,
        "name": "What a weather!",
        "email": "Eliseo@gardner.biz",
        "body": "Its cloudy..."
      }
    ];

     let cservice = TestBed.get(CommentsService);    
    spyOn(cservice, 'findCommentsForPost').and.returnValue(Observable.of(comments));
    
    fixture.detectChanges();

    appComponentTest.onSelectPost(1);
    expect(appComponentTest.comments).toBe(comments);
  });

/*
  it(`should have as title 'blog-ui'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('blog-ui');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to blog-ui!');
  });*/

});
