import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from '../../shared/i18n/translation.service';
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
    const { itemname, amount, imgUrl } = form.value;
    if (!itemname && !amount && !imgUrl) {
      return false;
    }
    return true;
  }

  onSubmit(form: NgForm) {
    let sub: Observable<Map<string, ShoppingListItem>>;
    const { itemname, amount, imgUrl } = form.value;
    if (this.isEditMode) {
      const editItem = new ShoppingListItem(itemname, amount, imgUrl);
      sub = this.shoppingListService.editItem(editItem, this.item[0]);
    } else {
      sub = this.shoppingListService.addItem(itemname, amount, imgUrl);
    }
    sub.subscribe(() => {
      this.modalCtrl.dismiss();
    });
  }
}
