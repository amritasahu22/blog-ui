import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { UsersandpostsService } from './service/usersandposts-service.service';
import { HttpClientModule } from '@angular/common/http';
import { CommentsService } from './service/comments-service.service';


@NgModule({
  declarations: [
    AppComponent,
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [UsersandpostsService,
              CommentsService],
  bootstrap: [AppComponent]
})

export class AppModule { }
