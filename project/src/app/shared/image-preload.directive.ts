import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
	selector: 'ion-img[default]',
	host: {
		'(ionError)': 'updateUrl()',
	},
})
export class ImagePreloadDirective {
	@HostBinding('src')
	@Input()
	src: string;
	@Input() default: string;

	updateUrl() {
		this.src = this.default;
	}
}
