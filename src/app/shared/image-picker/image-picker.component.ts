import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  Capacitor,
  CameraSource,
  CameraResultType,
  Plugins,
  CameraPhoto,
  FilesystemDirectory,
  Filesystem,
  Storage,
} from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Image } from '../../shopping-list/models/image.model';
import { TranslationService } from '../i18n/translation.service';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<Image>();
  @Input() showPreview = true;
  @Input() pickedImage = null;

  public selectedImage: Image;
  public useFilePicker = false;

  constructor(
    private platform: Platform,
    private translate: TranslationService
  ) {}

  ngOnInit() {
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.useFilePicker = true;
    }
    this.selectedImage = this.pickedImage;
  }

  async onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    const capturedImage = await Plugins.Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
      correctOrientation: true,
    }).catch(error => {
      if (this.useFilePicker) {
        this.filePickerRef.nativeElement.click();
      }
      console.log(error);
      return null;
    });
    this.selectedImage = await this.savePicture(capturedImage);
    this.imagePick.emit(this.selectedImage);
  }

  onFilePicked(event: Event) {
    const image = (event.target as HTMLInputElement).files[0];
    if (!image) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = {
        filepath: '',
        webviewPath: dataUrl,
      };
      console.dir(fr);
    };

    fr.readAsDataURL(image);
    this.imagePick.emit(this.selectedImage);
  }

  private async savePicture(cameraPhoto: CameraPhoto) {
    if (!cameraPhoto) {
      return;
    }
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data,
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath,
    };
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // Fetch the photo, read as a blob, then convert to base64 format
    if (!cameraPhoto) {
      return;
    }
    const response = await fetch(cameraPhoto.webPath);
    const blob = await response.blob();

    return (await this.convertBlobToBase64(blob)) as string;
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}
