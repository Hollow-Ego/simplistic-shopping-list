import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'home',
		loadChildren: () =>
			import('./components/shopping-list/shopping-list.module').then(
				m => m.ShoppingListPageModule
			),
	},
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			preloadingStrategy: PreloadAllModules,
			relativeLinkResolution: 'legacy',
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
