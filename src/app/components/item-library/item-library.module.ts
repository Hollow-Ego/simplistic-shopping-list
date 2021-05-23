import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ItemLibraryComponent } from './item-library.component';

@NgModule({
	declarations: [ItemLibraryComponent],
	imports: [CommonModule, SharedModule],
})
export class ItemLibraryModule {}
