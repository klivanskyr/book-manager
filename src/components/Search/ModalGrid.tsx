import React, { useState, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { Button } from "antd";
import { motion } from "framer-motion"
import coverPlaceholder from '../../../public/coverPlaceholder.jpg'
import Image from 'next/image';

import { Book } from './Book';



const ModalGrid = ({ isTitlesLoaded, isImagesLoaded, foundBooks, skeletonLength, handleClickAdd, handleClickRemove, loadedImg, updateSRC }: 
    { isTitlesLoaded: boolean, isImagesLoaded: boolean, foundBooks: Book[], skeletonLength: number, handleClickAdd: Function, handleClickRemove: Function, loadedImg: Function, updateSRC: Function }) => {
    
  return (
    <div className='grid grid-cols-3 items-center'>
        {foundBooks.map((book, i) => (
            <motion.div 
                whileHover={{ scale: 1.03 }}
                key={book.key} 
                className='bg-slate-50 h-[400px] w-[300px] flex flex-col justify-center text-center rounded-md shadow-md m-3 p-6'
            > 
                <Image
                    className={'mx-auto mt-4 w-full object-contain rounded-sm max-w-64 pb-2 h-[200px]'}
                    src={book.coverImage ? book.coverImage : coverPlaceholder.src} 
                    onError={(e: React.ChangeEvent<HTMLImageElement>) => {
                        e.target.src = coverPlaceholder.src;
                    }}
                    alt={book.title}
                    placeholder='blur'
                    blurDataURL={coverPlaceholder.src}
                    width={200}
                    height={200}
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
            ))}
    </div>
  )
}

export default ModalGrid

{/* {!isTitlesLoaded ? ( //If titles are loading make 1 big skeleton
            <Skeleton height={1000} width={1000}/>

        ) : !isImagesLoaded ? ( //If titles are loaded but images are not, create cards with skeleton images
            Array(skeletonLength)
            .fill(null)
            .map((_, index) => (
                <Skeleton key={index} className='m-3 p-2' height={400} width={300}/>
            ))

        ) : ( //If titles and images are loaded, create full cards
            foundBooks.map((book, i) => (
                <motion.div 
                    whileHover={{ scale: 1.03 }}
                    key={book.key} 
                    className='bg-slate-50 h-[400px] w-[300px] flex flex-col justify-center text-center rounded-md shadow-md m-3 p-6'
                > 
                    {!book.imgLoaded && (<Skeleton className='mt-2' width={200} height={200} />)}
                    <img
                        className={`mx-auto mt-4 w-full object-contain rounded-sm max-w-64 pb-2 ${!book.imgLoaded ? 'h-0' : 'h-[200px]'}`}
                        src={book.coverImage ? book.coverImage : coverPlaceholder.src} 
                        onError={(e: React.ChangeEvent<HTMLImageElement>) => {
                            e.target.src = coverPlaceholder.src;
                            updateSRC(e, book)
                        }}
                        onLoad={() => loadedImg(book)}
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
    </div> */}