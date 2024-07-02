import { Book } from './Book';

export type Shelf = {
    shelfId: string,
    name: string,
    description: string,
    isPublic: boolean,
    createdBy: string,
    books: Book[]
    shownBooks: Book[]
}