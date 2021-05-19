import { Image } from './image.model';

export interface PopulatedItem {
	itemID: string;
	name: string;
	imgData?: Image;
	tags?: string[];
	unit?: string;
	amount?: string;
}
