import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from '../../shared/i18n/translation.service';
import { Image } from '../models/image.model';
import { ShoppingListItem } from '../models/shopping-list-item.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-new-edit-item',
  templateUrl: './new-edit-item.component.html',
  styleUrls: ['./new-edit-item.component.scss'],
})
export class NewEditItemComponent implements OnInit {
  public isEditMode = false;
  public modalTitle: string;
  public submitButtonText: string;
  public currentImage: Image;
  @Input() item: [string, ShoppingListItem];

  constructor(
    private translate: TranslationService,
    private modalCtrl: ModalController,
    private shoppingListService: ShoppingListService
  ) {}

  ngOnInit() {
    if (!this.item) {
      this.item = ['', new ShoppingListItem(null, null, null)];
      this.isEditMode = false;
    }
    this.currentImage = this.item[1].imgData;

    this.modalTitle = this.isEditMode
      ? 'newEditItem.title-edit'
      : 'newEditItem.title-new';

    this.submitButtonText = this.isEditMode
      ? 'newEditItem.saveText'
      : 'newEditItem.addText';
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  isFormValid(form: NgForm) {
    const { itemname, amount } = form.value;

    if (!itemname && !amount && !this.currentImage) {
      return false;
    }
    return true;
  }

  onSubmit(form: NgForm) {
    let sub: Observable<Map<string, ShoppingListItem>>;
    const { itemname, amount } = form.value;
    if (this.isEditMode) {
      const editItem = new ShoppingListItem(
        itemname,
        amount,
        this.currentImage
      );
      sub = this.shoppingListService.editItem(editItem, this.item[0]);
    } else {
      sub = this.shoppingListService.addItem(
        itemname,
        amount,
        this.currentImage
      );
    }
    sub.subscribe(() => {
      this.modalCtrl.dismiss();
    });
  }

  onImagePicked(image: Image) {
    this.currentImage = image;
  }
}
