import { Book } from '@/app/types/Book';
import { prisma } from '@/../lib/prisma';

export async function getBooks(user_id: number): Promise<Book[]> {
    const userWithBooks = await prisma.user.findFirst({
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
    return books;
}   

export async function postBook(key: string, title: string, author: string, isbn: string, rating: number, review: string, cover: string, r: number, g: number, b: number, user_id: number): Promise<void> {
    //check if book already exists using key
    //if not, create book
    //create user_book
    //create review
    console.log('in create book');
    const foundBook = await prisma.book.upsert({
    where: { key: key },
    update: {},
    create: {
        key: key,
        title: title,
        author: author,
        isbn: isbn,
        cover: cover,
        r: r,
        g: g,
        b: b
    }
    });
    console.log('found book', foundBook);

    await prisma.user_book.create({
    data: {
        userId: user_id,
        bookId: foundBook.id
    }
    });
    console.log('created user_book')

    await prisma.review.create({
    data: {
        userId: user_id,
        bookId: foundBook.id,
        rating: rating,
        review: review
    }
    });
    console.log('created review');
}

export async function putBook(book_id: number, rating: number, review: string, user_id: number): Promise<void> {
    await prisma.review.update({
    where: { bookId_userId: { bookId: book_id, userId: user_id } },
    data: {
        review: review,
        rating: rating
    }
    });
}

export async function deleteBook(book_id: number, user_id: number): Promise<void> {
    //delete book from user_book
    //delete review from review
    //check if that was the last reference to the book
    //if so, delete the book from books
    console.log('\n\nHHHHHHHHHHHHHHHHHHHHHH\n\nin delete book')
    await prisma.user_book.delete({
        where: { bookId_userId: { bookId: book_id, userId: user_id } }
    });
    console.log('deleted user_book');
    
    await prisma.review.delete({
        where: { bookId_userId: { bookId: book_id, userId: user_id } }
    });
    console.log('deleted review')
    
    const bookRefCount = await prisma.user_book.count({
        where: { bookId: book_id }
    });
    console.log('book ref count', bookRefCount);
    
    if (bookRefCount === 0) {
        await prisma.book.delete({
        where: { id: book_id }
        });
    }
    console.log('deleted book if zero refs');
}

