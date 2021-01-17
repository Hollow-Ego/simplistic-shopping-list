import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShoppingListItem } from './models/shopping-list-item.model';
import { take, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private _shoppingList = new BehaviorSubject<ShoppingListItem[]>([
    new ShoppingListItem('a', null, null, 'https://bit.ly/3pIjJEy'),
    new ShoppingListItem('b', 'Milk', null, 'https://bit.ly/3pIjJEy'),
    new ShoppingListItem('c', 'Cheese', '3kg', 'https://bit.ly/3pIjJEy'),
    new ShoppingListItem('d', 'Toiletpaper', '10x'),
    new ShoppingListItem('e', 'Snacks'),
  ]);

  get shoppingList() {
    return this._shoppingList.asObservable();
  }

  constructor() {}

  addItem(name: string, amount: string, imgUrl: string) {
    const uuid = uuidv4();
    const newItem = new ShoppingListItem(uuid, name, amount, imgUrl);
    return this.shoppingList.pipe(
      take(1),
      tap(shoppingList => {
        this._shoppingList.next(shoppingList.concat(newItem));
      })
    );
  }

  editItem(editItem: ShoppingListItem) {
    return this.shoppingList.pipe(
      take(1),
      tap(shoppingList => {
        this._shoppingList.next(
          shoppingList.map(item => {
            if (item.id !== editItem.id) {
              return item;
            }
            return editItem;
          })
        );
      })
    );
  }

  removeItem(id: string) {
    return this.shoppingList.pipe(
      take(1),
      tap(shoppingList => {
        this._shoppingList.next(shoppingList.filter(item => item.id !== id));
      })
    );
  }
}
