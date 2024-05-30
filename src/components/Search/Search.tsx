'use client';

import react, { useState, useEffect, ReactElement, useRef } from 'react';
import { Oval } from 'react-loader-spinner';
import axios from 'axios';
import { AnimatePresence, motion } from "framer-motion"

import { BookCard, Book } from "./Book"

const Search = (): ReactElement => {
    
    const [error, setError] = useState<string>("");
    const [errorVisable, setErrorVisable] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [buttonPressed, setButtonPressed] = useState<boolean>(false);
    const [books, setBooks] = useState<Book[]>([]);

    //Error handling
    const handleError = (message: string): void => {
        setError(message);
        setErrorVisable(true);
        setQuery('');
        console.log('error:', error, 'visable?: ', errorVisable);
        setTimeout(() => {
            setErrorVisable(false);
        }, 10000);
    };

    //Search bar handler
    const handleQuery = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setQuery(e.target.value);
    };

    //Submit button handler
    const handleSubmit = (): void => {
        setButtonPressed(true);
        let query_hypenless = query.replaceAll('-', '');
        if (query_hypenless !== '' && validISBN(query_hypenless)) {
            bookSearch(query_hypenless)
                .then(book => {
                    if (book != undefined){
                        bookToLocalStorage(book);
                        loadBooks();
                    } else {
                        handleError("Failed to fetch book information. Try again.");
                    }
                }) 
            setQuery('');
        } else {
            if (query_hypenless !== '') {
                handleError("Error: Invalid ISBN");
            }
        }
    };

    //Takes in a single character and checks if it is a number
    const isCharNumber = (char: string): boolean => {
        return (char.length === 1 && char >= '0' && char <= '9');
    }
    
    //ISBN verification
    const validISBN = (isbn: string): boolean => {
        if (typeof isbn !== 'string') { return false; }
        //If isbn contains hypens, strip hypens

        if (isbn.length == 10) {
            let sum: number = 0;
            for (let i = 0; i < isbn.length - 1; i++) {
                if (!isCharNumber(isbn[i])) {
                    handleError("Error: ISBN-10 should contain only digits (may contain hypens, last character may be 'X').");
                    return false; 
                }
                sum += (Number(isbn[i])*(10-i));
            }
            if (!isCharNumber(isbn[isbn.length - 1]) || isbn[isbn.length - 1] !== 'X'){
                handleError("Error: ISBN-10 should contain only digits (may contain hypens, last character may be 'X').");
                return false; 
            }
            if (isbn[isbn.length - 1] == 'X') { return 10 != 11 - (sum % 11); } 
            return Number(isbn[isbn.length - 1]) != 11 - (sum % 11);

        } else if (isbn.length == 13) {
            let sum: number = 0;
            for (let i = 0; i < isbn.length - 1; i++ ) {
                if (!isCharNumber(isbn[i])){
                    handleError("Error: ISBN-13 should contain only digits (may contain hypens).");
                    return false; 
                }

                if ((i + 1) % 2 == 0){
                    sum += Number(isbn[i])*3;
                } else {
                    sum += Number(isbn[i]);
                }
            }
            if (!isCharNumber(isbn[isbn.length - 1])) { 
                handleError("Error: ISBN-13 should contain only digits (may contain hypens).");
                return false; 
            }
            return Number(isbn[isbn.length - 1]) == 10 - (sum % 10);

        } else {
            handleError("Error: Incorrect ISBN length. Length should be 10 or 13 digits.");
            return false;
        }
    }

    //Clear Books handler
    const handleRemoveBook = (book: Book): void => {
        localStorage.removeItem(`${book.isbn}`);
        loadBooks();
    }

    //Update star/rating amount
    const handleRatingUpdate = (book: Book, i: number): void => {
        book.rating = i + 1;
        localStorage.setItem(`${book.isbn}`, JSON.stringify(book)); 
        loadBooks();
    }

    //Book Search API REQUEST
    const baseBookUrl = 'http://openlibrary.org/search.json?isbn=';
    const baseCoverUrl = 'https://covers.openlibrary.org/b/isbn/';

    async function bookSearch(query: string): Promise<Book | undefined> {
        try {
            const bookResponse = await axios.get(`${baseBookUrl}${query}`);
            if (bookResponse.data.docs.length == 0){
                return undefined;
            }
            const book: Book = { 
                title: bookResponse.data.docs[0].title, 
                author: bookResponse.data.docs[0].author_name[0], 
                isbn: query, 
                coverImage: `${baseCoverUrl}${query}-M.jpg`,
                bgColor: [127, 127, 127],
                rating: 0,
                bgLoaded: false,
            }
            return book;
        } catch (error) {
            return undefined;
        }
    }

    //Local Storage
    function bookToLocalStorage(book: Book): void {
        let keys = Object.entries(localStorage).map(([key, serializedBook]) => key);
        keys = keys.filter((key) => key == book.isbn);
        if (keys.length != 0) {
            handleError("Book already in inventory.");
            setQuery("");
            return
        }

        const serializedBook = JSON.stringify(book);
        localStorage.setItem(`${book.isbn}`, serializedBook);
    }

    //Load all books from local storage
    const loadBooks = (): void => {
        const entries = Object.entries(localStorage).map(([key, serializedBook]) => JSON.parse(serializedBook));
        let newbooks = entries.filter((entry) => validISBN(entry.isbn));
        setBooks(newbooks);
        console.log(books);
    };

    const handleBgLoaded = (loadedBook: Book, index: Number): void => {
        setBooks(prevBooks => prevBooks.map((book, i) => i === index ? {...book, bgLoaded: true} : book));
    }

    // Load books initially
    useEffect(loadBooks, []);
      
    return (
    <div className='flex lg:flex-row flex-col lg:justify-start justify-center items-center h-full lg:h-screen m-2'>
        <div className='flex flex-col justify-start items-center h-1/5 w-auto lg:w-2/5'>
            <p className='p-2 w-5/6 lg:w-3/4 text-center font-mono font-semibold  '>
                Input into the search bar a books ISBN to add it to your list of books. Don't forget to rate it!
            </p>
            <div className='flex flex-row justify-start w-full h-1/5 lg:h-2 lg:w-3/4 p-2 min-h-16'>
                <input className='border-solid border-black border rounded p-1 m-0.5 w-3/4 ' 
                type="text" value={query} onChange={handleQuery} placeholder="Input ISBN" />
                <button className={`border-solid border-black border rounded w-1/4 p-1 m-0.5 ${buttonPressed ? 'transform translate-y-px shadow-lg' : 'shadow-md'} transition duration-100`}
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
        <div className='flex flex-col justify-center items-center lg:grid lg:grid-cols-4 lg:max-h-full xl:grid-cols-5 w-full h-full'>
            {books.map((book, i) => 
            <motion.div
                key={book.isbn}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.25 }}
                className='relative'
            >
                <BookCard book={book} handleRemoveBook={handleRemoveBook} handleRatingUpdate={handleRatingUpdate} handleBgLoaded={handleBgLoaded} i={i} />
                {!book.bgLoaded && (
                    <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                        <Oval color='#abd9f5' secondaryColor='#79d2ed'/>
                    </div>
                )}
            </motion.div>)}
        </div>
    </div>
    )
}

export default Search;