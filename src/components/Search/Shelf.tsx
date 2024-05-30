import React, { useState, useEffect, ReactElement } from 'react'
import { BookCard, Book } from "./Book"
import { motion } from "framer-motion"
import { Oval } from 'react-loader-spinner';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const Shelf = ({ books, handleBgLoaded, handleRemoveBook, triggerLoading }: { books: Book[], handleBgLoaded: Function, handleRemoveBook: Function, triggerLoading: Function }): ReactElement => {
    const [shelfIndex, setShelfIndex] = useState(0);
    const [numBooksOnShelf, setNumBooksOnShelf] = useState(5);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1023) {
                setNumBooksOnShelf(8);
            } else if (window.innerWidth < 1450) {
                setNumBooksOnShelf(4);
            } else {
                setNumBooksOnShelf(5);
            }
        }

        window.addEventListener('resize', handleResize);
        handleResize(); // call the function initially to set the state based on initial window size
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const numOfShelves =  Math.max(1, Math.ceil(books.length / numBooksOnShelf));
    if (shelfIndex >= numOfShelves) {
        setShelfIndex(0);
    }

    //Update star/rating amount
    const handleRatingUpdate = (book: Book, i: number): void => {
        if (book.rating == i + 1){
            book.rating = 0;
        } else {
            book.rating = i + 1;
        }
        localStorage.setItem(`${book.isbn}`, JSON.stringify(book));
        triggerLoading();
    }

    //handle shelf incrementing and decrementing
    const handleClick = (increment: number): void => {
        setShelfIndex((numOfShelves + shelfIndex + increment) % numOfShelves);
    }

    return (
        <div>
            <div className='flex flex-col justify-center items-center w-full h-full lg:flex-row lg:justify-start '>
                {books.slice(0 + shelfIndex*numBooksOnShelf, numBooksOnShelf + shelfIndex*numBooksOnShelf).map((book, i) => 
                <motion.div
                    key={book.isbn}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.25 }}
                    className='flex-none lg:flex-1 lg:flex w-full h-full'
                >
                    <BookCard book={book} handleRemoveBook={handleRemoveBook} handleRatingUpdate={handleRatingUpdate} handleBgLoaded={handleBgLoaded} i={i + shelfIndex * numBooksOnShelf} />
                    {!book.bgLoaded && (
                        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                            <Oval color='#abd9f5' secondaryColor='#79d2ed'/>
                        </div>
                    )}
                </motion.div>)}
            </div>
            {(books.length > numBooksOnShelf) && (
            <div className='flex flex-row justify-center'>
                <FaChevronLeft className='m-2' onClick={() => (handleClick(1))} />
                <FaChevronRight className='m-2' onClick={() => (handleClick(-1))} />
            </div> 
            )}
        </div>
    )
}