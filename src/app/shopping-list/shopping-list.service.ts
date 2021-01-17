import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, pipe } from 'rxjs';
import { ShoppingListItem } from './models/shopping-list-item.model';
import { take, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@ionic/storage';
import { Image } from './models/image.model';
import { Platform } from '@ionic/angular';
import { Filesystem, FilesystemDirectory } from '@capacitor/core';

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

  constructor(private storage: Storage, private platform: Platform) {}

  async loadShoppingList() {
    await this.storage.ready();
    const loadedItems = [];
    console.log('Loading');

    this.storage.forEach(async (value, key) => {
      loadedItems.push({ ...JSON.parse(value), id: key });
    });

    this.shoppingList
      .pipe(
        take(1),
        tap(async shoppingList => {
          await Promise.all(
            loadedItems.map(async loadedItem => {
              console.dir(loadedItem);

              const { name, amount, imgData, id } = loadedItem;
              if (
                (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
                this.platform.is('desktop')
              ) {
                const readFile = await Filesystem.readFile({
                  path: imgData.filepath,
                  directory: FilesystemDirectory.Data,
                });

                // Web platform only: Load the photo as base64 data
                imgData.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
              }
              const item = new ShoppingListItem(name, amount, imgData);
              shoppingList.set(id, item);
            })
          );
          this._shoppingList.next(shoppingList);
        })
      )
      .subscribe();
  }

  addItem(name: string, amount: string, imgData: Image) {
    const uuid = uuidv4();
    const newItem = new ShoppingListItem(name, amount, imgData);
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
