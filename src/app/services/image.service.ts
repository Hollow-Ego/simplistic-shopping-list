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
		const capturedImage = await Camera.getPhoto({
			resultType: CameraResultType.Base64,
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

		// Write the file to the data directory
		const fileName = new Date().getTime() + '.jpeg';
		const savedFile = await Filesystem.writeFile({
			path: fileName,
			data: cameraPhoto.base64String,
			directory: FilesystemDirectory.Data,
		});

		// const pathParts = cameraPhoto.path.split('cache/');
		// Filesystem.deleteFile({
		//   path: 'Pictures/' + pathParts[1],
		//   directory: FilesystemDirectory.Cache,
		// }).catch(err => {
		//   console.log(err);
		//   Toast.show({ text: 'Error on deleting image' });
		// });

		if (this.platform.is('hybrid')) {
			return {
				filepath: savedFile.uri,
				webviewPath: Capacitor.convertFileSrc(savedFile.uri),
				fileName,
			};
		} else {
			return {
				filepath: fileName,
				webviewPath: cameraPhoto.webPath,
				fileName,
			};
		}
	}

	async getWebViewPathImage(filePath: string) {
		const readFile = await Filesystem.readFile({
			path: filePath,
			directory: FilesystemDirectory.Data,
		});

		// Web platform only: Load the photo as base64 data
		return `data:image/jpeg;base64,${readFile.data}`;
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
