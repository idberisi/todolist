import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TodolistServiceService } from './todolist-service.service';

export interface todoItem {
  t:string;
  c:boolean;
  d:string;
}



@Injectable({
  providedIn: 'root'
})
export class NewserviceService {

  public text:string='';
  public items:todoItem[]=[];

  constructor(private todoListStorage:TodolistServiceService) { }

  public todoObservable=new BehaviorSubject<todoItem[]>([]); 

  ngOnInit() {
    this.todoListStorage.get().then((data:any)=>{
      if(data){
        this.items=data;
      }
    })
  }

  public async getItems(){
    const items = await this.todoListStorage.get();
    this.items = items;
    this.todoObservable.next(items);
    return items;
  }

  public getDetail(index){
    return this.items[index];
  }


  public addItem(item:todoItem){
    this.items.push(item);
    this.text='';
    this.save();
  }

  public updateItem(item:todoItem,index){
    this.items.splice(index,1,item);
    this.save();
  }

  public removeItem(index){
    this.items.splice(index,1);
    this.save();
  }

  public markAsComplete(index,state){
    this.items[index].c=state;
    this.save();
  }

  private async save(){
    await this.todoListStorage.set(this.items);
    this.todoObservable.next(this.items)
  }
}
