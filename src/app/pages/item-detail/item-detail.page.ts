import { IconographyService } from './../../services/iconography.service';
import { TodolistServiceService } from './../../todolist-service.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonToggle, NavController, ModalController, IonDatetime, IonSelect } from '@ionic/angular';
import { NewserviceService,todoItem } from 'src/app/newservice.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit, AfterViewInit {

  @ViewChild('completed') completed:IonToggle;
  @ViewChild('tabs') tabs:ElementRef;
  @ViewChild('dt') datetime: IonDatetime;
  @ViewChild('select') select:IonSelect;

  //public item:todoItem;
  //public index:any;
  public icons:string[] = [];
  public selected:string = '';
  public iconsLoaded:boolean = false;
  public levelname:string = '';

  public chkd:boolean = false;

  @Input() item: any;
  @Input() index: number;

  constructor(
    private alertController:AlertController,
    private activatedRoute:ActivatedRoute,
    private newService:NewserviceService,
    private todoStorage:TodolistServiceService,
    private nav:NavController,
    private iconService:IconographyService,
    private modalController:ModalController,

    ) {  
      
      

    }

  ngOnInit() {
/*     this.index=this.activatedRoute.snapshot.paramMap.get('index');
    this.item=this.newService.getDetail(this.index); */
   
    this.iconService.getNames().then((names:any)=>{
      if(names) {this.icons = names}
    });

  }

  
  ngAfterViewInit() {
    this.completed.ionChange.subscribe((v:any)=>{
      this.chkd = v.detail.checked;
      if(v.detail.checked) {
        this.item.co = new Date().getTime();
      } else {
        this.item.co = false;
      }
    })

    let dateTime = new Date(this.item.due).toISOString().replace("Z","");
    let dateTimeEpoch = Date.parse(dateTime);
    this.datetime.value = dateTime;
    
  }

  ionViewWillEnter(){
    this.iconService.getNames().then((icons:any) => {
      this.icons = icons;
      this.iconsLoaded = true;
    });

    this.levelname = this.setLevel();
  }

  changeState(e) {
    this.item.c = e.detail.checked;
  }
  
  changePriority(e) {
    this.item.p = e.detail.value;
    this.levelname = this.setLevel();
  }

  public changeDue(e) {
    let D = Date.parse(e.detail.value);
    this.item.due = D;
  }

  public changeTitle(e){
    this.item.t=e.detail.value;
  }

  public changeDescription(e){
    this.item.d=e.detail.value;
  }

  changeP() {
    this.select.open();
  }

  setLevel() {
    switch (this.item.p) {
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

  public async updateItem(){
    this.newService.updateItem(this.item,this.index);
    this.modalController.dismiss([this.item,this.chkd]);
  }

  async removeAlert() {
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
            return true;
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
    this.modalController.dismiss(false);
  }

  public updateItemDetail() {
    this.todoStorage.setCurrent(this.item);
  }

  public selectedIcon(icon) {
    this.selected = icon;
    this.item.i = icon;
  }
}

