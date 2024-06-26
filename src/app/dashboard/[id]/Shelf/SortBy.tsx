import { UserContext } from "@/app/types/UserContext";
import { database } from "@/firebase/firebase";
import { Select, SelectItem } from "@nextui-org/react";
import { onValue, orderByChild, orderByValue, query, ref } from "firebase/database";
import { useContext, useEffect, useState } from "react";

const enum SortOptions {
    TitleAZ = 'Title A to Z',
    TitleZA = 'Title Z to A',
    AuthorAZ = 'Author A to Z',
    AuthorZA = 'Author Z to A',
    AddedNewest = 'Added Recently',
    AddedOldest = 'Added Oldest',
    RatingHL = 'Rating High to Low',
    RatingLH = 'Rating Low to High',
    ReviewLengthHL = 'Review Length High to Low',
    ReviewLengthLH = 'Review Length Low to High',
}

export default function SortBy() {
    const { user, setUser } = useContext(UserContext);
    const [value, setValue] = useState(SortOptions.TitleAZ);

    const sortOptions = [
        { key : SortOptions.TitleAZ, value: SortOptions.TitleAZ },
        { key : SortOptions.TitleZA, value: SortOptions.TitleZA },
        { key : SortOptions.AuthorAZ, value: SortOptions.AuthorAZ },
        { key : SortOptions.AuthorZA, value: SortOptions.AuthorZA },
        { key : SortOptions.AddedNewest, value: SortOptions.AddedNewest },
        { key : SortOptions.AddedOldest, value: SortOptions.AddedOldest },
        { key : SortOptions.RatingHL, value: SortOptions.RatingHL },
        { key : SortOptions.RatingLH, value: SortOptions.RatingLH },
        { key : SortOptions.ReviewLengthHL, value: SortOptions.ReviewLengthHL },
        { key : SortOptions.ReviewLengthLH, value: SortOptions.ReviewLengthLH },
    ]

    useEffect(() => {
        if (!user) return;
        console.log('Sorting by:', value);
        if (value === SortOptions.TitleAZ) {
            const titleAZref = query(ref(database, `usersBooks/${user.user_id}`), orderByChild('title'));
        }
    }, [user, value]);


    
    return (
        <Select className='w-52' label="Sort By" selectedKeys={[value]} onChange={(e: any) => setValue(e.target.value)} >
            {sortOptions.map((option) => (
                <SelectItem key={option.key}>{option.value}</SelectItem>
            ))}
        </Select>
    )
}