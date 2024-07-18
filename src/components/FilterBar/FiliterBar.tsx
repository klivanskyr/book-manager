'use client';

import { NavBarLR, TextInput } from "@/components";
import SortBy from "./SortBy";
import { useEffect, useState } from "react";
import { Slider } from "@nextui-org/react";
import { Book } from "@/types/Book";
import { Shelf } from "@/types/Shelf";

export default function FilterBar({ isLoading, setIsLoading, shelf, setShelf }: { isLoading: boolean, setIsLoading: Function, shelf: Shelf, setShelf: Function }) {
    const [titleFilter, setTitleFilter] = useState<string>('');
    const [authorFilter, setAuthorFilter] = useState<string>('');
    const [ratingFilter, setRatingFilter] = useState<[number, number]>([0, 5]);


    //client side filtering of books because firestore does not support where clauses on different fields at once
    useEffect(() => {
        if (shelf) {
            setIsLoading(true);
            let newBooks: Book[] = [];
            shelf.books.forEach((book: Book) => {
                if (book.title.toLowerCase().startsWith(titleFilter.toLowerCase()) && book.author.toLowerCase().startsWith(authorFilter.toLowerCase()) && book.rating >= ratingFilter[0] && book.rating <= ratingFilter[1]) {
                    newBooks.push(book);
                }
            });
            if (JSON.stringify(newBooks) != JSON.stringify(shelf.shownBooks)) { //only update if the books are different
                const newShelf = { ...shelf, shownBooks: newBooks };
                setShelf(newShelf);
            }
            setIsLoading(false);
        }
    }, [titleFilter, authorFilter, ratingFilter]);


        // <SortBy isLoading={isLoading} setIsLoading={setIsLoading} />

    return (
        <div className="px-2 flex flex-col justify-center lg:justify-start items-center lg:flex-row">
            <TextInput className='h-13 w-[400px] lg:w-[250px] pr-2' label='Title' value={titleFilter} setValue={setTitleFilter} disabled={isLoading} />,
            <TextInput className='h-13 w-[400px] lg:w-[250px] pr-1' label='Author' value={authorFilter} setValue={setAuthorFilter} disabled={isLoading} />,
            <Slider classNames={{ labelWrapper: 'relative top-16 lg:top-0', thumb: 'bg-blue-700', base: 'w-[250px] mx-2 -mt-[30px] mb-[50px] lg:my-1' }} showSteps size='lg' disableThumbScale label='Filter Rating' step={1} minValue={0} maxValue={5} value={ratingFilter} onChange={(e: any) => setRatingFilter(e)} />
        </div>
    )
}