import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LNG_KEY = 'SELECTED_LANGUAGE';
  selected: string = '';

  constructor(private translate: TranslateService, private storage: Storage) { }

  setInitialAppLanguage() {
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    this.storage.get(this.LNG_KEY).then(lang => {
      if (lang) {
        this.selected = lang;
        this.setLanguage(lang);
      }
    })
  }

  get getLangKey() {
    return this.LNG_KEY;
  }
  get getLang() {
    return this.selected;
  }

  setLanguage(lang) {
    this.translate.use(lang);
    this.selected = lang;
    this.storage.set(this.LNG_KEY, lang);
  }
}
