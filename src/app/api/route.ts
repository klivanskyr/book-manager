import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";
import { Book } from "../Manager/Book"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.nextUrl);
    const params = Array.from(searchParams);
    console.log(params);

    switch (params[0][0]) {
        case "getUserId":
            if (params.length != 2 || params[1][0] !== "email") {
                return NextResponse.json({ code: 400, message: "Invalid request, getUserId requires email parameter" });
            }
            const email = params[1][1];
            const userId = await getUserId(email);
            if (!userId) {
                return NextResponse.json({ code: 404, message: "User not found" });
            }
            return NextResponse.json({ code: 200, userId: userId });
        
        case "loadBooks":
            if (params.length != 2 || params[1][0] !== "user_id") {
                return NextResponse.json({ code: 400, message: "Invalid request, loadBooks requires user_id parameter" });
            }
            const user_id = parseInt(params[1][1]);
            const books = await loadBooks(user_id);
            return NextResponse.json({ code: 200, books: books });
    }
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.nextUrl);
    const params = Array.from(searchParams);
    console.log(params);

    switch (params[0][0]) {
        case "deleteBook":
            if (params.length != 3 || params[1][0] !== "book_id" || params[2][0] !== "user_id") {
                return NextResponse.json({ code: 400, message: "Invalid request, deleteBook requires book_id and user_id parameters" });
            }
            const book_id = parseInt(params[1][1]);
            const user_id = parseInt(params[2][1]);
            await deleteBook(book_id, user_id);
            return NextResponse.json({ code: 200, message: "Book deleted" });
    }
} 

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.nextUrl);
    const params = Array.from(searchParams);
    console.log(params);

    switch (params[0][0]) {
        case "createBook":
            console.log('\n\nparameters\n\n', params);
            if (params.length != 12 || params[1][0] !== "key" || params[2][0] !== "title" || params[3][0] !== "author" || params[4][0] !== "isbn" || params[5][0] !== "rating" || params[6][0] !== "review" || params[7][0] !== "cover" || params[8][0] !== "r" || params[9][0] !== "g" || params[10][0] !== "b" || params[11][0] !== "user_id") {
                return NextResponse.json({ code: 400, message: "Invalid request, createBook requires key, title, author, isbn, rating, review, cover, r, g, b, and user_id parameters" });
            }
            const key = params[1][1];
            const title = params[2][1];
            const author = params[3][1];
            const isbn = params[4][1];
            const rating = parseInt(params[5][1]);
            const review = params[6][1];
            const cover = params[7][1];
            const r = parseInt(params[8][1]);
            const g = parseInt(params[9][1]);
            const b = parseInt(params[10][1]);
            const user_id = parseInt(params[11][1]);
            await createBook(key, title, author, isbn, rating, review, cover, r, g, b, user_id);
            return NextResponse.json({ code: 200, message: "Book created" });
    }
}

export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.nextUrl);
    const params = Array.from(searchParams);
    console.log(params);

    switch (params[0][0]) {
        case "updateReview":
            if (params.length != 5 || params[1][0] !== "book_id" || params[2][0] !== "rating" || params[3][0] !== "review" || params[4][0] !== "user_id") {
                return NextResponse.json({ code: 400, message: "Invalid request, updateReview requires book_id, rating, review, and user_id parameters" });
            }
            const book_id = parseInt(params[1][1]);
            const rating = parseInt(params[2][1]);
            const review = params[3][1];
            const user_id = parseInt(params[4][1]);
            await updateReview(book_id, rating, review, user_id);
            return NextResponse.json({ code: 200, message: "Review updated" });
    }
}


async function getUserId(email: string): Promise<number | null> {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });
  
    if (!user) {
      return null;
    }
  
    return user.id;
}
  
async function loadBooks(user_id: number): Promise<Book[]> {
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
       
async function deleteBook(book_id: number, user_id: number): Promise<void> {
    //delete book from user_book
    //delete review from review
    //check if that was the last reference to the book
    //if so, delete the book from books
    console.log('in delete book')
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
  
async function createBook(key: string, title: string, author: string, isbn: string, rating: number, review: string, cover: string, r: number, g: number, b: number, user_id: number): Promise<void> {
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
  
export async function updateReview(book_id: number, rating: number, review: string, user_id: number): Promise<void> {
    await prisma.review.update({
    where: { bookId_userId: { bookId: book_id, userId: user_id } },
    data: {
        review: review,
        rating: rating
    }
    });
}
  
//   ######################################################
//   CLEARS THE ENTIRE DATABASE
//   export async function CLEARALL(): Promise<void> {
//       await prisma.review.deleteMany({});
//       await prisma.user_book.deleteMany({});
//       await prisma.book.deleteMany({});
//       await prisma.user.deleteMany({});
//   }
//   ######################################################