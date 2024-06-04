'use client';

import React, { useState, useEffect, ReactElement } from 'react'
import { FaTimes } from 'react-icons/fa'
import Modal from 'react-modal'

import { coverPlaceholder } from '@/assets';
import { Book } from '../../Book';
import { booksToLocalStorage } from '../../Manager';
import BookSelectGrid from './BookSelectGrid';

export default function BookSelect({ active, query, books, handleError, handleBookSelectClose }:
     { active: boolean, query: string, books: Book[], handleError: Function, handleBookSelectClose: Function }): ReactElement {

    const [foundBooks, setFoundBooks] = useState<Book[]>([]);

    //Book Search API REQUEST
    const baseBookUrl = 'http://openlibrary.org/search.json?isbn=';
    const baseCoverUrl = 'https://covers.openlibrary.org/b/olid/';

    //API call to get books to display to pick from
    async function getBooks(query: string): Promise<Book | undefined> {
        if (query === '') { return undefined; }
        const query_hypenless = query.replaceAll('-', '');
        try {
            const res = await fetch(`${baseBookUrl}${query_hypenless}`);
            const data = await res.json();
            if (data.docs.length == 0){
                handleError(`No books found with ISBN ${query}.`);
                handleBookSelectClose();
                return undefined;
            }
            let books: Book[] = data.docs
            .filter((entry: any) => entry.title && entry.author_name && entry.author_name[0]) //Filter out undefined entires then map to book datatype
            .map((entry: any) => ({
                key: entry.key,
                title: entry.title,
                author: entry.author_name[0],
                review: '',
                rating: 0,
                isbn: query_hypenless,
                coverImage: entry.cover_edition_key ? `${baseCoverUrl}${entry.cover_edition_key}-M.jpg?default=false` : coverPlaceholder.src,
                bgColor: [127, 127, 127], //default
                selected: false,
                bgLoaded: false,
                imgLoaded: false
            }));
            
            /* 
                Loops through books pulled from API
                for every pulled book, loop through currentBooks and see if
                there is a match. If so replace the pulled book with the
                current book so the reviews and rating is preserved
            */
            books = books.map((book) => {
                const currentBook = books.find(curBook => curBook.key == book.key);
                return currentBook ? currentBook : book;
            })
            setFoundBooks(books);

        } catch (error) {
            return undefined;
        }
    }

    //handle selecting book from modal
    function handleClickAdd(i: number): void {
        const updatedBook = { ...foundBooks[i], selected: true };
        setFoundBooks(foundBooks.map((book, index) => index === i ? updatedBook : book));
        booksToLocalStorage([...books, updatedBook]);
}

    //handle removing book from modal
    const handleClickRemove = (i: number) => {
        const updatedBook = { ...foundBooks[i], selected: false };
        setFoundBooks(foundBooks.map((book, index) => index === i ? updatedBook : book));
        const updatedCurrentBooks = books.filter((book) => (book.key !== updatedBook.key));
        booksToLocalStorage(updatedCurrentBooks);
    }

    //Removes page scorll when modal active
    useEffect(() => {
        if (active) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [active]);

    //Run getBooks on init
    useEffect(() => {
        setFoundBooks([]);
        getBooks(query);
    }, [active])
    
    return (
        <Modal
            isOpen={active}
            ariaHideApp={false}
            onRequestClose={() => handleBookSelectClose()}
            className="flex items-center justify-center h-3/4 outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <div className="flex bg-white border p-6 rounded-lg shadow-lg w-full h-full overflow-y-scroll">
                <FaTimes onClick={() => handleBookSelectClose()} />
                <BookSelectGrid 
                    foundBooks={foundBooks}
                    handleClickAdd={handleClickAdd} 
                    handleClickRemove={handleClickRemove} 
                />
            </div>
        </Modal>
    )
}