import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { AddEditModalComponent } from '../components/modals/add-edit-modal/add-edit-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImagePickerComponent } from '../components/image-picker/image-picker.component';

const { Filesystem, Camera } = Plugins;

@NgModule({
	declarations: [AddEditModalComponent, ImagePickerComponent],
	imports: [
		CommonModule,
		IonicModule,
		TranslateModule.forChild({ extend: true }),
		ReactiveFormsModule,
	],
	exports: [TranslateModule],
})
export class SharedModule {}
