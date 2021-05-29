import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
	{
		path: 'home',
		component: TabsPage,
		children: [
			{
				path: 'lists',
				loadChildren: () =>
					import('../shopping-list/shopping-list.module').then(
						m => m.ShoppingListPageModule
					),
			},

			{
				path: 'library',
				loadChildren: () =>
					import('../item-library/item-library.module').then(
						m => m.ItemLibraryModule
					),
			},
		],
	},
	{
		path: '',
		redirectTo: '/home/lists',
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TabsPageRoutingModule {}
