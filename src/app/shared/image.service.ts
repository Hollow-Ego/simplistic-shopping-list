import { Injectable } from '@angular/core';
import {
  Plugins,
  CameraPhoto,
  CameraResultType,
  CameraSource,
  Capacitor,
  FilesystemDirectory,
  Toast,
} from '@capacitor/core';
import { Platform } from '@ionic/angular';
const { Filesystem, Camera } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private platform: Platform) {}

  async takeImage() {
    console.log('Taking image');

    const capturedImage = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 100,
      correctOrientation: true,
    });

    return capturedImage;
  }

  async savePicture(cameraPhoto: CameraPhoto) {
    if (!cameraPhoto) {
      return;
    }

    const base64Data = await this.readAsBase64(cameraPhoto);

    // Write the file to the data directory

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data,
    });

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        fileName,
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath,
        fileName,
      };
    }
  }

  async deleteImage(path: string) {
    Filesystem.deleteFile({
      path,
      directory: FilesystemDirectory.Data,
    }).catch(err => {
      console.log(err);
      Toast.show({ text: 'Error on deleting image' });
    });
  }

  async readAsBase64(cameraPhoto: CameraPhoto) {
    // Fetch the photo, read as a blob, then convert to base64 format
    if (!cameraPhoto) {
      return;
    }
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path,
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(cameraPhoto.webPath);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
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
