import { Injectable } from '@angular/core';
import { BehaviorSubject, pipe } from 'rxjs';
import { ShoppingListItem } from './models/shopping-list-item.model';
import { take, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})

// [
//     ['a', new ShoppingListItem(null, null, 'https://bit.ly/3pIjJEy')],
//     ['b', new ShoppingListItem('Milk', null, 'https://bit.ly/3pIjJEy')],
//     ['c', new ShoppingListItem('Cheese', '3kg', 'https://bit.ly/3pIjJEy')],
//     ['d', new ShoppingListItem('Toiletpaper', '10x')],
//     ['e', new ShoppingListItem('Snacks')],
//   ]
export class ShoppingListService {
  private _shoppingList = new BehaviorSubject<Map<string, ShoppingListItem>>(
    new Map()
  );

  get shoppingList() {
    return this._shoppingList.asObservable();
  }

  constructor(private storage: Storage) {
    storage.ready().then(() => {
      this.shoppingList
        .pipe(
          take(1),
          tap(shoppingList => {
            storage.forEach((value, key) => {
              shoppingList.set(key, value);
            });
            this._shoppingList.next(shoppingList);
          })
        )
        .subscribe();
    });
  }

  addItem(name: string, amount: string, imgUrl: string) {
    const uuid = uuidv4();
    const newItem = new ShoppingListItem(name, amount, imgUrl);
    return this.shoppingList.pipe(
      take(1),
      tap(shoppingList => {
        this.storage.set(uuid, JSON.stringify(newItem));
        this._shoppingList.next(shoppingList.set(uuid, newItem));
      })
    );
  }

  editItem(editItem: ShoppingListItem, id: string) {
    return this.shoppingList.pipe(
      take(1),
      tap(shoppingList => {
        this.storage.set(id, JSON.stringify(editItem));
        this._shoppingList.next(shoppingList.set(id, editItem));
      })
    );
  }

  removeItem(id: string) {
    return this.shoppingList.pipe(
      take(1),
      tap(shoppingList => {
        this.storage.remove(id).then(() => {
          shoppingList.delete(id);
          this._shoppingList.next(shoppingList);
        });
      })
    );
  }
}
