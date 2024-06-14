import { Book } from '@/app/types/Book';
import { prisma } from '@/../lib/prisma';
import chalk from 'chalk';

export async function getBooks(user_id: string): Promise<Book[]> {
    const userWithBooks = await prisma.user.findUnique({
        where: {
            id: user_id,
        },
        include: {
            User_book: {
                include: {
                    Book: {
                        include: {
                            Review: {
                                where: {
                                    userId: user_id, 
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    const bookObjects = userWithBooks ? userWithBooks?.User_book.map((userBook) => userBook.Book) : [];
    const books = bookObjects?.map((elt) => {
        return {
            id: elt?.id,
            key: elt?.key,
            title: elt?.title,
            author: elt?.author,
            review: elt?.Review[0]?.review ? elt.Review[0].review : '',
            rating: elt?.Review[0]?.rating ? elt.Review[0].rating : 0,
            isbn: elt?.isbn.toString(),
            coverImage: elt?.cover,
            bgColor: [elt?.r, elt?.g, elt?.b],
            bgLoaded: false,
            imgLoaded: false,
            selected: true //true because it is in the database
        };
    });
    //console.log(chalk.red(`getBooks books: ${JSON.stringify(books)}`));
    return books;
}   

export async function postBook(key: string, title: string, author: string, isbn: string, rating: number, review: string, cover: string, r: number, g: number, b: number, user_id: string): Promise<string> {
    //check if book already exists using key
    //if not, create book
    //create user_book
    //create review
    //console.log(chalk.red(`in postBook`));
    let foundBook = await prisma.book.findUnique({ where: { key: key } });
    //console.log(chalk.red(`after findUnique`)
    if (!foundBook) {
        //console.log(chalk.red(`Book not found, creating new book`));
        foundBook = await prisma.book.create({
            data: {
                key: key,
                title: title,
                author: author,
                isbn: isbn,
                cover: cover,
                r: r,
                g: g,
                b: b,
            }
        });
    }
    //console.log(chalk.red('after create'))

    await prisma.user_book.create({
    data: {
        userId: user_id,
        bookId: foundBook.id
    }
    });

    await prisma.review.create({
    data: {
        userId: user_id,
        bookId: foundBook.id,
        rating: rating,
        review: review
    }
    });
    //console.log(chalk.red(`Posted book: ${JSON.stringify(foundBook)}`));
    return foundBook.id;
}

export async function putBook(book_id: string, rating: number, review: string, user_id: string): Promise<void> {
    //console.log(chalk.red(`in putBook`));
    await prisma.review.update({
    where: { bookId_userId: { bookId: book_id, userId: user_id } },
    data: {
        review: review,
        rating: rating
    }
    });
    //console.log(chalk.red(`Posted Book : ${JSON.stringify(book_id)} ${JSON.stringify(rating)} ${JSON.stringify(review)} ${JSON.stringify(user_id)}`));
}

export async function deleteBook(book_id: string, user_id: string): Promise<void> {
    //delete book from user_book
    //delete review from review
    //check if that was the last reference to the book
    //if so, delete the book from books
    await prisma.user_book.delete({
        where: { bookId_userId: { bookId: book_id, userId: user_id } }
    });
    
    await prisma.review.delete({
        where: { bookId_userId: { bookId: book_id, userId: user_id } }
    });
    
    const bookRefCount = await prisma.user_book.count({
        where: { bookId: book_id }
    });
    
    if (bookRefCount === 0) {
        await prisma.book.delete({
        where: { id: book_id }
        });
    }
    //console.log(chalk.red(`Deleted Book : ${JSON.stringify(book_id)} ${JSON.stringify(user_id)}`));
}

