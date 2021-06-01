import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { State } from '../app/shared/models/state.model';
import * as Modes from '../app/shared/constants';
import * as SLActions from '../app/store/shopping-list.actions';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { ShoppingListEffects } from '../app/store/shopping-list.effects';
import { IonicStorageModule } from '@ionic/storage';
import { ShoppingListView } from '../app/shopping-list/shopping-list.view';
import {
	TranslateLoader,
	TranslateModule,
	TranslateService,
} from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app/app.module';
import { HttpClient } from '@angular/common/http';

import { TranslatePipeMock } from './translate-pipe.mock';

describe('ShoppingListPage', () => {
	let component: ShoppingListView;
	let fixture: ComponentFixture<ShoppingListView>;
	let store: MockStore;
	let actions$ = new Observable<Action>();
	let effects: ShoppingListEffects;
	let fakeTranslateService;

	const initialState: State = {
		isLoading: false,
		mode: Modes.EDIT_MODE,
		currentListIdx: 0,
		itemLibrary: null,
		itemGroups: null,
		shoppingLists: null,
		errors: null,
	};

	fakeTranslateService = jasmine.createSpyObj('TranslateService', {
		addLangs: null,
		setDefaultLang: 'en',
		getBrowserLang: 'en',
		use: null,
		get: of('dummy'),
	});

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ShoppingListView, TranslatePipeMock],
				imports: [
					IonicModule.forRoot(),
					IonicStorageModule.forRoot(),
					TranslateModule.forRoot({
						loader: {
							provide: TranslateLoader,
							useFactory: HttpLoaderFactory,
							deps: [HttpClient],
						},
					}),
				],
				providers: [
					provideMockStore({ initialState }),
					provideMockActions(() => actions$),
					{ provide: TranslateService, useValue: fakeTranslateService },

					ShoppingListEffects,
					IonicStorageModule,
				],
			}).compileComponents();

			store = TestBed.inject(MockStore);
			effects = TestBed.inject(ShoppingListEffects);
			fixture = TestBed.createComponent(ShoppingListView);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
