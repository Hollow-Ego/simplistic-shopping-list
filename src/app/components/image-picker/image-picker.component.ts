import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Image } from '../../shared/models/image.model';
import { TranslationService } from '../../shared/i18n/translation.service';
import { ImageService } from '../../services/image.service';
import { Photo } from '@capacitor/camera';
@Component({
	selector: 'ssl-image-picker',
	templateUrl: './image-picker.component.html',
	styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
	public pickedImg: Image;
	public useFilePicker = false;

	public imgPlaceholderPath = 'assets/img-placeholder.png';
	public filepath: string = '';
	public webviewPath: string = this.imgPlaceholderPath;
	public fileName: string = '';

	@ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
	@Output() imagePick = new EventEmitter<Image>();
	@Input() existingImg: Image = null;
	public failedLoading: boolean;

	constructor(private platform: Platform, private imageService: ImageService) {}

	ngOnInit() {
		if (
			(this.platform.is('mobile') && !this.platform.is('hybrid')) ||
			this.platform.is('desktop')
		) {
			this.useFilePicker = true;
		}
		if (this.existingImg) {
			const { filepath, webviewPath, fileName } = this.existingImg;
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
				if (error.message === 'User cancelled photos app' && this.existingImg) {
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
			this.imagePick.emit(this.pickedImg);
			return;
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
		this.imagePick.emit(this.pickedImg);
	}

	onClearImage() {
		this.filepath = '';
		this.webviewPath = this.imgPlaceholderPath;
		this.fileName = '';
		this.failedLoading = false;
		this.imagePick.emit(null);
	}

	onLoadError() {
		this.failedLoading = true;
	}

	onDidLoad() {
		this.failedLoading = false;
	}
}
