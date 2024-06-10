'use client';

import React, { ReactElement, useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';

import { Book } from '@/app/types/Book';
import { UserContext } from '@/app/types/UserContext';
import { Card } from '../Card'

export default function BookRow({ shelfIndex, numBooksOnShelf }: { shelfIndex: number, numBooksOnShelf: number }): ReactElement {

    const { user, setUser } = useContext(UserContext);

    //Prevents hydration error
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, [])
    if (!isMounted || !user) return <div></div>; //NO USER, NO SHELF

    return (
        <div id='shelf' className='flex flex-col justify-center items-center w-full h-full lg:flex-row lg:justify-start'>
            {/* shows only a subset of the books in order to create pagaination for shelving */}
            {user.books.slice(0 + shelfIndex*numBooksOnShelf, numBooksOnShelf + shelfIndex*numBooksOnShelf).map((book: Book) => (
                <motion.div
                    key={book.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.25 }}
                    className='flex-none w-full 1023:w-1/3 1150:w-1/4 1670:w-1/5 h-auto'
                >
                    <Card book={book} />
                </motion.div>
            ))}
        </div>
    )
}