import { IconographyService } from './../../services/iconography.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonSelect, IonText, ModalController } from '@ionic/angular';
import { todoItem } from 'src/app/services/newservice.service';

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
  public remind:boolean = false;

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

  changeReminder(e){
    this.remind = e.detail.checked;
  }

  ionViewDidEnter(){
    this.iconService.getNames().then((icons:any) => {
      this.icons = icons;
      this.iconsLoaded = true;
    });
  }

  public changeTitle(e){
    this.title=e.detail.value;
  }

  public changeDescription(e){
    this.description=e.detail.value;
  }

  public changeIcon(e) {
    this.icon = e.detail.value;
  }

  public changePriority(e) {
    this.priority = e.detail.value;
    this.levelname = this.setLevel();

  } 

  public changeDue(e) {
    this.due = Date.parse(e.detail.value);
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
      remind: this.remind
    };
    this.modalController.dismiss(item);
  }

  changeP() {
    this.select.open();
  }

  public dismiss() {
    this.modalController.dismiss(false);
  }

}
