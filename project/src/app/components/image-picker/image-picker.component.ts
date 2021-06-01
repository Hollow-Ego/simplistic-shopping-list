import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Image } from '../../shared/models/image.model';
import { ImageService } from '../../services/image.service';
import { Photo } from '@capacitor/camera';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
	selector: 'pxsl1-image-picker',
	templateUrl: './image-picker.component.html',
	styleUrls: ['./image-picker.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: ImagePickerComponent,
		},
	],
})
export class ImagePickerComponent implements OnInit, ControlValueAccessor {
	public onChange = pickedImage => {};
	public onTouched = () => {};
	public touched = false;
	public disabled = false;

	public pickedImg: Image;
	public useFilePicker = false;

	public imgPlaceholderPath = 'assets/img-placeholder.png';
	public filepath: string = '';
	public webviewPath: string = this.imgPlaceholderPath;
	public fileName: string = '';

	@ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
	public failedLoading: boolean;

	constructor(private platform: Platform, private imageService: ImageService) {}

	ngOnInit() {
		if (
			(this.platform.is('mobile') && !this.platform.is('hybrid')) ||
			this.platform.is('desktop')
		) {
			this.useFilePicker = true;
		}
		if (this.pickedImg) {
			const { filepath, webviewPath, fileName } = this.pickedImg;
			this.filepath = filepath;
			this.webviewPath = webviewPath;
			this.fileName = fileName;
		}
	}

	async onPickImage() {
		if (!Capacitor.isPluginAvailable('Camera')) {
			this.filePickerRef.nativeElement.click();
			return;
		}
		const capturedImage: Photo = await this.imageService
			.takeImage()
			.catch(error => {
				if (error.message === 'User cancelled photos app') {
					return null;
				}

				if (this.useFilePicker) {
					this.filePickerRef.nativeElement.click();
				}

				return null;
			});

		if (capturedImage) {
			this.pickedImg = await this.imageService.savePicture(capturedImage);
			const { filepath, webviewPath, fileName } = this.pickedImg;
			this.filepath = filepath;
			this.webviewPath = webviewPath;
			this.fileName = fileName;
			this.onChange(this.pickedImg);
		}
	}

	onFilePicked(event: Event) {
		const image = (event.target as HTMLInputElement).files[0];
		if (!image) {
			return;
		}
		const fr = new FileReader();
		const fileName = new Date().getTime() + '.jpeg';
		fr.onload = () => {
			const dataUrl = fr.result.toString();
			this.pickedImg = {
				filepath: '',
				webviewPath: dataUrl,
				fileName,
			};
		};

		fr.readAsDataURL(image);
		this.onChange(this.pickedImg);
	}

	onClearImage() {
		this.filepath = '';
		this.webviewPath = this.imgPlaceholderPath;
		this.fileName = '';
		this.failedLoading = false;
		this.onChange(null);
	}

	onLoadError() {
		this.failedLoading = true;
	}

	onDidLoad() {
		this.failedLoading = false;
	}

	writeValue(pickedImg: Image): void {
		this.pickedImg = pickedImg;
	}
	registerOnChange(onChange: any): void {
		this.onChange = onChange;
	}
	registerOnTouched(onTouched: any): void {
		this.onTouched = onTouched;
	}
	markAsTouched() {
		if (!this.touched) {
			this.onTouched();
			this.touched = true;
		}
	}
	setDisabledState(disabled: boolean) {
		this.disabled = disabled;
	}
}
