import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { todoItem } from 'src/app/newservice.service';

@Component({
  selector: 'app-new-task-module',
  templateUrl: './new-task-module.page.html',
  styleUrls: ['./new-task-module.page.scss'],
})

export class NewTaskModulePage implements OnInit {
  public description:string="";
  public title:string="";


  constructor(private modalController:ModalController) { }
  ngOnInit() {
    
  }

  public dismiss(item:any){
    this.modalController.dismiss(item);
  }

  public changeTitle(e){
    console.log('Title',e.detail.value);
    this.title=e.detail.value;
    
  }

  public changeDescription(e){
    console.log('Description',e.detail.value);
    this.description=e.detail.value;
  }

  public add(){
    if(!this.description) return;
    if(!this.title) return;
    let item:any={
      t:this.title,
      d:this.description,
      c:false
    };
    this.dismiss(item);
  }
  

}
