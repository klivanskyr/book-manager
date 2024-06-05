'use client';

import { useState, useEffect, ReactElement } from 'react'

import { Book } from "../Book"
import BookRow from './BookRow';
import Arrows from './Arrows';

export default function Shelf ({ books }: { books: Book[] }): ReactElement {
    const [isMobile, setIsMobile] = useState(false); //records if mobile view
    const [shelfIndex, setShelfIndex] = useState(0); //records which shelf is being viewed
    const [numBooksOnShelf, setNumBooksOnShelf] = useState(5); //records number of books on shelf
    const [numOfShelves, setNumOfShelves] = useState(1); //records number of shelves

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

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setNumOfShelves(Math.max(1, Math.ceil(books.length / numBooksOnShelf)));
        if (shelfIndex >= numOfShelves) {
            setShelfIndex(0);
        }
    }, [books.length, shelfIndex, numOfShelves]);
    
    // handle shelf incrementing and decrementing
    const handleClick = (increment: number): void => {
        setShelfIndex((numOfShelves + shelfIndex + increment) % numOfShelves);
    }

    return (
        <div className='w-1/2 lg:w-full h-auto scroll-smooth'>
            <BookRow books={books} shelfIndex={0} numBooksOnShelf={5} />
            <Arrows books={books} handleClick={handleClick} isMobile={isMobile} numBooksOnShelf={numBooksOnShelf} />
        </div>
    )
}