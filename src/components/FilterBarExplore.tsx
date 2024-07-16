'use client';

import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { debounce, set } from 'lodash';

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";
import { Shelf } from '@/types';
import { getAllPublicShelves, Filter, Sort } from '@/firebase/firestore';

export default function filterBarExplore({ setShelves }: { setShelves: Function }) {
    const [search, setSearch] = useState<string>('');
    const [searchKeys, setSearchKeys] = useState(new Set(["Title"]));
    const [sortKeys, setSortKeys] = useState(new Set(['A to Z']));

    const filters = ['Title', 'Author'];
    const sorts = ['Title A-Z', 'Title Z-A', 'Author A-Z', 'Author Z-A', 'Highest Rating', 'Lowest Rating', 'Newest', 'Oldest'];


    const selectedSearchIndex: number = useMemo(
        () => Number(Array.from(searchKeys).join(", ").replaceAll("_", " ")),
        [searchKeys]
    );

    const selectedSortIndex: number = useMemo(
        () => Number(Array.from(sortKeys).join(", ").replaceAll("_", " ")),
        [sortKeys]
    );

    const filterShelves = async (search: string, e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();

        console.log('search: ', search);

        function getFilter(search: string): Filter {
            switch (filters[selectedSearchIndex]) {
                case 'Title':
                    return { key: 'name', value: search };
                case 'Author':
                    return { key: 'createdByName', value: search };
                default:
                    return { key: 'name', value: search };
            }
        }

        function getSort(): Sort {
            switch (sorts[selectedSortIndex]) {
                case 'Title A-Z':
                    return { key: 'name', order: 'asc' };
                case 'Title Z-A':
                    return { key: 'name', order: 'desc' };
                case 'Author A-Z':
                    return { key: 'createdByName', order: 'asc' };
                case 'Author Z-A':
                    return { key: 'createdByName', order: 'desc' };
                case 'Highest Rating':
                    return { key: 'followers', order: 'desc' };
                case 'Lowest Rating':
                    return { key: 'followers', order: 'asc' };
                case 'Newest':
                    return { key: 'createdAt', order: 'desc' };
                case 'Oldest':
                    return { key: 'createdAt', order: 'asc' };
                default: 
                    return { key: 'name', order: 'asc' };
            }
        }

        const sort: Sort = getSort();
        const filter: Filter = getFilter(search);
        console.log('filter: asldjfalksdf', filter);
        const newShelves = await getAllPublicShelves(filter, sort);
        console.log('getAllPublicShelves: ', newShelves);
        setShelves(newShelves);
    }

    const debouncedHandler = useCallback(
        debounce(async (search: string) => {
            await filterShelves(search);
        }, 600),
        []
    )

    return (
        <form className='flex flex-row justify-center w-[1000px] items-center' onSubmit={(e) => filterShelves(e)}>
            <Input className='h-[50px] w-[650px]' variant='faded' type='text' label='Search' value={search} onValueChange={(value) => {
                setSearch(value);
                debouncedHandler(value);
            }} />

            <Dropdown>
                <DropdownTrigger>
                    <Button className='h-[50px] w-[175px] font-light text-[1.025rem] px-2' variant='faded'>Search by {filters[selectedSearchIndex]}</Button>
                </DropdownTrigger>
                <DropdownMenu selectionMode='single' selectedKeys={searchKeys} onSelectionChange={(value) => {
                    setSearchKeys(value as Set<string>);
                    filterShelves(search);
                }}>
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
                <DropdownMenu selectionMode='single' selectedKeys={sortKeys} onSelectionChange={(value) => {
                    setSortKeys(value as Set<string>);
                    filterShelves(search);
                }}>
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