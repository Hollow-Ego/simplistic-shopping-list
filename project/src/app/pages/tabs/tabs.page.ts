import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as SLActions from '../../store/shopping-list.actions';
import * as Modes from '../../shared/constants';

@Component({
	selector: 'pxsl1-tabs',
	templateUrl: './tabs.page.html',
	styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
	constructor(private store: Store<fromApp.AppState>) {}

	ngOnInit() {
		this.store.dispatch(SLActions.startInitialLoad({ mode: Modes.EDIT_MODE }));
	}
}
