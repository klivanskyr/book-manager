import React, { ReactElement, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Oval } from 'react-loader-spinner';

import { BookCard, Book } from '../../Book'
import { Userinfo, updateBook, updateReview, deleteBook } from '../../Userinfo'

export default function BookRow({ user, shelfIndex, numBooksOnShelf }: { user: Userinfo, shelfIndex: number, numBooksOnShelf: number }): ReactElement {
    // Update star/rating amount
    async function handleRatingUpdate(book: Book, starIndex: number): Promise<void> {
        if (book.rating == starIndex + 1){
            book.rating = 0; //Clicking same star twice removes rating
        } else {
            book.rating = starIndex + 1;
        }
        await updateReview(book, user.user_id);
    };

    async function handleReviewUpdate(book: Book, newReview: string): Promise<void> {
        const newBook = {...book, review: newReview};
        await updateReview(newBook, user.user_id);
    }

    //Clear Books handler
    async function handleRemoveBook(book: Book): Promise<void> {
        await deleteBook(book.id, user.user_id);
    }

    //handle Background color loading from color thief
    function handleBgLoaded(book: Book, color: number[]): void {
        const updatedBook = {...book, bgColor: color, bgLoaded: true};
        updateBook(user, updatedBook);
    }

    //Prevents hydration error
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, [])
    if (!isMounted) return <div></div>;

    return (
        <div id='shelf' className='flex flex-col justify-center items-center w-full h-full lg:flex-row lg:justify-start'>
            {user.books.slice(0 + shelfIndex*numBooksOnShelf, numBooksOnShelf + shelfIndex*numBooksOnShelf).map((book: Book) => (
                <motion.div
                    key={book.id}
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