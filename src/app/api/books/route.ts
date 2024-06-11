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
    const { searchParams } = new URL(req.nextUrl);
    const params = Array.from(searchParams);
    console.log(params);

    if (params.length === 0) {
        return NextResponse.json({ code: 400, message: "No parameters provided, requires key, title, author, isbn, rating, review, cover, r, g, b, user_id" });
    } else if (params.length > 11) {
        return NextResponse.json({ code: 400, message: "Too many parameters provided, requires key, title, author, isbn, rating, review, cover, r, g, b, user_id" });
    } else if (params.length < 11) {
        return NextResponse.json({ code: 400, message: "Missing parameters, requires key, title, author, isbn, rating, review, cover, r, g, b, user_id" });
    } else {
        const key = params.find(([key, value]) => key === 'key');
        const title = params.find(([key, value]) => key === 'title');
        const author = params.find(([key, value]) => key === 'author');
        const isbn = params.find(([key, value]) => key === 'isbn');
        const rating = params.find(([key, value]) => key === 'rating');
        const review = params.find(([key, value]) => key === 'review');
        const cover = params.find(([key, value]) => key === 'cover');
        const r = params.find(([key, value]) => key === 'r');
        const g = params.find(([key, value]) => key === 'g');
        const b = params.find(([key, value]) => key === 'b');
        const user_id = params.find(([key, value]) => key === 'user_id');

        if (key && title && author && isbn && rating && review && cover && r && g && b && user_id) {
            await postBook(key[1], title[1], author[1], isbn[1], parseInt(rating[1]), review[1], cover[1], parseInt(r[1]), parseInt(g[1]), parseInt(b[1]), parseInt(user_id[1]));
            return NextResponse.json({ code: 200, message: "Book created for user" });
        } else {
            return NextResponse.json({ code: 400, message: "Missing parameters, requires key, title, author, isbn, rating, review, cover, r, g, b, user_id" });
        }
    }
}


//updateReview
export async function PUT(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.nextUrl);
    const params = Array.from(searchParams);
    console.log(params);

    if (params.length === 0){
        return NextResponse.json({ code: 400, message: "No parameters provided, requires book_id, rating, review, user_id" });
    } else if (params.length > 4) {
        return NextResponse.json({ code: 400, message: "Too many parameters provided, requires book_id, rating, review, user_id" });
    } else if (params.length < 4) {
        return NextResponse.json({ code: 400, message: "Missing parameters, requires book_id, rating, review, user_id" });
    } else {
        const book_id = params.find(([key, value]) => key === 'book_id');
        const rating = params.find(([key, value]) => key === 'rating');
        const review = params.find(([key, value]) => key === 'review');
        const user_id  = params.find(([key, value]) => key === 'user_id');

        if (book_id && rating && review && user_id) {
            await putBook(parseInt(book_id[1]), parseInt(rating[1]), review[1], parseInt(user_id[1]));
            return NextResponse.json({ code: 200, message: "Review updated for user" });
        } else {
            return NextResponse.json({ code: 400, message: "Missing parameters, requires book_id, rating, review, user_id" });
        }
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