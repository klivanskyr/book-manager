export type Book = {
    id: string,
    key: string,
    title: string,
    author: string,
    review: string,
    rating: number
    isbn: string,
    coverImage: string,
    bgColor: {r: number, g: number, b: number},
    imgLoaded: boolean,
    selected: boolean,
};