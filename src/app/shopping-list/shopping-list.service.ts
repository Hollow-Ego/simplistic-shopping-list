import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, pipe } from 'rxjs';
import { ShoppingListItem } from './models/shopping-list-item.model';
import { take, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@ionic/storage';
import { Image } from './models/image.model';
import { Platform } from '@ionic/angular';
import { Plugins, FilesystemDirectory } from '@capacitor/core';
import { ImageService } from '../shared/image.service';
const { Filesystem } = Plugins;
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

  constructor(
    private storage: Storage,
    private platform: Platform,
    private imageService: ImageService
  ) {}

  async loadShoppingList() {
    await this.storage.ready().then();
    const loadedItems = [];

    await this.storage.forEach((value, key) => {
      loadedItems.push({ ...JSON.parse(value), id: key });
    });

    const convertedList: Map<string, ShoppingListItem> = new Map();

    for await (const loadedItem of loadedItems) {
      const { name, amount, imgData, id } = loadedItem;

      if (!this.platform.is('hybrid')) {
        const readFile = await Filesystem.readFile({
          path: imgData.filepath,
          directory: FilesystemDirectory.Data,
        });

        // Web platform only: Load the photo as base64 data
        imgData.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
      const item = new ShoppingListItem(name, amount, imgData);
      convertedList.set(id, item);
    }
    this._shoppingList.next(convertedList);
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
        this.storage.remove(id).then(async () => {
          const obj = shoppingList.get(id);
          if (obj.imgData) {
            const path = obj.imgData.fileName;
            this.imageService.deleteImage(path);
          }
          shoppingList.delete(id);
          this._shoppingList.next(shoppingList);
        });
      })
    );
  }
}
