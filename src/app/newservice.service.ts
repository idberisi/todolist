import { UserService } from './services/user.service';
import { ApiService } from './services/api.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TodolistServiceService } from './todolist-service.service';

export interface todoItem {
  t: string;
  c: boolean;
  d: string;
  i: string;
  cr: number;
  co: any;
  p:string;
  due:any;
}

@Injectable({
  providedIn: 'root'
})
export class NewserviceService {

  public text: string = '';
  public items: todoItem[] = [];

  constructor(
    private todoListStorage: TodolistServiceService,
    private api: ApiService,
    private user: UserService,
  ) { }

  public todoObservable = new BehaviorSubject<todoItem[]>([]);

  ngOnInit() {
    this.todoListStorage.get().then((data: any) => {
      if (data) {
        this.items = data;
      }
    })
  }

  checkAPI(token) {    
    return new Promise((resolve,reject)=>{
      this.api.apicall('auth/getList', {}, token).then((listData:any)=>{
        resolve(listData);
      }).catch(()=>{
        reject([]);
      });
    
    });
    
    //this.items = listData;
    //await this.save();  

  }

  public async getItems() {
    const token:string = await this.user.getToken();
    const json:any = await this.checkAPI(token);

    if(json) {
      let items:any = JSON.parse(json);
      console.log("TYPE",typeof(items));
      if(typeof(items) === "object") {
        this.items = items;
      } else {
        this.items = [];
      }
      this.todoObservable.next(this.items);
      await this.save();
    } else {
      let items:any = await this.todoListStorage.get();
      this.items = items;
      this.todoObservable.next(items);
    }
    
  }

  public getDetail(index) {
    return this.items[index];
  }

  public addItem(item: todoItem) {
    this.items.push(item);
    this.text = '';
    this.save();
  }

  public updateItem(item: todoItem, index) {
    this.items.splice(index, 1, item);
    this.save();
  }

  public removeItem(index) {
    this.items.splice(index, 1);
    this.save();
  }

  public markAsComplete(index, state) {
    this.items[index].c = state;
    this.save();
  }

  public async save() {

    const token: string = await this.user.getToken();
    const data: any = {
      json_list: JSON.stringify(this.items)
    };

    await this.todoListStorage.set(this.items);
    await this.api.apicall('auth/setList', data, token);
    this.todoObservable.next(this.items);
  }
}
