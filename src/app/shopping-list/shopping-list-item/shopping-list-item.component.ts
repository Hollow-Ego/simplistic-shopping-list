import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GestureController, PopoverController } from '@ionic/angular';
import { ImageModalComponent } from '../../shared/modals/image/image-modal.component';
import { ShoppingListItem } from '../models/shopping-list-item.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list-item',
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.scss'],
})
export class ShoppingListItemComponent implements OnInit, AfterViewInit {
  @Input() item: ShoppingListItem;
  @ViewChild('shoppingItem') shoppingItemRef: ElementRef;
  private lastOnStart = 0;
  private DOUBLE_CLICK_THRESHOLD = 500;

  constructor(
    private popoverCtrl: PopoverController,
    private gestureCtrl: GestureController,
    private shoppingListService: ShoppingListService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const gesture = this.gestureCtrl.create(
      {
        gestureName: 'double-click',
        el: this.shoppingItemRef.nativeElement,
        threshold: 0,
        onStart: () => {
          this.onStartDoubleClick();
        },
      },
      true
    );

    gesture.enable();
  }

  onStartDoubleClick() {
    const now = Date.now();
    if (Math.abs(now - this.lastOnStart) <= this.DOUBLE_CLICK_THRESHOLD) {
      this.shoppingListService.removeItem(this.item.id).subscribe(() => {
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
}
