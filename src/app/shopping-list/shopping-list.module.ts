import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingListPageRoutingModule } from './shopping-list-routing.module';

import { ShoppingListPage } from './shopping-list.page';
import { SharedModule } from '../shared/shared.module';
import { ShoppingListItemComponent } from './shopping-list-item/shopping-list-item.component';
import { ImageModalComponent } from '../shared/modals/image/image-modal.component';
import { NewEditItemComponent } from './new-edit-item/new-edit-item.component';
import { ImagePickerComponent } from '../shared/image-picker/image-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShoppingListPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    ShoppingListPage,
    ShoppingListItemComponent,
    ImageModalComponent,
    NewEditItemComponent,
    ImagePickerComponent,
  ],
})
export class ShoppingListPageModule {}
