import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(
    private api:ApiService,
    private user:UserService,
    private router:Router,
  ) { }

  public pass:string = "";
  public username:string = "";
  public error:string = "";

  ngOnInit() {
  }

  signup(){
    let data = { user: this.username , pass: this.pass };
    this.api.apicall('signup',data).then((response:any)=>{
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

  gotoLogin() {
    this.router.navigateByUrl('/login');
  }

}
