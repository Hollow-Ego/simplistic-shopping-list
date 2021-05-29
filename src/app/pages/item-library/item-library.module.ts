import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ItemLibraryRoutingModule } from './item-library-routing.module';
import { ItemLibraryComponent } from './item-library.view';

@NgModule({
	declarations: [ItemLibraryComponent],
	imports: [SharedModule, ItemLibraryRoutingModule],
})
export class ItemLibraryModule {}
