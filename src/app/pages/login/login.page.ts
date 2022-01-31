import { Router } from '@angular/router';
import { NewserviceService } from 'src/app/services/newservice.service';
import { UserService } from './../../services/user.service';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private api:ApiService,
    private user:UserService,
    private newservice:NewserviceService,
    private router:Router,
  ) { }

  public pass:string = "test1234";
  public username:string = "deano";
  public error:string = "";

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.user.getToken().then((token:any)=>{
      if(token) {
        this.router.navigateByUrl('/home',{replaceUrl:true});
      }
    })
  }

  login(){
    let data = { user: this.username , pass: this.pass };
    this.api.apicall('login',data).then((response:any)=>{
      if(response.token) {
        let token:string = response.token;
        this.user.setToken(response.token).then(()=>{
          this.router.navigateByUrl('/home',{replaceUrl:true});
        })
      } else {
        this.error = response.error;
      }
    })
  }

  gotoSignup() {
    this.router.navigateByUrl('/signup');
  }

}
