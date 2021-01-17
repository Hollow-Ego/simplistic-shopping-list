import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TranslationService } from '../shared/i18n/translation.service';
import { NewEditItemComponent } from './new-edit-item/new-edit-item.component';
import { ShoppingListItem } from './models/shopping-list-item.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit, OnDestroy {
  public shoppingList: Map<string, ShoppingListItem>;
  private shoppingItemsSub: Subscription;
  constructor(
    private translate: TranslationService,
    private shoppingListService: ShoppingListService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.shoppingItemsSub = this.shoppingListService.shoppingList.subscribe(
      shoppingList => {
        this.shoppingList = shoppingList;
        // this.syncShoppingLists(shoppingList);
      }
    );
  }

  // syncShoppingLists(newList: Map<string, ShoppingListItem>) {
  //   if (!this.shoppingList) {
  //     this.shoppingList = newList;
  //   }

  //   const removedItems = [];
  //   this.shoppingList.forEach((value, key) => {
  //     if (!newList.has(key)) {
  //       removedItems.push(key);
  //     }
  //   });
  //   newList.forEach((value, key) => {
  //     if (!this.shoppingList.has(key)) {
  //       this.shoppingList.set(key, value);
  //     }
  //   });

  //   removedItems.forEach(key => {
  //     this.shoppingList.delete(key);
  //   });
  // }

  async onEditItem(item: ShoppingListItem, slidingItem: IonItemSliding) {
    slidingItem.close();

    const modal = await this.modalCtrl.create({
      component: NewEditItemComponent,
      componentProps: {
        isEditMode: true,
        item,
      },
    });
    await modal.present();
  }

  async onAddItem() {
    const modal = await this.modalCtrl.create({
      component: NewEditItemComponent,
    });
    await modal.present();
  }

  ngOnDestroy() {
    if (this.shoppingItemsSub) {
      this.shoppingItemsSub.unsubscribe();
    }
  }
}
