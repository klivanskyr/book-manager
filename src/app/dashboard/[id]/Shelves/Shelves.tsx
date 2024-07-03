import { Accordion, AccordionItem, Image, Link, Spinner } from "@nextui-org/react";
import { bookIcon } from "@/assets";
import { UserContext } from "@/app/types/UserContext";
import { useContext } from "react";
import { Table, Row, Column } from "@/app/components";
import { Book } from "@/app/types/Book";
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

    if (!user || !user.shelves || isLoading) {
        return (
            <div className="flex justify-center items-center h-[500px]">
                <Spinner className='' size='lg' />
            </div>
        );
    }
    return (
        <div className="mx-2 my-4">
          <Accordion className='' variant="splitted">
            {user.shelves.map((shelf) => (
              <AccordionItem key={shelf.shelfId} title={shelf.name} startContent={
                <Image 
                  className="p-1.5 w-[50px] h-[50px] bg-slate-50 border border-slate-200 rounded-full"
                  radius="lg"
                  src={bookIcon.src}
                />
              }>
                <BookTable shelf={shelf} />
                <div className="my-4 w-full flex flex-row justify-center items-center">
                  <Link href={`/dashboard/${user.userId}/shelf/${shelf.shelfId}`} className="text-white bg-blue-600 shadow-md rounded-full border py-[10px] px-[15px] ">View Shelf Details</Link>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
    );
}