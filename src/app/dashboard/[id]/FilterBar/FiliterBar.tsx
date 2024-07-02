'use client';

import { Navbar, TextInput } from "@/app/components";
import SortBy from "./SortBy";
import { useContext, useEffect, useState } from "react";
import { Slider } from "@nextui-org/react";
import { UserContext } from "@/app/types/UserContext";
import { Book } from "@/app/types/Book";

export default function FilterBar({ isLoading, setIsLoading }: { isLoading: boolean, setIsLoading: Function }) {
    const { user, setUser } = useContext(UserContext);
    const [titleFilter, setTitleFilter] = useState<string>('');
    const [authorFilter, setAuthorFilter] = useState<string>('');
    const [ratingFilter, setRatingFilter] = useState<[number, number]>([0, 5]);


    //client side filtering of books because firestore does not support where clauses on different fields at once
    useEffect(() => {
        if (user && user.books) {
            setIsLoading(true);
            let newBooks: Book[] = [];
            user.books.forEach((book: Book) => {
                if (book.title.toLowerCase().startsWith(titleFilter.toLowerCase()) && book.author.toLowerCase().startsWith(authorFilter.toLowerCase()) && book.rating >= ratingFilter[0] && book.rating <= ratingFilter[1]) {
                    newBooks.push(book);
                }
            });
            if (JSON.stringify(newBooks) != JSON.stringify(user.shownBooks)) { //only update if the books are different
                setUser({ ...user, shownBooks: newBooks });
            }
            setIsLoading(false);
        }
    }, [titleFilter, authorFilter, ratingFilter, user]);

    const leftElements = [
        <TextInput className='h-13 w-[250px] pr-2' label='Title' value={titleFilter} setValue={setTitleFilter} disabled={isLoading} />,
        <TextInput className='h-13 w-[250px] pr-1' label='Author' value={authorFilter} setValue={setAuthorFilter} disabled={isLoading} />,
        <Slider classNames={{ thumb: 'bg-blue-700', base: 'w-[250px] mx-2 my-1' }} showSteps size='lg' disableThumbScale label='Filter Rating' step={1} minValue={0} maxValue={5} value={ratingFilter} onChange={(e: any) => setRatingFilter(e)} />
    ]

    const rightElements = [
        <SortBy isLoading={isLoading} setIsLoading={setIsLoading} />
    ]

    return (
        <Navbar className='flex flex-row justify-between my-2 mx-4' leftElements={leftElements} rightElements={rightElements} />
    )
}