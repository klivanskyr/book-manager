'use client';

import react, { useState, useEffect, ReactElement } from 'react';
import { AnimatePresence, motion } from "framer-motion"

import { Book } from "./Book"
import { Shelf } from './Shelf'
import BookSelect from './BookSelect';

const Search = (): ReactElement => {
    
    const [error, setError] = useState<string>("");
    const [errorVisable, setErrorVisable] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [buttonPressed, setButtonPressed] = useState<boolean>(false);
    const [triggerLoad, setTriggerLoad] = useState<boolean>(false);
    const [books, setBooks] = useState<Book[]>([]);
    const [bookSelectVisable, setBookSelectVisable] = useState<boolean>(false);

    //Error handling
    const handleError = (message: string): void => {
        if (message !== "") {
            console.log('error:', error, 'visable?: ', errorVisable);
            setError(message);
            setErrorVisable(true);
            setQuery('');
            setTimeout(() => {
                setErrorVisable(false);
            }, 10000);
        }
    };

    //Search bar handler
    const handleQuery = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setQuery(e.target.value);
    };

    //Submit button handler
    const handleSubmit = (): void => {
        setButtonPressed(true);
        setBookSelectVisable(true);
    };

    //Handler for selecting book from modal/BookSelect
    const handleBookSelectClose = (): void => {
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
    function booksToLocalStorage(books: Book[]): void {
        console.log('storing', books);
        const serializedBooks = JSON.stringify(books);
        localStorage.setItem('books', serializedBooks);
        triggerLoading();
    }

    //Load all books from local storage
    const loadBooks = (): void => {
        setBooks(localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')!) : []);
    };

    //handle Background color loading from color thief
    const handleBgLoaded = (loadedBook: Book, index: Number): void => {
        setBooks(books.map((book, i) => i === index ? loadedBook : book));
    }

    //Clear Books handler
    const handleRemoveBook = (book: Book): void => {
        booksToLocalStorage(books.filter(b => b !== book));
        triggerLoading();
    }

    const triggerLoading = (): void => {
        setTriggerLoad(!triggerLoad);
    }

    // Load books
    useEffect(() => {
        loadBooks();
    }, [triggerLoad]);

    return (
    <>  

        <BookSelect active={bookSelectVisable} query={query} currentBooks={books} handleError={handleError} booksToLocalStorage={booksToLocalStorage} handleBookSelectClose={handleBookSelectClose}  />
        <div className='flex flex-col lg:justify-start justify-center items-center h-full m-2'>
            <div className='flex flex-col justify-start items-center h-1/5 w-auto lg:m-5 lg:h-[250px] lg:w-[400px] lg:flex-shrink-0'>
                <p className='p-2 w-5/6 lg:w-3/4 text-center font-Urbanist font-semibold text-[1.5rem]  '>
                    Input into the search bar a books ISBN to add it to your list of books.
                </p>
                <div className='flex flex-row justify-start w-full h-1/5 p-2 min-h-16'>
                    <input className='border border-gray-300 hover:border-gray-500 focus:ring-blue-500 focus:hover:ring-blue-500 focus:hover:outline-none rounded-md focus:outline-none focus:ring-2 resize-none overflow-auto p-1 m-0.5 w-3/4 ' 
                    type="text" value={query} onChange={handleQuery} placeholder="Input ISBN" />
                    <button className={`border border-gray-300 hover:border-gray-500 rounded w-1/4 p-1 m-0.5 font-medium ${buttonPressed ? 'transform translate-y-px shadow-lg' : 'shadow-md'} transition duration-100`}
                    onMouseDown={handleSubmit} onMouseUp={() => setButtonPressed(false)}>Search</button>
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
            <Shelf books={books} handleBgLoaded={handleBgLoaded} handleRemoveBook={handleRemoveBook} triggerLoading={triggerLoading} booksToLocalStorage={booksToLocalStorage} />
        </div>
    </>
    )
}

export default Search;