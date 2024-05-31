import React, { useState, useEffect, ReactElement } from 'react'
import { motion } from "framer-motion"
import { Oval } from 'react-loader-spinner';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Button } from "antd";

import { BookCard, Book } from "./Book"

export const Shelf = ({ books, handleBgLoaded, handleRemoveBook, triggerLoading }: { books: Book[], handleBgLoaded: Function, handleRemoveBook: Function, triggerLoading: Function }): ReactElement => {
    const [shelfIndex, setShelfIndex] = useState(0);
    const [numBooksOnShelf, setNumBooksOnShelf] = useState(5);

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
            } else if (window.innerWidth < 1225) {
                setNumBooksOnShelf(3);
            } else if (window.innerWidth < 1450) {
                setNumBooksOnShelf(4);
            } else {
                setNumBooksOnShelf(5);
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
    const handleRatingUpdate = (book: Book, i: number): void => {
        if (book.rating == i + 1){
            book.rating = 0; //Clicking same star twice removes rating
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
        <div className='lg:w-full'>
            <div className='flex flex-col justify-center items-center w-full h-full lg:flex-row lg:justify-start'>
                {books.slice(0 + shelfIndex*numBooksOnShelf, numBooksOnShelf + shelfIndex*numBooksOnShelf).map((book, i) => 
                <motion.div
                    key={book.isbn}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.25 }}
                    className='flex-none lg:flex-[0_1_20%] lg:flex w-full h-full'
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
                <Button className='m-2' type="primary" shape='circle' icon={<FaChevronLeft />} onClick={() => (handleClick(1))}/>
                <Button className='m-2' type="primary" shape='circle' icon={<FaChevronRight />} onClick={() => (handleClick(-1))}/>
            </div> 
            )}
        </div>
    )
}