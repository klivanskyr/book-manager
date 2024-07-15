import { Timestamp } from 'firebase/firestore';
import { Book } from './Book';

export type Shelf = {
    shelfId: string,
    name: string,
    description: string,
    followers: number,
    isPublic: boolean,
    following?: boolean, //used when displaying shelves in explore
    image: string,
    createdById: string,
    createdByName: string,
    createdByImage: string,
    createdAt: Timestamp,
    books: Book[],
    shownBooks: Book[]
}