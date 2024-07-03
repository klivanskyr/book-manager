export type Book = {
    bookId: string,
    key: string,
    title: string,
    author: string,
    review: string,
    rating: number
    isbn: string,
    coverUrl: string,
    bgColor: {r: number, g: number, b: number},
    imgLoaded: boolean,
    selected: boolean,
};