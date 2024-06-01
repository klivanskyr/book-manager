import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa'
import { motion } from "framer-motion"
import Modal from 'react-modal'
import axios from 'axios';
import { Button } from "antd";

import { Book } from './Book';

const BookSelect = ({ active, query, currentBooks, booksToLocalStorage, handleBookSelectClose }: { active: boolean, query: string, currentBooks: Book[], booksToLocalStorage: Function, handleBookSelectClose: Function }) => {

    const [foundBooks, setFoundBooks] = useState<Book[]>([]);

    //handle selecting book from modal
    const handleClickAdd = (i: number) => {
        const updatedBook = { ...foundBooks[i], selected: true };
        setFoundBooks(foundBooks.map((book, index) => index === i ? updatedBook : book));
        booksToLocalStorage([...currentBooks, updatedBook]);
}

    //handle removing book from modal
    const handleClickRemove = (i: number) => {
        const updatedBook = { ...foundBooks[i], selected: false };
        setFoundBooks(foundBooks.map((book, index) => index === i ? updatedBook : book));
        const updatedCurrentBooks = currentBooks.filter((book) => (book.key !== updatedBook.key));
        booksToLocalStorage(updatedCurrentBooks);
    }

    //Book Search API REQUEST
    const baseBookUrl = 'http://openlibrary.org/search.json?isbn=';
    const baseCoverUrl = 'https://covers.openlibrary.org/b/olid/';

    //API call to get books to display to pick from
    async function getBooks(query: string): Promise<Book | undefined> {
        const query_hypenless = query.replaceAll('-', '');
        try {
            const bookResponse = await axios.get(`${baseBookUrl}${query_hypenless}`);
            console.log(query, bookResponse);
            if (bookResponse.data.docs.length == 0){
                return undefined;
            }
            let books: Book[] = bookResponse.data.docs
            .filter((entry: any) => entry.title && entry.author_name && entry.author_name[0]) //Filter out undefined entires then map to book datatype
            .map((entry: any) => ({
                key: entry.key,
                title: entry.title,
                author: entry.author_name[0],
                review: '',
                rating: 0,
                isbn: query_hypenless,
                coverImage: `${baseCoverUrl}${entry.cover_edition_key}-M.jpg`,
                bgColor: [127, 127, 127], //default
                selected: false
            }));
            
            /* 
                Loops through books pulled from API
                for every pulled book, loop through currentBooks and see if
                there is a match. If so replace the pulled book with the
                current book so the reviews and rating is preserved
            */
            books = books.map((book) => {
                const currentBook = currentBooks.find(curBook => curBook.key == book.key);
                console.log('found book:', currentBook);
                return currentBook ? currentBook : book;
            })
            setFoundBooks(books);

        } catch (error) {
            return undefined
        }
    }

    //Removes page scorll when modal active
    useEffect(() => {
        if (active) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [active]);

    //Run getBooks on init
    useEffect(() => {
        getBooks(query);
    }, [active])
    
    return (
        <Modal
        isOpen={active}
        onRequestClose={() => handleBookSelectClose()}
        className="flex items-center justify-center h-3/4 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
        <div className="flex bg-white border p-6 rounded-lg shadow-lg w-full h-full overflow-y-scroll">
            <FaTimes onClick={() => handleBookSelectClose()} />
            <div className='grid grid-cols-3'>
                {foundBooks.map((book, i) => (
                    <motion.div 
                        whileHover={{ scale: 1.03 }}
                        key={book.key} className='bg-neutral-50 flex flex-col text-center rounded-md shadow-md m-3 p-2'
                    >
                        <Image
                            className='m-auto mt-2 h-[150px] w-full object-contain rounded-sm max-w-64 pb-2'
                            src={book.coverImage} 
                            alt={book.title}
                            width={200} height={200} />
                        <h1>{book.title}</h1>
                        <h2>{book.author}</h2>
                        <div>
                            {!book.selected && (
                                <Button type="primary" className='my-3 mx-0.5 w-1/3' onClick={() => handleClickAdd(i)}>Select</Button>
                            )}
                            {book.selected && (
                                <Button type="primary" danger className='my-3 mx-0.5 w-1/3' onClick={() => handleClickRemove(i)}>Remove</Button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
        </Modal>
    )
}

export default BookSelect