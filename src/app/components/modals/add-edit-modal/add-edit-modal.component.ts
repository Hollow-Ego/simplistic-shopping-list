import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Image } from '../../../shared/models/image.model';

@Component({
	selector: 'app-add-edit-modal',
	templateUrl: './add-edit-modal.component.html',
	styleUrls: ['./add-edit-modal.component.scss'],
})
export class AddEditModalComponent implements OnInit {
	constructor(public formBuilder: FormBuilder) {}

	public modalTitle: string = 'newEditItem.title-edit';
	public submitButtonText: string = 'newEditItem.saveText';
	public pickedImage: Image;
	public itemForm: FormGroup;

	ngOnInit() {
		this.itemForm = this.formBuilder.group({
			itemID: [null],
			name: ['', [Validators.required, Validators.minLength(3)]],
			amount: [''],
			tags: [''],
			unit: [''],
		});
		this.pickedImage = {
			fileName: 'Hans',
			filepath: '',
			webviewPath:
				'https://cdn.pixabay.com/photo/2017/10/14/15/50/banana-2850841_1280.png',
		};
	}

	onCancel() {}

	onSubmit() {}

	onImagePicked(event: CustomEvent) {}
}
