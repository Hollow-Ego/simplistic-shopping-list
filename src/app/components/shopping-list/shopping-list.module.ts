import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingListPageRoutingModule } from './shopping-list-routing.module';

import { ShoppingListView } from './shopping-list.view';

import { ShoppingListPageComponent } from './shopping-list.page/shopping-list.page.component';
import { PopulatedItemComponent } from './shopping-list.page/populated-item/populated-item.component';

import { SharedModule } from '../../shared/shared.module';
import { ImageModalComponent } from '../modals/image-modal/image-modal.component';

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
