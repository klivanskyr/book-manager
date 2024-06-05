import React, { ReactElement, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Oval } from 'react-loader-spinner';

import { BookCard, Book } from '../../Book'
import { booksToLocalStorage } from '../../Manager'

export default function BookRow({ books, shelfIndex, numBooksOnShelf }: { books: Book[], shelfIndex: number, numBooksOnShelf: number }): ReactElement {
    // Update star/rating amount
    function handleRatingUpdate(book: Book, starIndex: number): void {
        if (book.rating == starIndex + 1){
            book.rating = 0; //Clicking same star twice removes rating
        } else {
            book.rating = starIndex + 1;
        }
        booksToLocalStorage(books.map((b) => (b.key === book.key ? book : b)));
    };

    function handleReviewUpdate(book: Book, newReview: string): void {
        const newBook = {...book, review: newReview};
        booksToLocalStorage(books.map((b) => (b.key == newBook.key ? newBook : b)));
    }

    //Clear Books handler
    function handleRemoveBook(book: Book): void {
        booksToLocalStorage(books.filter(b => b.key !== book.key));
    }

    //handle Background color loading from color thief
    function handleBgLoaded(book: Book, color: number[]): void {
        const updatedBook = {...book, bgColor: color, bgLoaded: true};
        booksToLocalStorage(books.map((book) => book.key == updatedBook.key ? updatedBook : book));
    }

    //Prevents hydration error
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, [])
    if (!isMounted) return <div></div>;

    return (
        <div id='shelf' className='flex flex-col justify-center items-center w-full h-full lg:flex-row lg:justify-start'>
            {books.slice(0 + shelfIndex*numBooksOnShelf, numBooksOnShelf + shelfIndex*numBooksOnShelf).map((book: Book, i: number) => (
                <motion.div
                    key={book.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.25 }}
                    className='flex-none w-full 1023:w-1/3 1150:w-1/4 1670:w-1/5 h-auto'
                >
                    {!book.bgLoaded && (
                        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                            <Oval color='#abd9f5' secondaryColor='#79d2ed'/>
                        </div>
                    )}
                    <BookCard book={book} handleRemoveBook={handleRemoveBook} handleReviewUpdate={handleReviewUpdate} handleRatingUpdate={handleRatingUpdate} handleBgLoaded={handleBgLoaded} />
                </motion.div>
            ))}
        </div>
    )
}