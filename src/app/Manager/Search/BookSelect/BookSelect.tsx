'use client';

import React, { useState, useEffect, ReactElement } from 'react'
import { FaTimes } from 'react-icons/fa'
import Modal from 'react-modal'

import { coverPlaceholder } from '@/assets';
import { Book } from '../../Book';
import { Userinfo, createBook, deleteBook } from '../../Userinfo';
import BookSelectGrid from './BookSelectGrid';

export default function BookSelect({ active, query, user, handleError, handleBookSelectClose }: 
    { active: boolean, query: string, user: Userinfo, handleError: Function, handleBookSelectClose: Function }): ReactElement {

    const [foundBooks, setFoundBooks] = useState<Book[]>([]);

    //Book Search API REQUEST
    const baseBookUrl = 'http://openlibrary.org/search.json?isbn=';
    const baseCoverUrl = 'https://covers.openlibrary.org/b/olid/';

    //API call to get books to display to pick from
    async function getNewBooks(query: string): Promise<Book | undefined> {
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
            .filter((entry: any) => entry.title && entry.author_name && entry.author_name[0]) 
            .map((entry: any) => ({
                id: null,
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
    async function handleClickAdd(i: number): Promise<void> {
        const updatedBook = { ...foundBooks[i], selected: true };
        setFoundBooks(foundBooks.map((book, index) => index === i ? updatedBook : book));
        await createBook(updatedBook, user);
    }

    //handle removing book from modal
    async function handleClickRemove(i: number): Promise<void> {
        const updatedBook = { ...foundBooks[i], selected: false };
        console.log('foundbook at i is: ', foundBooks[i])
        setFoundBooks(foundBooks.map((book, index) => index === i ? updatedBook : book));
        await deleteBook(foundBooks[i].id, user.user_id);
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
        getNewBooks(query);
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