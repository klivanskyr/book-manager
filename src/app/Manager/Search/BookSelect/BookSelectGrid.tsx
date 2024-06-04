import React from 'react'
import { Button } from "antd";
import { motion } from "framer-motion"
import Image from 'next/image';

import { Book } from '../../Book'
import { coverPlaceholder } from '@/assets';

export default function BookSelectGrid({ foundBooks, handleClickAdd, handleClickRemove }: 
    { foundBooks: Book[], handleClickAdd: Function, handleClickRemove: Function }) {
    
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