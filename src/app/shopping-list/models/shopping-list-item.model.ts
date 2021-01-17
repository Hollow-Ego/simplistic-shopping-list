import { Image } from './image.model';

export class ShoppingListItem {
  constructor(
    // public id: string,
    public name?: string,
    public amount?: string,
    public imgData?: Image
  ) {}
}
