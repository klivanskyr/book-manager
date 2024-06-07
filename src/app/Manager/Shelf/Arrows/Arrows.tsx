import { ReactElement } from 'react';
import { Button } from 'antd';
import { Link } from 'react-scroll';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { Book } from '../../Book';

export default function Arrows({ books, isMobile, numBooksOnShelf, handleClick }: { books: Book[], isMobile: boolean, numBooksOnShelf: number, handleClick: Function }): ReactElement {
    //if there are less books than the number of books on the shelf, don't show arrows
    if (books.length < numBooksOnShelf) {return (<></>)}

    //If mobile, include Link to bring to top of shelf
    if (isMobile) {
        return (
            <div className='flex flex-row justify-center'>
                <Link to='shelf' offset={-75} >
                    <Button className='m-2' type="primary" shape='circle' icon={<FaChevronLeft />} onClick={() => (handleClick(1))}/>
                    <Button className='m-2' type="primary" shape='circle' icon={<FaChevronRight />} onClick={() => (handleClick(-1))}/>
                </Link>
            </div> 
        )
    } else {
        return (
            <div className='flex flex-row justify-center'>
                <Button className='m-2' type="primary" shape='circle' icon={<FaChevronLeft />} onClick={() => (handleClick(1))}/>
                <Button className='m-2' type="primary" shape='circle' icon={<FaChevronRight />} onClick={() => (handleClick(-1))}/>
            </div>
        ) 
    }
}