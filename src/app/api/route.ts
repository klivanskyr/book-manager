import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";

function returnData(items: any, code: number, message: string): any {
    return { items, code, message };
}

export async function GET(req: NextRequest) {
    try {
        const client = await pool.connect();
        console.log('Connected to the database');
        let query = '';
        if (req.nextUrl.searchParams.get('type') === 'names') {
            query = 'SELECT username FROM users';
        } else {
            return NextResponse.json(returnData(null, 400, 'Invalid query type. Valid types are [names]'));
        }

        const result = await client.query(query);
        client.release();

        if (result.rows.length > 0) { //Successful query
            return NextResponse.json(returnData(result.rows, 200, 'Sucess, data found'));
        } else { //No data found
            return NextResponse.json(returnData(null, 404, 'No data found'));
        }
    } catch (err) {
        return NextResponse.json(returnData(null, 400, 'Failed to connect to the database: ' + err));
    }
}

export async function POST(req: NextRequest) {
    console.log('POST request');
    const body = await req.json();
    console.log(body);
    return NextResponse.json({ message: 'POST Return', message2: "hi" });
}





// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     console.log('\n\nenter handler\n\n')
//     const { type } = req.query;
    
//     if (req.method === 'GET') {
//         console.log('GET request');
//         try {
//             let client = null;
//             try {
//                 client = await pool.connect();
//                 console.log('Connected to the database');
//             } catch (err) {
//                 console.error('Failed to connect to the database:', err);
//             }

//             console.log('client', client);
//             let query = '';
//             if (type === 'names') {
//                 query = 'SELECT username FROM users';
//             } else {
//                 res.status(400).json({ message: 'Invalid query type. Valid types are [names]' });
//             }

//             const result = await client.query(query);
//             console.log('RESULT ==>', result);
//             client.release();

//             if (result.rows.length > 0) { //Successful query
//                 res.status(200).json({ items: result.rows });
//             } else { //No data found
//                 res.status(404).json({ message: 'No data found' });
//             }
//         } catch (error) {
//             console.log('ERROR ==>', error);
//             res.status(500).json({ message: 'Internal server error' });
//         }
//     } else {
//         console.log('Method Not Allowed');
//         res.setHeader('Allow', ['GET']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }