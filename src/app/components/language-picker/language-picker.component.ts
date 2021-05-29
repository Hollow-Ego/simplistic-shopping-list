import { Component, OnInit } from '@angular/core';
import { LanguageDetails } from '../../shared/i18n/language-details.model';
import { TranslationService } from '../../shared/i18n/translation.service';

@Component({
	selector: 'ssl-language-picker',
	templateUrl: './language-picker.component.html',
	styleUrls: ['./language-picker.component.scss'],
})
export class LanguagePickerComponent implements OnInit {
	public language: string;
	public availableLanguages: LanguageDetails[];

	constructor(private translate: TranslationService) {}

	ngOnInit() {
		this.language = this.translate.currentLanguage;
		this.availableLanguages = this.translate.availableLanguages;
	}

	onLanguageChange() {
		this.translate.changeLanguage(this.language);
	}
}
