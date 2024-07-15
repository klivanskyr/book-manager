import { Shelf } from "@/types";

export type Filter = 'none' | 'followed' | 'trending';

export default function Filter({ children, shelves, filter }: { children: (filterShelves: Shelf[]) => React.ReactNode, shelves: Shelf[], filter: Filter }): JSX.Element {

    function filterShelves(): Shelf[] {
        switch (filter) {
            case 'none':
                return shelves;

            case 'followed':
                return shelves.filter((shelf) => shelf.following);

            case 'trending': //Shows top 5 shelves with most followers
                return shelves.sort((a, b) => b.followers - a.followers).filter((shelf, index) => index < 5);

            default:
                return shelves;
        }
    }

    return (
        <>
            {children(filterShelves())}
        </>
    )
}