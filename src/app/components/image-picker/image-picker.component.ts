import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { CameraPhoto, Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Image } from '../../shared/models/image.model';
import { TranslationService } from '../../shared/i18n/translation.service';
import { ImageService } from '../../services/image.service';
@Component({
	selector: 'ssl-image-picker',
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
		private translate: TranslationService,
		private imageService: ImageService
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
		const capturedImage: CameraPhoto = await this.imageService
			.takeImage()
			.catch(error => {
				if (this.useFilePicker) {
					console.log('Using file picker');

					this.filePickerRef.nativeElement.click();
				}
				console.log(error);
				return null;
			});

		this.selectedImage = await this.imageService.savePicture(capturedImage);
		this.imagePick.emit(this.selectedImage);
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
			this.selectedImage = {
				filepath: '',
				webviewPath: dataUrl,
				fileName,
			};
		};

		fr.readAsDataURL(image);
		this.imagePick.emit(this.selectedImage);
	}
}
