import { IconographyService } from './../../services/iconography.service';
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
  public icon:string="";
  public icons:any = [];
  public selected:string = '';

  constructor(
    private modalController:ModalController,
    private iconService:IconographyService,
  ) { }

  ngOnInit() {
    this.iconService.getNames().then((icons:any) => {
      this.icons = icons;
      console.log(icons);
    });
  }

  selectedIcon(icon) {
    this.selected = icon;
  }

  ionViewWillEnter(){
    
  }

  public changeTitle(e){
    console.log('Title',e.detail.value);
    this.title=e.detail.value;
  }

  public changeDescription(e){
    console.log('Description',e.detail.value);
    this.description=e.detail.value;
  }

  public changeIcon(e) {
    console.log('Description',e.detail.value);
    this.icon = e.detail.value;
  }

  public addNew(){
    if(!this.description) return;
    if(!this.title) return;
    let item:any={
      t:this.title,
      d:this.description,
      i:this.selected,
      c:false,
      cr: new Date().getTime(),
      co: false,
    };
    console.log(item);
    // this.dismiss(item);
    this.modalController.dismiss(item);
  }

  public dismiss() {
    this.modalController.dismiss(false);
  }

}
