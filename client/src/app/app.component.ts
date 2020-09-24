import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit{
  title = 'SPOTIFY';
  public user: User;
  public identity;
  public token;

  constructor(
    private _userService: UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
  }

  ngOnInit(){
    this._userService.singup();
    console.log();
  }

  public onSubmit(){
    console.log(this.user);
  }
}
