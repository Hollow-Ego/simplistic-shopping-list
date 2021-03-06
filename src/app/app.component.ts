import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackButtonEvent } from '@ionic/core';
import { Plugins, Toast } from '@capacitor/core';
import { TranslationService } from './shared/i18n/translation.service';
const { App } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private lastOnStart = 0;
  private DOUBLE_CLICK_THRESHOLD = 2000;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslationService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      const routerEl = document.querySelector('ion-router');
      document.addEventListener('ionBackButton', (ev: BackButtonEvent) => {
        ev.detail.register(-1, () => {
          const path = window.location.pathname;

          if (path === '/home') {
            this.onStartDoubleClick();
          }
        });
      });
    });
  }

  onStartDoubleClick() {
    const now = Date.now();
    if (Math.abs(now - this.lastOnStart) <= this.DOUBLE_CLICK_THRESHOLD) {
      App.exitApp();
    } else {
      this.lastOnStart = now;
      this.translate.getTranslation('closeToast').subscribe(closeToast => {
        Toast.show({ text: closeToast, duration: 'short' });
      });
    }
  }
}
