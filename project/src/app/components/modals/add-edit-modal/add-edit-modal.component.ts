import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Image } from '../../../shared/models/image.model';
import * as Modes from '../../../shared/constants';

import { PopulatedItem } from '../../../shared/models/populated-item.model';
import { ModalController } from '@ionic/angular';
import { singleCurrencyData } from '../../../shared/models/currency-data.model';
@Component({
	selector: 'pxsl1-add-edit-modal',
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
	@Input() availableTags: string[];

	public modalTitle: string = this.isNewItem()
		? 'titles.addItemTitle'
		: 'titles.editItemTitle';

	public submitButtonText: string = this.isNewItem()
		? 'common.addText'
		: 'common.saveText';

	public itemForm: FormGroup;

	public allCurrencyData: singleCurrencyData[];
	private allCurrenciesLoaded = false;

	ngOnInit() {
		if (!this.item) {
			// To be refactored into a setting
			const defaultCurrency: singleCurrencyData = {
				symbol: '\u20AC',
				code: 'EUR',
				symbol_native: '\u20AC',
				decimal_digits: 2,
				rounding: 0.0,
			};

			this.allCurrencyData = [defaultCurrency];

			this.item = {
				itemID: null,
				name: null,
				imgData: { filepath: '', fileName: '', webviewPath: '' },
				amount: null,
				tags: [],
				unit: null,
				price: null,
				currency: defaultCurrency,
			};
		}

		this.itemForm = this.formBuilder.group({
			itemID: this.item.itemID,
			name: [this.item.name, [Validators.required, Validators.minLength(3)]],
			amount: this.item.amount,
			imgData: this.item.imgData,
			tags: [[...this.item.tags]],
			unit: this.item.unit,
			price: this.item.price,
			currency: this.item.currency,
		});

		// this.itemForm.valueChanges.subscribe(() => {
		// 	console.log(this.item.name);
		// 	console.log(this.item.tags);
		// });

		//  Needs a solution to only load if the user actually clicks on the currency selection
		this.loadAllCurrencyData();
	}

	onCancel() {}

	onSubmit() {
		this.dismissModal();
	}

	isNewItem() {
		return !this.item || this.mode === Modes.MODAL_ADD_MODE;
	}

	loadAllCurrencyData() {
		if (this.allCurrenciesLoaded) {
			return;
		}
		import('../../../shared/i18n/currencyMap.json').then(data => {
			this.allCurrencyData = Object.values(data['currencies']);
			this.allCurrenciesLoaded = true;
		});
	}

	compareWith(cur1: singleCurrencyData, cur2: singleCurrencyData) {
		return cur1 && cur2 ? cur1.code === cur2.code : cur1 === cur2;
	}

	dismissModal(canceled = false) {
		const itemData = this.itemForm.value;
		if (!this.itemForm.dirty) {
			canceled = true;
		}
		this.modalController.dismiss({ canceled, itemData });
	}

	cancelInput() {
		this.dismissModal(true);
	}

	ngOnDestroy() {
		if (window.history.state.modal) {
			history.back();
		}
	}
}
