'use client';

import { ReactElement, useContext, useEffect } from 'react';

import { UserContext, User, getUserId, loadBooks } from '../UserContext';
import Search from './InputArea';
import Shelf from './Shelf';

const TESTEMAIL = 'test@test.com';
export default function Manager(): ReactElement {
  const { user, setUser } = useContext(UserContext);

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

      const user: User = {
        user_id: id,
        books: books
      }

      setUser(user);
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col items-center h-auto'>
      {user ? <Search /> : null}
      {user ? <Shelf /> : null}
    </div>
  )
}