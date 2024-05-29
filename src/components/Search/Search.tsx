'use client';

import react, { useState, useEffect, ReactElement } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa'
import axios from 'axios';
import { motion } from "framer-motion"

type Book = { 
    title: string,
    author: string,
    isbn: string,
    coverImage: string,
    rating: number
};

const Search = (): ReactElement => {
    
    const [query, setQuery] = useState<string>("");
    const [books, setBooks] = useState<Book[]>([]);

    //Search bar handler
    const handleQuery = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setQuery(e.target.value);
    };

    //Submit button handler
    const handleSubmit = (): void => {
        if (query !== '' && validISBN(query)) {
            bookSearch(query)
                .then(book => {
                    bookToLocalStorage(book);
                    loadBooks();
                }) 
            setQuery('');
        } else {
            console.log('failed in handle submit with ', query)
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
        isbn = isbn.replaceAll('-', '');

        if (isbn.length == 10) {
            let sum: number = 0;
            for (let i = 0; i < isbn.length - 1; i++) {
                if (!isCharNumber(isbn[i])) { return false; }
                sum += (Number(isbn[i])*(10-i));
            }
            if (!isCharNumber(isbn[isbn.length - 1]) || isbn[isbn.length - 1] !== 'X'){ return false; }
            if (isbn[isbn.length - 1] == 'X') { return 10 != 11 - (sum % 11); } 
            else { return Number(isbn[isbn.length - 1]) != 11 - (sum % 11); }

        } else if (isbn.length == 13) {
            let sum: number = 0;
            for (let i = 0; i < isbn.length - 1; i++ ) {
                if (!isCharNumber(isbn[i])){ 
                    console.log('failed in for loop')
                    return false; }
                if (i+1 % 2 == 0){
                    sum += Number(isbn[i]);
                } else {
                    sum += Number(isbn[i])*3;
                }
            }
            if (!isCharNumber(isbn[isbn.length - 1])) { return false; }
            console.log('sum: ', sum);
            let bool = Number(isbn[isbn.length - 1]) == 10 - (sum % 10);
            console.log('return bool is ', bool);
            return bool;

        } else {
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

    //Book Search
    const baseBookUrl = 'http://openlibrary.org/search.json?isbn=';
    const baseCoverUrl = 'https://covers.openlibrary.org/b/isbn/';

    async function bookSearch(query: string): Promise<Book> {
        const bookResponse = await axios.get(`${baseBookUrl}${query}`);
        const book: Book = { 
            title: bookResponse.data.docs[0].title, 
            author: bookResponse.data.docs[0].author_name[0], 
            isbn: query, 
            coverImage: `${baseCoverUrl}${query}-M.jpg`,
            rating: 0
        }
        return book;
    }
    
    //Book type into div
    function bookToDiv(book: Book): ReactElement {
        return (
            <motion.div 
                className='even:bg-stone-300 odd:bg-slate-300 p-3 md:m-3 m-2 max-w-64 flex-col flex-3 flex-wrap justify-center justify-items-center rounded-2xl shadow-lg' 
                whileHover={{ scale: 1.05 }}
                
            >
                <FaTimes color='#d40000' onClick={() => handleRemoveBook(book)} />
                <img className='m-auto mt-2 h-[200px] w-full object-contain rounded-sm max-w-64 pb-2' src={book.coverImage} alt={book.title}/>
                <div className='h-full flex-col flex-auto justify-end items-end text-center'>
                    <h2>{book.title}</h2>
                    <h3>{book.author}</h3>
                    <p>ISBN: {book.isbn}</p>
                    <div className='flex flex-row justify-center text-center pb-2'>
                        {[...Array(5)].map((elt, i) => (
                            <FaStar 
                                key={i} 
                                color={i < book.rating ? '#01af93' : '#bbbbbb'} 
                                onClick={() => handleRatingUpdate(book, i)} 
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        )
    }

    //Local Storage
    function bookToLocalStorage(book: Book): void {
        const serializedBook = JSON.stringify(book);
        localStorage.setItem(`${book.isbn}`, serializedBook);
    }

    //Load all books from local storage
    const loadBooks = (): void => {
        const entries = Object.entries(localStorage).map(([key, serializedBook]) => JSON.parse(serializedBook));
        let newbooks = entries.filter((entry) => validISBN(entry.isbn));
        setBooks(newbooks);
    };

    // Load books initially
    useEffect(loadBooks, []); 
    return (
    <div className='flex lg:flex-row flex-col flex-2 lg:justify-start justify-center items-center lg:h-screen '>
        <div className='flex flex-col justify-center items-center'>
            <p className='p-2 m-10 -mb-8 w-5/6 lg:w-1/2 text-center font-mono font-semibold'>
                Input into the search bar a books ISBN to add it to your list of books. Don't forget to rate it!
            </p>
            <div className='flex flex-row flex-3 justify-start m-10 w-auto h-1/5 p-2 min-h-16'>
                <input className='border-solid border-black border rounded p-1 m-0.5' 
                type="text" value={query} onChange={handleQuery} placeholder="Input ISBN" />
                <button className='border-solid border-black border rounded p-1 m-0.5'
                onClick={handleSubmit}>Submit</button>
            </div>
        </div>
        <div className='flex flex-col justify-center items-center lg:grid lg:grid-cols-4 lg:max-h-full xl:grid-cols-5 overflow-auto w-full h-full'>
            {books.map((book) => (bookToDiv(book)))}
        </div>
    </div>
    )
}

export default Search;