import { NextResponse, NextRequest } from "next/server";
import { getBooks, postBook, putBook, deleteBook } from './helpers';


//loadBooks
export async function GET(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.nextUrl);
    const params = Array.from(searchParams);
    console.log(params);

    if (params.length === 0) {
        return NextResponse.json({ code: 400, message: "No parameters provided, requires user_id" });
    } else if (params.length > 1) {
        return NextResponse.json({ code: 400, message: "Too many parameters provided, requires user_id" });
    } else {
        const user_id = params.find(([key, value]) => key === 'user_id');

        if (user_id) {
            const books = await getBooks(parseInt(user_id[1]));
            return NextResponse.json({ code: 200, books: books });
        } else {
            return NextResponse.json({ code: 400, message: "Missing parameters, requires user_id" });
        }
    }
}

//createBook
export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const { key, title, author, isbn, rating, review, cover, r, g, b, user_id } = body;

        if (key === undefined || title === undefined || author === undefined || isbn === undefined || rating === undefined || review === undefined || cover === undefined || r === undefined || g === undefined || b === undefined || user_id === undefined) {
            return NextResponse.json({ code: 400, message: `Missing parameters, requires key, title, author, isbn, rating, review, cover, r, g, b, user_id, inputted ${key} , ${title} , ${author}, ${isbn}, ${rating}, ${review}, ${cover}, ${r}, ${g}, ${b}, ${user_id}` });
        }

        const id = await postBook(key, title, author, isbn, rating, review, cover, r, g, b, user_id);
        if (!id) {
            return NextResponse.json({ code: 400, message: "Book not created" });
        }

        return NextResponse.json({ code: 200, bookId: id });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ code: 400, message: "Invalid request body" });
    }
}


//updateReview
export async function PUT(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const { book_id, rating, review, user_id } = body;

        if (book_id === undefined || rating === undefined || review === undefined || user_id === undefined) {
            return NextResponse.json({ code: 400, message: "Missing parameters, requires book_id, rating, review, user_id" });
        }

        await putBook(book_id, rating, review, user_id);

        return NextResponse.json({ code: 200, message: "Review updated for user" });

    } catch (error) {
        return NextResponse.json({ code: 400, message: "Invalid request body" });
    }
}


//deleteBook
export async function DELETE(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.nextUrl);
    const params = Array.from(searchParams);
    console.log(params);

    if (params.length === 0) {
        return NextResponse.json({ code: 400, message: "No parameters provided, requires book_id, user_id" });
    } else if (params.length > 2) {
        return NextResponse.json({ code: 400, message: "Too many parameters provided, requires book_id, user_id" });
    } else if (params.length < 2) {
        return NextResponse.json({ code: 400, message: "Missing parameters, requires book_id, user_id" });
    } else {
        const book_id = params.find(([key, value]) => key === 'book_id');
        const user_id = params.find(([key, value]) => key === 'user_id');

        if (book_id && user_id) {
            await deleteBook(parseInt(book_id[1]), parseInt(user_id[1]));
            return NextResponse.json({ code: 200, message: "Book deleted for user" });
        } else {
            return NextResponse.json({ code: 400, message: "Missing parameters, requires book_id, user_id" });
        }
    }
}