import { IconographyService } from './../../services/iconography.service';
import { TodolistServiceService } from './../../todolist-service.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonToggle, NavController } from '@ionic/angular';
import { NewserviceService,todoItem } from 'src/app/newservice.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit, AfterViewInit {

  @ViewChild('completed') completed:IonToggle;

  public item:todoItem;
  public index:any;
  public icons:string[] = [];
  public selected:string = '';

  constructor(
    private alertController:AlertController,
    private activatedRoute:ActivatedRoute,
    private newService:NewserviceService,
    private todoStorage:TodolistServiceService,
    private nav:NavController,
    private iconService:IconographyService,
    ) {     
    }

  ngOnInit() {
    this.index=this.activatedRoute.snapshot.paramMap.get('index');
    this.item=this.newService.getDetail(this.index);
    this.todoStorage.setCurrent(this.item);
    this.iconService.getNames().then((names:any)=>{
      if(names) {this.icons = names}
    });
  }

  ngAfterViewInit() {
    this.completed.ionChange.subscribe((v:any)=>{
      console.log(v)
      this.item.c = v.detail.checked;
      if(v.detail.checked) {
        this.item.co = new Date().getTime();
      } else {
        this.item.co = false;
      }

    })
  }

  public async updateItem(){

    console.log(this.item);
    this.newService.updateItem(this.item,this.index);
    this.nav.back();
  }

  async removeAlert(index) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          id: 'confirm-button',
          handler: () => {
            this.removeItem();
          }
        }
      ]
    });
    await alert.present();
  }

  public removeItem(){
    this.newService.removeItem(this.index);
    this.nav.back();
  }

  public updateItemDetail() {
    this.todoStorage.setCurrent(this.item);
  }

  public selectedIcon(icon) {
    this.selected = icon;
    this.item.i = icon;
  }
}

