export type Book = {
    id: number,
    key: string,
    title: string,
    author: string,
    review: string,
    rating: number
    isbn: string,
    coverImage: string,
    bgColor: number[],
    imgLoaded: boolean,
    selected: boolean,
};