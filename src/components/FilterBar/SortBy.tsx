export default function SortBy() {
    return (
        <div>
            SortBy
        </div>
    )
}

// import { UserContext } from "@/types/UserContext";
// import { Select, SelectItem } from "@nextui-org/react";
// import { useContext, useEffect, useState } from "react";
// import { Book } from "@/types/Book";

// const enum SortOptions {
//     TitleAZ = 'Title A to Z',
//     TitleZA = 'Title Z to A',
//     AuthorAZ = 'Author A to Z',
//     AuthorZA = 'Author Z to A',
//     AddedNewest = 'Added Recently',
//     AddedOldest = 'Added Oldest',
//     RatingHL = 'Rating High to Low',
//     RatingLH = 'Rating Low to High',
//     ReviewLengthHL = 'Review Length High to Low',
//     ReviewLengthLH = 'Review Length Low to High',
// }

// export default function SortBy({ isLoading, setIsLoading }: { isLoading: boolean, setIsLoading: Function }) {
//     const { user, setUser } = useContext(UserContext);
//     const [value, setValue] = useState(SortOptions.TitleAZ);

//     const sortOptions = [
//         { key : SortOptions.TitleAZ, value: SortOptions.TitleAZ },
//         { key : SortOptions.TitleZA, value: SortOptions.TitleZA },
//         { key : SortOptions.AuthorAZ, value: SortOptions.AuthorAZ },
//         { key : SortOptions.AuthorZA, value: SortOptions.AuthorZA },
//         { key : SortOptions.AddedNewest, value: SortOptions.AddedNewest },
//         { key : SortOptions.AddedOldest, value: SortOptions.AddedOldest },
//         { key : SortOptions.RatingHL, value: SortOptions.RatingHL },
//         { key : SortOptions.RatingLH, value: SortOptions.RatingLH },
//     ]

//     type Order = 'default' | 'reversed';
   
//     useEffect(() => {
//         console.log('sorting books')
//         if (!user) return;
//         const sort = async () => {
//             setIsLoading(true);
//             switch (value) {
//                 case SortOptions.TitleAZ: {
//                     setUser({ ...user, books: await getBooks(user.user_id, { field: 'title', direction: 'asc' }) as []});
//                     setIsLoading(false);
//                     break;
//                 }
//                 case SortOptions.TitleZA: {
//                     setUser({ ...user, books: await getBooks(user.user_id, { field: 'title', direction: 'desc' }) as []});
//                     setIsLoading(false);
//                     break;
//                 }
//                 case SortOptions.AuthorAZ: {
//                     setUser({ ...user, books: await getBooks(user.user_id, { field: 'author', direction: 'asc' }) as []});
//                     setIsLoading(false);
//                     break;
//                 }
//                 case SortOptions.AuthorZA: {
//                     setUser({ ...user, books: await getBooks(user.user_id, { field: 'author', direction: 'desc' }) as []});
//                     setIsLoading(false);
//                     break;
//                 }
//                 case SortOptions.AddedNewest: {
//                     setUser({ ...user, books: await getBooks(user.user_id, { field: 'createdAt', direction: 'desc' }) as []});
//                     setIsLoading(false);
//                     break;
//                 }
//                 case SortOptions.AddedOldest: {
//                     setUser({ ...user, books: await getBooks(user.user_id, { field: 'createdAt', direction: 'asc' }) as []});
//                     setIsLoading(false);
//                     break;
//                 }
//                 case SortOptions.RatingLH: {
//                     const books: Book[] = await getBooks(user.user_id) as [];
//                     books.sort((book1, book2) => book1.rating - book2.rating);
//                     setUser({ ...user, books });
//                     setIsLoading(false);
//                     break;
//                 }
//                 case SortOptions.RatingHL: {
//                     const books: Book[] = await getBooks(user.user_id) as [];
//                     books.sort((book1, book2) => book2.rating - book1.rating);
//                     setUser({ ...user, books });
//                     setIsLoading(false);
//                     break;
//                 }
//             }
//         }

//         sort();

//     }, [value]);


    
//     return (
//         <Select className='w-52' label="Sort By" selectedKeys={[value]} onChange={(e: any) => setValue(e.target.value)} >
//             {sortOptions.map((option) => (
//                 <SelectItem key={option.key}>{option.value}</SelectItem>
//             ))}
//         </Select>
//     )
// }