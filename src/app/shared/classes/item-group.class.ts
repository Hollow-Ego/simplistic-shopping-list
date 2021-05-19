import { LibraryItem } from '../models/library-item.model';

export class ItemGroup {
	constructor(public name: string, public groupMembers: string[]) {}

	add(itemID: string) {
		const newMembers = [...this.groupMembers, itemID];
		this.groupMembers = newMembers;
	}

	remove(itemID: string) {
		const newMembers = this.groupMembers.filter(el => el !== itemID);
		this.groupMembers = newMembers;
	}

	rename(newName: string) {
		this.name = newName;
	}
}
