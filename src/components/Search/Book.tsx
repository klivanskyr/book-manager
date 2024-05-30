import react, { useState, useEffect, ReactElement } from 'react';
import Image from 'next/image';
import { FaStar, FaTimes } from 'react-icons/fa'
import ColorThief from 'colorthief'
import { motion } from "framer-motion"

export type Book = { 
    title: string,
    author: string,
    isbn: string,
    coverImage: string,
    bgColor: number[],
    rating: number
    bgLoaded: boolean,
};


export const BookCard = ({ book, handleRemoveBook, handleRatingUpdate, handleBgLoaded, i}: { book:Book, handleRemoveBook: Function, handleRatingUpdate: Function, handleBgLoaded: Function, i: number }): ReactElement => {
    const [bgColor, setBgColor] = useState<string>("");

    useEffect(() => {
        const fetchDominantColor = async () => {
            const colorThief = new ColorThief();
            const img = new window.Image();
            img.crossOrigin = 'anonymous';
            img.src = book.coverImage;

            img.onload = function () {
                const color = colorThief.getColor(img);
                setBgColor(`rgb(${color[0]+50}, ${color[1]+50}, ${color[2]+50})`); //CAN OVERFLOW
                console.log(book);
                handleBgLoaded(book, i);
            };
        };
        
        fetchDominantColor();
    }, [book.bgLoaded]);

    return (
        <motion.div 
            style={{ backgroundColor: bgColor }}
            className={`p-3 md:m-3 m-2 max-w-64 flex-col flex-wrap justify-center justify-items-center rounded-2xl shadow-lg ${book.bgLoaded ? 'opacity-100' : 'opacity-0'}`}  
            whileHover={{ scale: 1.05 }}
            
        >
            <FaTimes color='#d40000' onClick={() => handleRemoveBook(book)} />
            <div className='h-full w-full'>
                <Image
                    className='m-auto mt-2 h-[200px] w-full object-contain rounded-sm max-w-64 pb-2'
                    src={book.coverImage} 
                    alt={book.title}
                    width={200}
                    height={200}
                    sizes=''
                    priority={true}
                />
            </div>
            <div className='h-full flex-col flex-auto justify-end items-end text-center'>
                <h2 className='font-bold'>{book.title}</h2>
                <h3 className='font-medium'>{`Author: ${book.author}`}</h3>
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

