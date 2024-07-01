import { loadBook } from "@/app/db/db";
import { UserContext } from "@/app/types/UserContext";
import { database } from "@/firebase/firebase";
import { Select, SelectItem } from "@nextui-org/react";
import { Query, child, limitToFirst, limitToLast, onValue, orderByChild, orderByKey, orderByValue, query, ref, startAt } from "firebase/database";
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
    ]

    type Order = 'default' | 'reversed';
    const orderBooksByChild = (child: string, order: Order) => {
        if (!user || !user.user_id ) return;
        if (order === 'default') {
            const bookQuery = query(ref(database, `usersBooks/${user.user_id}`), orderByChild(child), limitToFirst(100)); //100 should be replaced with number of books on shelf
            onValue(bookQuery, async (snapshot) => {
                let childBookPromises: any[] = [];
                snapshot.forEach((childSnapshot) => {
                    childBookPromises.push(loadBook(childSnapshot));
                });
                const childBooks = await Promise.all(childBookPromises);
                setUser({ ...user, books: childBooks })
            });
        } else {
            const bookQuery = query(ref(database, `usersBooks/${user.user_id}`), orderByChild(child), limitToLast(100)); //100 should be replaced with number of books on shelf
            onValue(bookQuery, async (snapshot) => {
                let childBookPromises: any[] = [];
                snapshot.forEach((childSnapshot) => {
                    childBookPromises.push(loadBook(childSnapshot));
                });
                const childBooks = await Promise.all(childBookPromises);
                setUser({ ...user, books: childBooks.reverse() });
            });
        } 
    }

    useEffect(() => {
        if (!user) return;
        switch (value) {
            case SortOptions.TitleAZ: {
                orderBooksByChild('title', 'default');
                break;
            }
            case SortOptions.TitleZA: {
                orderBooksByChild('title', 'reversed');
                break;
            }
            case SortOptions.AuthorAZ: {
                orderBooksByChild('author', 'default');
                break;
            }

            case SortOptions.AuthorZA: {
                orderBooksByChild('title', 'reversed');
                break;
            }

            case SortOptions.AddedNewest: {
                orderBooksByChild('createdAt', 'default');
                break;
            }

            case SortOptions.AddedOldest: {
                orderBooksByChild('createdAt', 'reversed');
                break;
            }

            case SortOptions.RatingLH: {
                orderBooksByChild('rating', 'default');
                break;
            }

            case SortOptions.RatingHL: {
                orderBooksByChild('rating', 'reversed');
                break;
            }
        }

    }, [value]);


    
    return (
        <Select className='w-52' label="Sort By" selectedKeys={[value]} onChange={(e: any) => setValue(e.target.value)} >
            {sortOptions.map((option) => (
                <SelectItem key={option.key}>{option.value}</SelectItem>
            ))}
        </Select>
    )
}