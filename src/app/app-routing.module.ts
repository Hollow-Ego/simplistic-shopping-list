import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsPage } from './pages/tabs/tabs.page';

const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
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
