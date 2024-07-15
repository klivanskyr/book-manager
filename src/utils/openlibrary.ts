import { NextResponse } from 'next/server';

import { Book } from '../types/Book';
import { coverPlaceholder } from '@/assets';

//Book Search API REQUEST
const baseBookUrl = 'https://openlibrary.org/search.json?q=';
const params = '&fields=title+author_name+isbn+cover_edition_key+key';
const baseCoverUrl = 'https://covers.openlibrary.org/b/olid/';

//API call to get books to display to pick from
export async function queryOpenLibrary(query: string): Promise<NextResponse> {
    if (query === '') { 
        return NextResponse.json({ code: 400, message: "Empty query" });
    }
    const query_with_pluses = query.replace(/ /g, '+');
    try {
        const fetchUrl = `${baseBookUrl}${query_with_pluses}${params}`;
        const res = await fetch(fetchUrl);
        const data = await res.json();
        if (data.docs.length == 0){
            return NextResponse.json({ code: 400, message: `No books found with ${query}.` });
        }
        const books: Book[] = data.docs
        .filter((entry: any) => entry.title && entry.author_name && entry.author_name[0]) //filter out null entries
        .map((entry: any) => ({
            id: null,
            key: entry.key,
            title: entry.title,
            author: entry.author_name?.[0] ?? 'Unknown Author',
            review: '',
            rating: 0,
            isbn: entry.isbn?.[0] ?? 'Unknown ISBN',
            coverUrl: entry.cover_edition_key ? `${baseCoverUrl}${entry.cover_edition_key}-L.jpg?default=false` : coverPlaceholder.src,
            bgColor: [127, 127, 127], //default
            selected: false,
            bgLoaded: false,
            imgLoaded: false
        }));

        return NextResponse.json({ code: 200, books });

    } catch (error) {
        return NextResponse.json({ code: 500, message: `${error}` });
    }
}