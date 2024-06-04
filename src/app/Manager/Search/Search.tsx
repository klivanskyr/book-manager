'use client';

import React, { useState, ReactElement, ChangeEvent, MouseEvent } from 'react';
import { AnimatePresence, motion } from "framer-motion"

import { Book } from "../Book"
import BookSelect from './BookSelect';

function InputArea({ query, buttonPressed, error, errorVisable, handleSubmit, handleQueryChange, handleMouseUp }: 
    { 
        query: string, error: string, errorVisable: boolean, buttonPressed: boolean,
        handleMouseUp: (event: MouseEvent<HTMLButtonElement>) => void
        handleSubmit: (event: MouseEvent<HTMLButtonElement>) => void
        handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void
    }): ReactElement {
    return (
        <div className='flex flex-col justify-start items-center h-1/5 w-auto lg:m-5 lg:h-[250px] lg:w-[400px] lg:flex-shrink-0'>
            <p className='p-2 w-5/6 lg:w-3/4 text-center font-Urbanist font-semibold text-[1.5rem]  '>
                Input into the search bar a books ISBN to add it to your list of books.
            </p>
            <div className='flex flex-row justify-start w-full h-1/5 p-2 min-h-16'>
                <input className='border border-gray-300 hover:border-gray-500 focus:ring-blue-500 focus:hover:ring-blue-500 focus:hover:outline-none rounded-md focus:outline-none focus:ring-2 resize-none overflow-auto p-1 m-0.5 w-3/4 ' 
                type="text" value={query} onChange={handleQueryChange} placeholder="Input ISBN" />
                <button className={`border border-gray-300 hover:border-gray-500 rounded w-1/4 p-1 m-0.5 font-medium ${buttonPressed ? 'transform translate-y-px shadow-lg' : 'shadow-md'} transition duration-100`}
                onMouseDown={handleSubmit} onMouseUp={handleMouseUp}>Search</button>
            </div>
            <AnimatePresence>
                {errorVisable && (
                <motion.div
                    key={error}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className='p-2 font-semibold text-red-900 text-xs'
                >
                    {error}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    )
}

export default function Search({ books }: { books: Book[] }): ReactElement {
    const [error, setError] = useState<string>("");
    const [errorVisable, setErrorVisable] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [buttonPressed, setButtonPressed] = useState<boolean>(false);
    const [bookSelectVisable, setBookSelectVisable] = useState<boolean>(false);

    function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setQuery(e.target.value);
    }

    function handleError(message: string): void {
        if (message !== "") {
            console.log('error:', error, 'visable?: ', errorVisable);
            setError(message);
            setErrorVisable(true);
            setQuery('');
            setTimeout(() => {
                setErrorVisable(false);
            }, 10000);
        }
    }

    function handleSubmit(): void {
        console.log('bookselectvisable is now', bookSelectVisable);
        setButtonPressed(true);
        setBookSelectVisable(true);
    }

    function handleMouseUp(): void {
        setButtonPressed(false);
    }

    //Handler for selecting book from modal/BookSelect
    function handleBookSelectClose(): void {
        setBookSelectVisable(false);
        setQuery('');
    }

    //Takes in a single character and checks if it is a number
    // const isCharNumber = (char: string): boolean => {
    //     return (char.length === 1 && char >= '0' && char <= '9');
    // }
    
    // /* 
    //     ISBN verification
    //     isbn-10 and isbn-13 use unique checksum algorithms to authenticate isbn codes
    // */
    // const validISBN = (isbn: string): boolean => {
    //     if (typeof isbn !== 'string') { return false; }
    //     if (isbn.length == 10) {
    //         let sum: number = 0;
    //         for (let i = 0; i < isbn.length - 1; i++) {
    //             if (!isCharNumber(isbn[i])) {
    //                 handleError("here1, Error: ISBN-10 should contain only digits (may contain hypens, last character may be 'X').");
    //                 return false; 
    //             }
    //             sum += (Number(isbn[i])*(10-i));
    //         }
    //         if (!isCharNumber(isbn[isbn.length - 1]) && isbn[isbn.length - 1] !== 'X'){
    //             handleError("here2, Error: ISBN-10 should contain only digits (may contain hypens, last character may be 'X').");
    //             return false; 
    //         }
    //         if (isbn[isbn.length - 1] == 'X') { return 10 != 11 - (sum % 11); } 
    //         return Number(isbn[isbn.length - 1]) != 11 - (sum % 11);

    //     } else if (isbn.length == 13) {
    //         let sum: number = 0;
    //         for (let i = 0; i < isbn.length - 1; i++ ) {
    //             if (!isCharNumber(isbn[i])){
    //                 handleError("Error: ISBN-13 should contain only digits (may contain hypens).");
    //                 return false; 
    //             }

    //             if ((i + 1) % 2 == 0){
    //                 sum += Number(isbn[i])*3;
    //             } else {
    //                 sum += Number(isbn[i]);
    //             }
    //         }
    //         if (!isCharNumber(isbn[isbn.length - 1])) { 
    //             handleError("Error: ISBN-13 should contain only digits (may contain hypens).");
    //             return false; 
    //         }
    //         return Number(isbn[isbn.length - 1]) == 10 - (sum % 10);

    //     } else {
    //         handleError("Error: Incorrect ISBN length. Length should be 10 or 13 digits.");
    //         return false;
    //     }
    // }

    //Loads a list of books into local storage overwriting any previous books

    return (
    <>  
        <BookSelect active={bookSelectVisable} query={query} books={books} handleError={handleError} handleBookSelectClose={handleBookSelectClose} />
        <InputArea buttonPressed={buttonPressed} error={error} errorVisable={errorVisable} handleMouseUp={handleMouseUp} handleQueryChange={handleQueryChange} handleSubmit={handleSubmit} query={query} />
    </>
    )
}