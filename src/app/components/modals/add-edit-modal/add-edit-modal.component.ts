import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Image } from '../../../shared/models/image.model';
import * as Modes from '../../../shared/constants';
import { PopulatedItem } from '../../../shared/models/populated-item.model';
import { ModalController } from '@ionic/angular';

@Component({
	selector: 'ssl-add-edit-modal',
	templateUrl: './add-edit-modal.component.html',
	styleUrls: ['./add-edit-modal.component.scss'],
})
export class AddEditModalComponent implements OnInit {
	constructor(
		public formBuilder: FormBuilder,
		public modalController: ModalController
	) {}
	@Input() item: PopulatedItem = null;
	@Input() mode: string = Modes.MODAL_ADD_MODE;

	public modalTitle: string = this.isNewItem()
		? 'titles.addItemTitle'
		: 'titles.editItemTitle';
	public submitButtonText: string = this.isNewItem()
		? 'common.addText'
		: 'common.saveText';
	public itemForm: FormGroup;
	public pickedImage: Image = null;

	ngOnInit() {
		if (!this.item) {
			this.item = {
				itemID: null,
				name: '',
				imgData: null,
				amount: '',
				tags: [''],
				unit: '',
			};
		}

		this.itemForm = this.formBuilder.group({
			itemID: [this.item.itemID],
			name: [this.item.name, [Validators.required, Validators.minLength(3)]],
			amount: [this.item.amount],
			tags: [this.item.tags],
			unit: [this.item.unit],
		});
		this.pickedImage = this.item.imgData;
	}

	onCancel() {}

	onSubmit() {}

	onImagePicked($event: Image) {
		this.pickedImage = $event;
	}

	isNewItem() {
		return !this.item || this.mode === Modes.MODAL_ADD_MODE;
	}

	ngOnDestroy() {
		if (window.history.state.modal) {
			history.back();
		}
	}

	dismissModal(canceled = false) {
		const image = this.pickedImage;
		this.modalController.dismiss({ canceled, image });
	}

	cancelInput() {
		this.dismissModal(true);
	}
}
