'use client';

import { ReactElement, useEffect, useState } from 'react';

import Search from './Search'
import Shelf from './Shelf'
import { Userinfo, getUserId, loadBooks } from './Userinfo'

const TESTEMAIL = 'test@test.com';

export default function Manager(): ReactElement {
  const [user, setUser] = useState<Userinfo | null>(null);

  //fetches books on load
  useEffect(() => {
    const fetchData = async () => {
      const id = await getUserId(TESTEMAIL);
      if (!id) {
        return;
      }

      const res = await loadBooks(id);
      console.log('\n\nresults:', res);
      const books = res.map((book) => {
        console.log(book);
        return book;
      })

      const user: Userinfo = {
        user_id: id,
        books: books
      }

      setUser(user);
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col items-center h-auto'>
      {user && <Search user={user} />}
      {user && <Shelf user={user} />}
    </div>
  )
}