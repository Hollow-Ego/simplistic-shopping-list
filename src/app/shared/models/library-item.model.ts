import { Image } from './image.model';

export interface LibraryItem {
	itemID: string;
	name: string;
	imgData?: Image;
	tags?: string[];
	unit?: string;
}
