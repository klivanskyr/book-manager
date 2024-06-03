import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { motion } from "framer-motion"
import Modal from 'react-modal'
import axios from 'axios';
import { Button } from "antd";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

import { Book } from './Book';
import coverPlaceholder from '../../../public/coverPlaceholder.jpg'

const BookSelect = ({ active, query, currentBooks, handleError, booksToLocalStorage, handleBookSelectClose }: { active: boolean, query: string, currentBooks: Book[], handleError: Function, booksToLocalStorage: Function, handleBookSelectClose: Function }) => {

    const [foundBooks, setFoundBooks] = useState<Book[]>([]);
    const [skeletonLength, SetSkeletonLength] = useState<number>(1);
    const [isooksLoaded, setIsLoading] = useState<boolean>(true);

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
        if (query === '') { return undefined; }
        const query_hypenless = query.replaceAll('-', '');
        setIsLoading(true);
        try {
            const bookResponse = await axios.get(`${baseBookUrl}${query_hypenless}`);
            if (bookResponse.data.docs.length == 0){
                console.log('here');
                handleError(`No books found with ISBN ${query}.`);
                handleBookSelectClose();
                return undefined;
            }
            SetSkeletonLength(bookResponse.data.docs.length);
            let books: Book[] = bookResponse.data.docs
            .filter((entry: any) => entry.title && entry.author_name && entry.author_name[0]) //Filter out undefined entires then map to book datatype
            .map((entry: any) => ({
                key: entry.key,
                title: entry.title,
                author: entry.author_name[0],
                review: '',
                rating: 0,
                isbn: query_hypenless,
                coverImage: `${baseCoverUrl}${entry.cover_edition_key}-M.jpg?default=false`,
                bgColor: [127, 127, 127], //default
                selected: false,
                bgLoaded: false,
                imgLoaded: false
            }));
            
            /* 
                Loops through books pulled from API
                for every pulled book, loop through currentBooks and see if
                there is a match. If so replace the pulled book with the
                current book so the reviews and rating is preserved
            */
            books = books.map((book) => {
                const currentBook = currentBooks.find(curBook => curBook.key == book.key);
                return currentBook ? currentBook : book;
            })
            console.log(books);
            setFoundBooks(books);
            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            return undefined;
        }
    }

    const loadedImg = (i: number) => {
        const updatedBook = { ...foundBooks[i], imgLoaded: true };
        setFoundBooks(foundBooks.map((book, index) => index == i ? updatedBook : book));
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
        setFoundBooks([]);
        getBooks(query);
    }, [active])
    
    return (
        <Modal
        isOpen={active && foundBooks.length > 0}
        onRequestClose={() => handleBookSelectClose()}
        className="flex items-center justify-center h-3/4 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <div className="flex bg-white border p-6 rounded-lg shadow-lg w-full h-full overflow-y-scroll">
                <FaTimes onClick={() => handleBookSelectClose()} />
                <div className='grid grid-cols-3 items-center'>
                    {isLoading ? (
                        Array(skeletonLength)
                        .fill(null)
                        .map((_, index) => (
                            <Skeleton key={index} className='m-3 p-2' height={400} width={300}/>
                        ))
                    ) : (
                        foundBooks.map((book, i) => (
                            <motion.div 
                                whileHover={{ scale: 1.03 }}
                                key={book.key} 
                                className='bg-slate-50 h-[400px] w-[300px] flex flex-col justify-center text-center rounded-md shadow-md m-3 p-6'
                            >
                                {!book.imgLoaded && (<Skeleton className='mt-2' width={200} height={200} />)}
                                <img
                                    className={` mx-auto mt-4 w-full object-contain rounded-sm max-w-64 pb-2 ${!book.imgLoaded ? 'h-0' : 'h-[200px]'}`}
                                    src={book.coverImage} 
                                    onError={(e: React.ChangeEvent<HTMLImageElement>) => {
                                        e.target.onerror = null;
                                        e.target.src = coverPlaceholder.src;
                                        book.coverImage = coverPlaceholder.src;
                                    }}
                                    onLoad={() => loadedImg(i)}
                                    alt={book.title}
                                    width={200} height={200} 
                                /> 
                                <h1>{book.title}</h1>
                                <h2>{book.author}</h2>
                                <div>
                                    {!book.selected && (
                                        <Button type="primary" className='my-3 mx-0.5 p-1 w-1/3' onClick={() => handleClickAdd(i)}>Select</Button>
                                    )}
                                    {book.selected && (
                                        <Button type="primary" danger className='my-3 mx-0.5 p-1 w-1/3' onClick={() => handleClickRemove(i)}>Remove</Button>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default BookSelect