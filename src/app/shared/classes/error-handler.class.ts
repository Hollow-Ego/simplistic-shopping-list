import { ErrorHandler, Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
	constructor() {}

	handleError(error) {
		console.log('I am from global error handler');

		return throwError(error);
	}
}
