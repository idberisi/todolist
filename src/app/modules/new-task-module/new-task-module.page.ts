import { IconographyService } from './../../services/iconography.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonSelect, IonText, ModalController } from '@ionic/angular';
import { todoItem } from 'src/app/newservice.service';

@Component({
  selector: 'app-new-task-module',
  templateUrl: './new-task-module.page.html',
  styleUrls: ['./new-task-module.page.scss'],
})

export class NewTaskModulePage implements OnInit {

  @ViewChild('select') select:IonSelect;

  public description:string="";
  public title:string="";
  public icon:string="";
  public priority:string="";
  public icons:any = [];
  public selected:string = '';
  public due:any = false;
  public levelname:string = '';

  public iconsLoaded:boolean = false;

  constructor(
    private modalController:ModalController,
    private iconService:IconographyService,
  ) { }

  ngOnInit() {

  }

  setLevel() {
    switch (this.priority) {
      case 'ellipse-outline':
        return 'low';
      break;
      case 'alert-circle-outline':
        return 'medium';
      break;
      case 'flame-outline':
        return 'high';
      break;
    }
  }

  selectedIcon(icon) {
    this.selected = icon;
  }

  ionViewDidEnter(){
    this.iconService.getNames().then((icons:any) => {
      this.icons = icons;
      console.log(icons);
      this.iconsLoaded = true;
    });
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

  public changePriority(e) {
    console.log('Priority',e.detail.value);
    this.priority = e.detail.value;
    this.levelname = this.setLevel();

  } 

  public changeDue(e) {
    console.log('Due',e.detail.value);
    let D = Date.parse(e.detail.value);
    this.due = D / 1000;
    console.log(this.due);
  }

  public addNew(){
    if(!this.description) return;
    if(!this.title) return;
    let item:any={
      t:this.title,
      d:this.description,
      i:this.selected,
      p:this.priority,
      c:false,
      cr: new Date().getTime(),
      co: false,
      due: this.due,
    };
    console.log(item);
    // this.dismiss(item);
    this.modalController.dismiss(item);
  }

  changeP() {
    this.select.open();
  }

  public dismiss() {
    this.modalController.dismiss(false);
  }

}
