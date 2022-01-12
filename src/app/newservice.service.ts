import { UserService } from './services/user.service';
import { ApiService } from './services/api.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TodolistServiceService } from './todolist-service.service';

export interface todoItem {
  t: string;
  c: boolean;
  d: string;
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

  private async checkAPI() {
    this.user.getToken().then((token: string) => {
      this.api.apicall('auth/getList', {}, token).then((listData: any) => {
        this.items = listData;
        this.save();
      }).finally(() => {
        return true;
      })
    });
  }

  public async getItems() {
    this.checkAPI().then(()=>{
      let items:any = this.todoListStorage.get();
      this.items = items;
      this.todoObservable.next(items);
    }).finally(()=>{
      return this.items;
    })
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
    this.todoObservable.next(this.items);
    this.api.apicall('auth/setList', data, token).then((res: any) => {
      console.log("res", res);
    })
  }
}
