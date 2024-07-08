import { Accordion, AccordionItem, Image, Link, Spinner } from "@nextui-org/react";
import { bookIcon } from "@/assets";
import { UserContext } from "@/app/types/UserContext";
import { useContext } from "react";
import { Table, Row, Column } from "@/app/components";
import { Shelf } from "@/app/types/Shelf";

export default function Shelves({ isLoading, setIsLoading }: { isLoading: boolean, setIsLoading: Function }) {
    const { user, setUser } = useContext(UserContext);

    function BookTable({ shelf }: { shelf: Shelf }) {
      const columns: Column[] = [
        {
          key: 'title',
          label: 'Title',
        },
        {
          key: 'author',
          label: 'Author',
        },
        {
          key: 'isbn',
          label: 'ISBN',
        },
        {
          key: 'rating',
          label: 'Rating',
        }
      ]

      const rows: Row[] = shelf.books.map((book, i) => (
        {
          key: `${i}`,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          rating: book.rating,
        }
      ))

      return (
        <Table rows={rows} columns={columns} />
      )
    }

    function AccordionShelves() {
      if (!user?.shelves) {
        return <div className="w-full h-full flex flex-row items-center justify-center"><Spinner size="lg" /></div>
      } else {
        const test = ['Shelf 1', 'Shelf 2']
        const content = [<h1>content</h1>, <h1>content</h1>, <h1>content</h1>, <h1>content</h1>, <h1>content</h1>, <h1>content</h1>, <h1>content</h1>, <h1>content</h1>, <h1>content</h1>, <h1>content</h1>, ]
        setIsLoading(false);
        return (
          <Accordion variant="splitted" selectionMode="multiple">
          {user.shelves.map((shelf, i) => (
            <AccordionItem key={shelf.shelfId + `${i}`} title={shelf.name} startContent={<Image  className="p-1.5 w-[50px] h-[50px] bg-slate-50 border border-slate-200 rounded-full" radius="lg" src={bookIcon.src}/>}>
              <div className="m-1/2 w-full flex flex-row justify-center items-center">{user && <Link href={`/dashboard/${user.userId}/shelf/${shelf.shelfId}`} className="p-1">View Shelf Details</Link>}</div>
              <BookTable shelf={shelf} />
          </AccordionItem>
          ))}
        </Accordion>
        );
      }
      
    }

    return (
        <div className="p-1 py-4 h-full w-full">
          <AccordionShelves />
        </div>
    );
}