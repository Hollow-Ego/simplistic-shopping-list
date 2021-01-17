import { Injectable } from '@angular/core';
import { BehaviorSubject, pipe } from 'rxjs';
import { ShoppingListItem } from './models/shopping-list-item.model';
import { take, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
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
              const { name, amount, imgUrl } = JSON.parse(value);

              const item = new ShoppingListItem(name, amount, imgUrl);
              shoppingList.set(key, item);
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
        this.storage.set(uuid, JSON.stringify(newItem)).then(() => {
          this._shoppingList.next(shoppingList.set(uuid, newItem));
        });
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
