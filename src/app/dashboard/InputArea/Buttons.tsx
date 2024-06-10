'use client';

import { ReactElement, useState } from "react";

export default function Buttons({ query, setQuery, setBookSelectVisable, }: { query: string, setQuery: Function, setBookSelectVisable: Function, }): ReactElement {
    const [buttonPressed, setButtonPressed] = useState<boolean>(false);

    function handleSubmit(): void {
        setButtonPressed(true);
        setBookSelectVisable(true);
    }

    return (
        <div className='flex flex-col justify-start items-center h-1/5 w-auto lg:m-5 lg:h-[250px] lg:w-[400px] lg:flex-shrink-0'>
            <p className='p-2 w-5/6 lg:w-3/4 text-center font-Urbanist font-semibold text-[1.5rem]  '>
                Input into the search bar a books ISBN to add it to your list of books.
            </p>
            <div className='flex flex-row justify-start w-full h-1/5 p-2 min-h-16'>
                <input className='border border-gray-300 hover:border-gray-500 focus:ring-blue-500 focus:hover:ring-blue-500 focus:hover:outline-none rounded-md focus:outline-none focus:ring-2 resize-none overflow-auto p-1 m-0.5 w-3/4 ' 
                type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Input ISBN" />
                <button className={`border border-gray-300 hover:border-gray-500 rounded w-1/4 p-1 m-0.5 font-medium ${buttonPressed ? 'transform translate-y-px shadow-lg' : 'shadow-md'} transition duration-100`}
                onMouseDown={handleSubmit} onMouseUp={() => setButtonPressed(false)}>Search</button>
            </div>
        </div>
    )
}