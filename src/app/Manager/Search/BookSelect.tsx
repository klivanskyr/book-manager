import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import Modal from 'react-modal'
import axios from 'axios';
import coverPlaceholder from '../../../public/coverPlaceholder.jpg'

import { Book } from './Book';
import ModalGrid from './ModalGrid';

const BookSelect = ({ active, query, currentBooks, handleError, booksToLocalStorage, handleBookSelectClose }: { active: boolean, query: string, currentBooks: Book[], handleError: Function, booksToLocalStorage: Function, handleBookSelectClose: Function }) => {

    const [foundBooks, setFoundBooks] = useState<Book[]>([]);
    const [skeletonLength, SetSkeletonLength] = useState<number>(1);
    const [isTitlesLoaded, setIsTitlesLoaded] = useState<boolean>(false);
    const [isImagesLoaded, setIsImagesLoaded] = useState<boolean>(false);

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
        setIsTitlesLoaded(false);
        setIsImagesLoaded(false);
        if (query === '') { return undefined; }
        const query_hypenless = query.replaceAll('-', '');
        try {
            const bookResponse = await axios.get(`${baseBookUrl}${query_hypenless}`);
            if (bookResponse.data.docs.length == 0){
                handleError(`No books found with ISBN ${query}.`);
                handleBookSelectClose();
                return undefined;
            }
            setIsTitlesLoaded(true);
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
                coverImage: entry.cover_edition_key ? `${baseCoverUrl}${entry.cover_edition_key}-M.jpg?default=false` : coverPlaceholder.src,
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
            setFoundBooks(books);
            setIsImagesLoaded(true);

        } catch (error) {
            setIsTitlesLoaded(false);
            setIsImagesLoaded(false);
            return undefined;
        }
    }

    const loadedImg = (book: Book) => {
        console.log(book.title, 'is loaded with', book.coverImage);
        setFoundBooks(foundBooks.map((b) => (b.key === book.key ? { ...book, imgLoaded: true } : b)));
    }

    const updateSRC = (e: React.ChangeEvent<HTMLImageElement>, book: Book) => {
        console.log('updating src', book.title)
        const updatedBooks = foundBooks.map((b) => (b.key === book.key ? { ...book, coverImage: coverPlaceholder.src, imgLoaded: true } : b));
        setFoundBooks(updatedBooks);
        e.target.src = coverPlaceholder.src;
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
                <ModalGrid 
                    isTitlesLoaded={isTitlesLoaded} 
                    isImagesLoaded={isImagesLoaded} 
                    foundBooks={foundBooks}
                    skeletonLength={skeletonLength} 
                    handleClickAdd={handleClickAdd} 
                    handleClickRemove={handleClickRemove} 
                    loadedImg={loadedImg} 
                    updateSRC={updateSRC}
                />
            </div>
        </Modal>
    )
}

export default BookSelect