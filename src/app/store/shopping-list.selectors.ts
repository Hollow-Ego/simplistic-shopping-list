import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../shared/models/state.model';

export const getState = createFeatureSelector<State>('shoppingList');

export const selectItemLibrary = createSelector(getState, (state: State) => {
	return state.itemLibrary;
});

export const selectShoppingLists = createSelector(getState, (state: State) => {
	return state.shoppingLists;
});

export const selectShoppingList = (index: number) =>
	createSelector(getState, (state: State) => {
		return state.shoppingLists[index];
	});

export const selectItemGroups = createSelector(getState, (state: State) => {
	return state.itemGroups;
});
