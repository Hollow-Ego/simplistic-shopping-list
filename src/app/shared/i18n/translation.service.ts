import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageDetails } from './language-details.model';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private _avaiableLanguages: LanguageDetails[] = [
    { name: 'English', short: 'en' },
    { name: 'Deutsch', short: 'de' },
  ];
  private _defaultLanguage = 'en';
  private _currentLanguage = this._defaultLanguage;

  get currentLanguage() {
    return this._currentLanguage;
  }

  get avaiableLanguages() {
    return this._avaiableLanguages;
  }

  constructor(private translate: TranslateService) {
    const languageShorts = this.avaiableLanguages.map(lang => lang.short);
    translate.addLangs(languageShorts);
    translate.setDefaultLang(this._defaultLanguage);

    const browserLang = translate.getBrowserLang();
    this.changeLanguage(
      browserLang.match(/en|de/) ? browserLang : this._currentLanguage
    );
  }

  changeLanguage(lang: string) {
    this._currentLanguage = lang;
    this.translate.use(lang);
  }
}
