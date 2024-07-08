import { Accordion, AccordionItem, Image, Link, Spinner } from "@nextui-org/react";
import { bookIcon } from "@/assets";
import { UserContext } from "@/app/types/UserContext";
import { useContext, useState } from "react";
import { Table, Row, Column } from "@/app/components";
import { Shelf } from "@/app/types/Shelf";

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
            {shelves.map((shelf, i) => (
              <AccordionItem key={shelf.shelfId + `${i}`} title={shelf.name} startContent={<Image  className="p-1.5 w-[50px] h-[50px] bg-slate-50 border border-slate-200 rounded-full" radius="lg" src={bookIcon.src}/>}>
                <div className="m-1/2 w-full flex flex-row justify-center items-center"><Link href={`/dashboard/${userId}/shelf/${shelf.shelfId}`} className="p-1">View Shelf Details</Link></div>
                <BookTable shelf={shelf} />
            </AccordionItem>
            ))}
          </Accordion>
        </div>
    );
}