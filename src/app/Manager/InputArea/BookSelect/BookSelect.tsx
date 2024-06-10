'use client';

import React, { useState, useEffect, useContext, ReactElement } from 'react'
import { NextResponse } from 'next/server';
import { FaTimes } from 'react-icons/fa'
import Modal from 'react-modal'

import { UserContext, UserContextType, createBook, deleteBook } from '@/app/UserContext';
import BookSelectGrid from './BookSelectGrid';
import { queryOpenLibrary } from '@/app/utils/openlibrary';
import { Book } from '@/app/Book';
import { fetchDominantColor } from '@/app/utils/color';

export default function BookSelect({ active, query, handleError, handleBookSelectClose }: 
    { active: boolean, query: string, handleError: Function, handleBookSelectClose: Function }): ReactElement {
    const { user, setUser } = useContext<UserContextType>(UserContext);
    const [foundBooks, setFoundBooks] = useState<Book[]>([]);

    useEffect(() => {
        const getNewBooks = async (query: string): Promise<Book[] | undefined> => {
            const res: NextResponse = await queryOpenLibrary(query);
            const data = await res.json();
            if (data.code !== 200){
                handleError(data.message);
                handleBookSelectClose();
                return;
            }

            /* 
                Loops through books pulled from API
                for every pulled book, loop through currentBooks and see if
                there is a match. If so replace the pulled book with the
                current book so the reviews and rating is preserved
            */
            const books: Book[] = data.books.map((book: Book) => {
                    const currentBook = user?.books.find(curBook => curBook.key == book.key);
                    return currentBook ? currentBook : book;
            });
            setFoundBooks(books);
        }

        if (query !== '') { getNewBooks(query); }
    }, [active])

    //handle selecting book from modal
    async function handleClickAdd(i: number): Promise<void> {
        const [r, g, b] = await fetchDominantColor(foundBooks[i].coverImage);
        const updatedBook = { ...foundBooks[i], selected: true, r: r, g: g, b: b};
        setFoundBooks(foundBooks.map((book, index) => index === i ? updatedBook : book));
        if (user) { await createBook(updatedBook, user); } //IF STATEMENT ON USER
    }

    //handle removing book from modal
    async function handleClickRemove(i: number): Promise<void> {
        const updatedBook = { ...foundBooks[i], selected: false };
        console.log('foundbook at i is: ', foundBooks[i])
        setFoundBooks(foundBooks.map((book, index) => index === i ? updatedBook : book));
        if (user) { await deleteBook(foundBooks[i].id, user.user_id); } //IF STATEMENT ON USER
    }

    //Removes page scorll when modal active
    useEffect(() => {
        if (active) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [active]);
    
    return (
        //Right now the modal wont show up if there is no user.
        <>
            {!user ? null : (
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
            )}
        </>
    )
}