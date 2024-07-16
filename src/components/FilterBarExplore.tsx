'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";
import { getAllPublicShelves, Filter, Sort } from '@/firebase/firestore';

export default function filterBarExplore({ setShelves, setLoading }: { setShelves: Function, setLoading: Function }) {
    const [search, setSearch] = useState<string>('');
    const [searchKeys, setSearchKeys] = useState(new Set(["0"]));
    const [sortKeys, setSortKeys] = useState(new Set(['6']));

    const filters = ['Title', 'Author'];
    const sorts = ['Title A-Z', 'Title Z-A', 'Author A-Z', 'Author Z-A', 'Highest Rating', 'Lowest Rating', 'Newest', 'Oldest'];
    
    const selectedSearchIndex: number = Number(Array.from(searchKeys))
    const selectedSortIndex: number = Number(Array.from(sortKeys))

    const filterShelves = async (search: string, e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();

        function getFilter(search: string): Filter {
            switch (filters[selectedSearchIndex]) {
                case 'Title':
                    return { key: 'nameLowerCase', value: search };
                case 'Author':
                    return { key: 'createdByNameLowerCase', value: search };
                default:
                    return { key: 'nameLowerCase', value: search };
            }
        }

        function getSort(): Sort {
            switch (sorts[selectedSortIndex]) {
                case 'Title A-Z':
                    return { key: 'nameLowerCase', order: 'asc' };
                case 'Title Z-A':
                    return { key: 'nameLowerCase', order: 'desc' };
                case 'Author A-Z':
                    return { key: 'createdByNameLowerCase', order: 'asc' };
                case 'Author Z-A':
                    return { key: 'createdByNameLowerCase', order: 'desc' };
                case 'Highest Rating':
                    return { key: 'followers', order: 'desc' };
                case 'Lowest Rating':
                    return { key: 'followers', order: 'asc' };
                case 'Newest':
                    return { key: 'createdAt', order: 'desc' };
                case 'Oldest':
                    return { key: 'createdAt', order: 'asc' };
                default: 
                    return { key: 'nameLowerCase', order: 'asc' };
            }
        }

        const sort: Sort = getSort();
        const filter: Filter = getFilter(search);
        const newShelves = await getAllPublicShelves(filter, sort);
        setShelves(newShelves);
    }

    const debouncedHandler = useCallback(
        debounce(async (search: string) => {
            setLoading(true);
            filterShelves(search).then(() => setLoading(false));
        }, 600),
        []
    )

    useEffect(() => {
        setLoading(true);
        filterShelves(search).then(() => setLoading(false));
    }, [searchKeys, sortKeys])

    return (
        <form className='flex flex-row justify-center w-[1000px] items-center' onSubmit={(e) => filterShelves(search, e)}>
            <Input className='h-[50px] w-[650px]' variant='faded' type='text' label='Search' value={search} onValueChange={(value) => {
                setSearch(value);
                debouncedHandler(value);
            }} />

            <Dropdown>
                <DropdownTrigger>
                    <Button className='h-[50px] w-[175px] font-light text-[1.025rem] px-2' variant='faded'>Search by {filters[selectedSearchIndex]}</Button>
                </DropdownTrigger>
                <DropdownMenu selectionMode='single' disallowEmptySelection selectedKeys={searchKeys} onSelectionChange={setSearchKeys} >
                    {filters.map((filter, index) => (
                        <DropdownItem key={index} textValue={filter}>
                            <div>{filter}</div>
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>

            <Dropdown>
                <DropdownTrigger>
                    <Button className='h-[50px] w-[175px] font-light text-[1.025rem]' variant='faded'>Sort by {sorts[selectedSortIndex]}</Button>
                </DropdownTrigger>
                <DropdownMenu selectionMode='single' disallowEmptySelection selectedKeys={sortKeys} onSelectionChange={setSortKeys} >
                    {sorts.map((sort, index) => (
                        <DropdownItem key={index} textValue={sort}>
                            <div>{sort}</div>
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>

        </form>
    )
}