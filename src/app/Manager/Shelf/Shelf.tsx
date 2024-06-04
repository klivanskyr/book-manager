'use client';

import { useState, useEffect, ReactElement } from 'react'
import { motion } from "framer-motion"
import { Oval } from 'react-loader-spinner';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Button } from "antd";
import { Link } from 'react-scroll';

import BookCard, { Book } from "../Book/Book"
import { booksToLocalStorage } from '../Manager';

function Arrows({ books, isMobile, numBooksOnShelf, handleClick }: { books: Book[], isMobile: boolean, numBooksOnShelf: number, handleClick: Function }): ReactElement {
    //if there are less books than the number of books on the shelf, don't show arrows
    if (books.length < numBooksOnShelf) {return (<></>)}

    //If mobile, include Link to bring to top of shelf
    if (isMobile) {
        return (
            <div className='flex flex-row justify-center'>
                <Link to='shelf' offset={-75} >
                    <Button className='m-2' type="primary" shape='circle' icon={<FaChevronLeft />} onClick={() => (handleClick(1))}/>
                    <Button className='m-2' type="primary" shape='circle' icon={<FaChevronRight />} onClick={() => (handleClick(-1))}/>
                </Link>
            </div> 
        )
    } else {
        return (
            <div className='flex flex-row justify-center'>
                <Button className='m-2' type="primary" shape='circle' icon={<FaChevronLeft />} onClick={() => (handleClick(1))}/>
                <Button className='m-2' type="primary" shape='circle' icon={<FaChevronRight />} onClick={() => (handleClick(-1))}/>
            </div>
        ) 
    }
}

function BookRow({ books, shelfIndex, numBooksOnShelf }: { books: Book[], shelfIndex: number, numBooksOnShelf: number }): ReactElement {
    //Update star/rating amount
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

export default function Shelf ({ books }: { books: Book[] }): ReactElement {
    const [isMobile, setIsMobile] = useState(false); //records if mobile view
    const [shelfIndex, setShelfIndex] = useState(0); //records which shelf is being viewed
    const [numBooksOnShelf, setNumBooksOnShelf] = useState(5); //records number of books on shelf
    const numOfShelves =  Math.max(1, Math.ceil(books.length / numBooksOnShelf));
    if (shelfIndex >= numOfShelves) { 
        setShelfIndex(0);
    }

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

    //handle shelf incrementing and decrementing
    const handleClick = (increment: number): void => {
        setShelfIndex((numOfShelves + shelfIndex + increment) % numOfShelves);
    }

    return (
        <div className='w-1/2 lg:w-full h-auto scroll-smooth'>
            <BookRow books={books} shelfIndex={shelfIndex} numBooksOnShelf={numBooksOnShelf} />
            <Arrows books={books} handleClick={handleClick} isMobile={isMobile} numBooksOnShelf={numBooksOnShelf} />
        </div>
    )
}