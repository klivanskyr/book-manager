'use client';

import { useContext, useEffect, useState } from "react";
import { Pagination, Spinner } from "@nextui-org/react";
import { motion } from 'framer-motion';

import { UserContext } from "@/app/types/UserContext";
import BookCard from "./BookCard";
import SortBy from "./SortBy";

export default function Shelf() {
    const { user, setUser } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [numBooksOnShelf, setNumBooksOnShelf] = useState(5);
    const [isMobile, setIsMobile] = useState(false);

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
        function handleResize() {
            if (window.innerWidth < 1023) {
                setNumBooksOnShelf(8);
                setIsMobile(true);
            } else if (window.innerWidth < 1280) {
                setNumBooksOnShelf(3);
                setIsMobile(false);
            } else if (window.innerWidth < 1536) {
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
    
   

    function Body() {
        console.log('User:', user)
        if (!user) { 
            console.log('No user', user);
            return <h1>No User</h1> 
        }
        if (user.books === null) {
            return (
            <div className='flex flex-row justify-center w-full h-full'>
                <Spinner label='Loading...' size='lg' />
            </div>
            )
        }
        if (user.books.length === 0) {
            return (
                <div className='flex flex-row justify-center items-center w-full h-full'>
                    <div className='flex flex-col lg:flex-row justify-center items-center shadow-small p-6' >
                        <h1 className='text-xl mx-1' >Woah...</h1>
                        <h1 className='text-xl mx-1' >looking a little empty here.</h1>
                        <h1 className='text-xl mx-1' >Let's add a book!</h1>
                    </div>
                </div>
            )
        }
        return (
            <div className="w-full flex flex-col mt-4 lg:mt-24 rounded-md items-center">
                <motion.div
                    className="flex flex-col lg:flex-row justify-start items-center w-auto p-1 pb-4 lg:shadow-md rounded"
                    key={currentPage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {user.books.slice(numBooksOnShelf*(currentPage - 1), numBooksOnShelf*(currentPage - 1) + numBooksOnShelf).map(book => (
                        <motion.div key={book.key}
                            className='w-full min-w-[300px]'
                            whileHover={{ scale: 1.03 }}
                        >
                            <BookCard book={book} />
                        </motion.div>
                    ))}
                </motion.div>
                {user.books.length > numBooksOnShelf && 
                    <Pagination className='flex flex-row justify-center mt-2' size='lg' loop isCompact showShadow showControls total={Math.ceil(user.books.length / numBooksOnShelf)} page={currentPage} onChange={(page) => setCurrentPage(page)} />
                }
            </div>
        )
    }

    return (
        <>
            <SortBy />
            <Body />
        </>
    )
}