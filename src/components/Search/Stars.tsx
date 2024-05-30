import React from 'react'
import { FaStar } from 'react-icons/fa'

import { Book } from './Book'

const Stars = ({ size, book, handleRatingUpdate }: { size: number, book: Book, handleRatingUpdate: Function }) => {
  return (
    <div className='flex flex-row justify-center text-center pb-2'>
        {[...Array(5)].map((_, i) => (
            <FaStar 
                key={i} 
                color={i < book.rating ? '#01af93' : '#bbbbbb'} 
                onClick={() => handleRatingUpdate(book, i)}
                size={size}
                className='mt-2'
            />
        ))}
    </div>
  )
}

export default Stars