import { Injectable } from '@angular/core';
import {
	Camera,
	CameraResultType,
	CameraSource,
	Photo,
} from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';
import { Platform } from '@ionic/angular';

@Injectable({
	providedIn: 'root',
})
export class ImageService {
	constructor(private platform: Platform) {}

	async takeImage() {
		const capturedImage = await Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Prompt,
			quality: 100,
		});
		return capturedImage;
	}

	async savePicture(rawPhoto: Photo) {
		if (!rawPhoto) {
			return;
		}

		// Write the file to the data directory
		const fileName = new Date().getTime() + '.jpeg';

		const base64Data = await this.readAsBase64(rawPhoto);

		const savedFile = await Filesystem.writeFile({
			data: base64Data,
			path: fileName,
			directory: Directory.Data,
		});

		if (this.platform.is('hybrid')) {
			return {
				filepath: savedFile.uri,
				webviewPath: Capacitor.convertFileSrc(savedFile.uri),
				fileName,
			};
		}
		return {
			filepath: fileName,
			webviewPath: rawPhoto.webPath,
			fileName,
		};
	}

	async getWebViewPathImage(filePath: string) {
		const readFile = await Filesystem.readFile({
			path: filePath,
			directory: Directory.Data,
		});

		// Web platform only: Load the photo as base64 data
		return `data:image/jpeg;base64,${readFile.data}`;
	}

	async deleteImage(path: string) {
		Filesystem.deleteFile({
			path,
			directory: Directory.Data,
		}).catch(err => {
			console.log(err);
			Toast.show({ text: 'Error on deleting image' });
		});
	}

	async readAsBase64(Photo: Photo) {
		// Fetch the photo, read as a blob, then convert to base64 format
		if (!Photo) {
			return;
		}
		// "hybrid" will detect Cordova or Capacitor
		if (this.platform.is('hybrid')) {
			// Read the file into base64 format
			const file = await Filesystem.readFile({
				path: Photo.path,
			});

			return file.data;
		} else {
			// Fetch the photo, read as a blob, then convert to base64 format
			const response = await fetch(Photo.webPath);
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
