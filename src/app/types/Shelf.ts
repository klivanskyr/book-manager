import { Book } from './Book';

export type Shelf = {
    shelfId: string,
    name: string,
    description: string,
    isPublic: boolean,
    createdById: string,
    createdByName: string,
    createdByImage: string,
    books: Book[]
    shownBooks: Book[]
}