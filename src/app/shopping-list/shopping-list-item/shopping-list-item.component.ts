import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  IonItemSliding,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { ImageModalComponent } from '../../shared/modals/image/image-modal.component';
import { ShoppingListItem } from '../models/shopping-list-item.model';
import { NewEditItemComponent } from '../new-edit-item/new-edit-item.component';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list-item',
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.scss'],
})
export class ShoppingListItemComponent implements OnInit {
  @Input() item: [string, ShoppingListItem];
  @ViewChild('shoppingItem') shoppingItemRef: ElementRef;
  private lastOnStart = 0;
  private DOUBLE_CLICK_THRESHOLD = 500;

  constructor(
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private shoppingListService: ShoppingListService
  ) {}

  ngOnInit() {}

  onStartDoubleClick() {
    const now = Date.now();
    if (Math.abs(now - this.lastOnStart) <= this.DOUBLE_CLICK_THRESHOLD) {
      this.shoppingListService.removeItem(this.item[0]).subscribe(() => {
        this.lastOnStart = 0;
      });
    } else {
      this.lastOnStart = now;
    }
  }

  async onItemClick(title: string, imageUrl: string) {
    const popover = await this.popoverCtrl.create({
      component: ImageModalComponent,
      cssClass: 'image-modal',
      componentProps: {
        title,
        imageUrl,
      },
      showBackdrop: true,
      backdropDismiss: true,
    });
    await popover.present();
  }

  async onEditItem(
    item: [string, ShoppingListItem],
    slidingItem: IonItemSliding
  ) {
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
}
