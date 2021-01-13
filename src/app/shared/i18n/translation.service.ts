import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { avaiableLanguages, defaultLanguage } from './languages';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private _currentLanguage = defaultLanguage;

  constructor(private translate: TranslateService) {
    translate.addLangs(avaiableLanguages);
    translate.setDefaultLang(defaultLanguage);

    const browserLang = translate.getBrowserLang();
    translate.use(
      browserLang.match(/en|de/) ? browserLang : this._currentLanguage
    );
  }

  changeLanguage(lang: string) {
    this._currentLanguage = lang;
    this.translate.use(lang);
  }
}
