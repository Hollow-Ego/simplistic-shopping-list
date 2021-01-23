import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import {
  Capacitor,
  CameraSource,
  CameraResultType,
  Plugins,
  CameraPhoto,
  FilesystemDirectory,
} from '@capacitor/core';
const { Filesystem, Camera } = Plugins;

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CommonModule,
    IonicModule,
    TranslateModule.forChild({ extend: true }),
  ],
  exports: [TranslateModule],
})
export class SharedModule {}
