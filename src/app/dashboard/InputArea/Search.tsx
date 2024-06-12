'use client';

import React, { useState, ReactElement } from 'react';
import { AnimatePresence, motion } from "framer-motion";

import BookSelect from './BookSelect';
import Buttons from './Buttons';

export default function Search(): ReactElement {
    const [query, setQuery] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [errorVisable, setErrorVisable] = useState<boolean>(false);
    const [bookSelectVisable, setBookSelectVisable] = useState<boolean>(false);

    function handleError(message: string): void {
        if (message !== "") {
            setError(message);
            setErrorVisable(true);
            setQuery('');
            setTimeout(() => {
                setErrorVisable(false);
            }, 10000);
        }
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
        <div>
            <BookSelect active={bookSelectVisable} query={query} handleError={handleError} handleBookSelectClose={handleBookSelectClose} />
            <Buttons query={query} setQuery={setQuery} setBookSelectVisable={setBookSelectVisable} />
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