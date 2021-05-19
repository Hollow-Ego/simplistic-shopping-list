import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { IonicModule, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '../app/app.component';
import { ShoppingListEffects } from '../app/store/shopping-list.effects';
import { NavMock } from './nav.mock';
import * as fromApp from '../app/store/app.reducer';

describe('AppComponent', () => {
	let statusBarSpy,
		splashScreenSpy,
		platformReadySpy,
		platformSpy,
		routerSpy,
		fakeTranslateService;

	beforeEach(
		waitForAsync(() => {
			statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
			splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
			platformReadySpy = Promise.resolve();
			platformSpy = jasmine.createSpyObj('Platform', {
				ready: platformReadySpy,
				backButton: { subscribeWithPriority: jasmine.createSpy() },
			});
			routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
			fakeTranslateService = jasmine.createSpyObj('TranslateService', {
				addLangs: null,
				setDefaultLang: 'en',
				getBrowserLang: 'en',
				use: null,
			});

			TestBed.configureTestingModule({
				declarations: [AppComponent],
				imports: [
					BrowserModule,
					IonicModule.forRoot(),
					IonicStorageModule.forRoot(),
					StoreModule.forRoot(fromApp.appReducer),
					EffectsModule.forRoot([ShoppingListEffects]),
					RouterTestingModule,
				],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [
					{ provide: StatusBar, useValue: statusBarSpy },
					{ provide: SplashScreen, useValue: splashScreenSpy },
					{ provide: Platform, useValue: platformSpy },
					{ provide: TranslateService, useValue: fakeTranslateService },
					{
						provide: NavController,
						useClass: NavMock,
					},
				],
			}).compileComponents();
		})
	);

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});

	// TODO: add more tests!
});
