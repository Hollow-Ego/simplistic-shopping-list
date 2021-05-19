import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingListPageRoutingModule } from './shopping-list-routing.module';

import { ShoppingListView } from './shopping-list.view';
import { SharedModule } from '../shared/shared.module';

import { ImageModalComponent } from '../shared/modals/image/image-modal.component';

import { ImagePickerComponent } from '../shared/image-picker/image-picker.component';
import { ShoppingListPageComponent } from './shopping-list.page/shopping-list.page.component';
import { PopulatedItemComponent } from './shopping-list-item/populated-item.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ShoppingListPageRoutingModule,
		SharedModule,
	],
	declarations: [
		ShoppingListView,
		ImageModalComponent,
		ShoppingListPageComponent,
		PopulatedItemComponent,
	],
})
export class ShoppingListPageModule {}
