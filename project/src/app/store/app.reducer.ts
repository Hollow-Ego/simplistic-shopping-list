import { ActionReducerMap } from '@ngrx/store';
import { State } from '../shared/models/state.model';
import { reducer } from './shopping-list.reducers';

export interface AppState {
	shoppingList: State;
}

export const appReducer: ActionReducerMap<AppState> = {
	shoppingList: reducer,
};
