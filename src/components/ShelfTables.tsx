import { Accordion, AccordionItem, Image, Link } from "@nextui-org/react";
import { BookIcon } from "@/assets";
import { Table, Row, Column } from "@/components";
import { Shelf } from "@/types/Shelf";

export default function Shelves({ shelves, userId }: { userId: string, shelves: Shelf[] }) {
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

  return (
      <div className="p-1 py-4 h-full w-full">
        <Accordion variant="splitted" selectionMode="multiple">
          {shelves.sort((_, b) => b.shelfId === 'all-books' ? 1 : -1).map((shelf, i) => (
            <AccordionItem key={shelf.shelfId + `${i}`} title={shelf.name} startContent={<BookIcon className='w-[40px] h-[40px]'/>}>
              <div className="m-1/2 w-full flex flex-row justify-center items-center"><Link href={`${shelf.createdById === userId ? `/dashboard/${userId}/shelf/${shelf.shelfId}` : `explore/${userId}/shelf/${shelf.shelfId}`}`} className="p-1">View Shelf Details</Link></div>
              <BookTable shelf={shelf} />
          </AccordionItem>
          ))}
        </Accordion>
      </div>
  );
}