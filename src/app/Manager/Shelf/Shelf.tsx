import React, { useState, useEffect, ReactElement } from 'react'
import { motion } from "framer-motion"
import { Oval } from 'react-loader-spinner';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Button } from "antd";
import { Link } from 'react-scroll';

import { BookCard, Book } from "./Book"

export const Shelf = ({ books, handleBgLoaded, handleRemoveBook, triggerLoading, booksToLocalStorage }: { books: Book[], handleBgLoaded: Function, handleRemoveBook: Function, triggerLoading: Function, booksToLocalStorage: Function }): ReactElement => {
    const [shelfIndex, setShelfIndex] = useState(0);
    const [numBooksOnShelf, setNumBooksOnShelf] = useState(5);
    const [isMobile, setIsMobile] = useState(false);

    /*
        When window is shrunk, dynamically change the number of books on shelf
        x-pxs < 1023 (MOBILE) 8 books and goes into large column
        x-pxs < 1225 3 books
        x-pxs < 1450 4 books
        else 5 books
        ***Might want to make it a constant for every 250pxls add a book for
        ***very wide screens
    */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1023) {
                setNumBooksOnShelf(8);
                setIsMobile(true);
            } else if (window.innerWidth < 1050) {
                setNumBooksOnShelf(3);
                setIsMobile(false);
            } else if (window.innerWidth < 1680) {
                setNumBooksOnShelf(4);
                setIsMobile(false);
            } else {
                setNumBooksOnShelf(5);
                setIsMobile(false);
            }
        }

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const numOfShelves =  Math.max(1, Math.ceil(books.length / numBooksOnShelf));
    if (shelfIndex >= numOfShelves) {
        setShelfIndex(0);
    }

    //Update star/rating amount
    const handleRatingUpdate = (book: Book, starIndex: number): void => {
        if (book.rating == starIndex + 1){
            book.rating = 0; //Clicking same star twice removes rating
        } else {
            book.rating = starIndex + 1;
        }
        booksToLocalStorage(books.map((b) => (b.key === book.key ? book : b)));
        triggerLoading();
    };

    const handleReviewUpdate = (book: Book, newReview: string): void => {
        const newBook = {...book, review: newReview};
        booksToLocalStorage(books.map((b) => (b.key == newBook.key ? newBook : b)));
    }

    //handle shelf incrementing and decrementing
    const handleClick = (increment: number): void => {
        setShelfIndex((numOfShelves + shelfIndex + increment) % numOfShelves);
    }

    return (
        <div className='w-1/2 lg:w-full h-auto scroll-smooth'>
            <div id='shelf' className='flex flex-col justify-center items-center w-full h-full lg:flex-row lg:justify-start'>
                {books.slice(0 + shelfIndex*numBooksOnShelf, numBooksOnShelf + shelfIndex*numBooksOnShelf).map((book, i) => 
                <motion.div
                    key={book.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.25 }}
                    className='flex-none w-full 1023:w-1/3 1150:w-1/4 1670:w-1/5 h-auto'
                >
                    <BookCard book={book} booksIndex={i + shelfIndex * numBooksOnShelf} handleRemoveBook={handleRemoveBook} handleRatingUpdate={handleRatingUpdate} handleBgLoaded={handleBgLoaded} handleReviewUpdate={handleReviewUpdate} />
                    {!book.bgLoaded && (
                        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                            <Oval color='#abd9f5' secondaryColor='#79d2ed'/>
                        </div>
                    )}
                </motion.div>)}
            </div>
            {(books.length > numBooksOnShelf) && (
            isMobile ? (
                <div className='flex flex-row justify-center'>
                    <Link to='shelf' offset={-75} >
                        <Button className='m-2' type="primary" shape='circle' icon={<FaChevronLeft />} onClick={() => (handleClick(1))}/>
                        <Button className='m-2' type="primary" shape='circle' icon={<FaChevronRight />} onClick={() => (handleClick(-1))}/>
                    </Link>
                </div> 
            ) : (
                <div className='flex flex-row justify-center'>
                    <Button className='m-2' type="primary" shape='circle' icon={<FaChevronLeft />} onClick={() => (handleClick(1))}/>
                    <Button className='m-2' type="primary" shape='circle' icon={<FaChevronRight />} onClick={() => (handleClick(-1))}/>
                </div> 
            )
        )}
        </div>
    )
}