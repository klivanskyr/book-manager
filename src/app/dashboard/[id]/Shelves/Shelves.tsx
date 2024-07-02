import { Accordion, AccordionItem, Image, Spinner } from "@nextui-org/react";
import { bookIcon } from "@/assets";
import { UserContext } from "@/app/types/UserContext";
import { useContext } from "react";
import { Table, Row, Column } from "@/app/components";
import { Book } from "@/app/types/Book";

export default function Shelves({ isLoading, setIsLoading }: { isLoading: boolean, setIsLoading: Function }) {
    const { user, setUser } = useContext(UserContext);

    function BookTable({ books }: { books: Book[] }) {
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

      const rows: Row[] = books.map((book) => (
        {
          key: book.id,
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

    if (!user || isLoading) {
        return (
            <div className="flex justify-center items-center h-[500px]">
                <Spinner className='' size='lg' />
            </div>
        );
    }
    return (
        <div className="mx-2">
          <Accordion className='' variant="splitted">
            {user.shelves.map((shelf) => (
              <AccordionItem key={shelf.shelfId} title={shelf.name} startContent={
                <Image 
                  className="p-1.5 w-[50px] h-[50px] bg-slate-50 border border-slate-200 rounded-full"
                  radius="lg"
                  src={bookIcon.src}
                />
              }>
                <BookTable books={shelf.books} />
              </AccordionItem>
            ))}
          </Accordion>
        </div>
    );
}