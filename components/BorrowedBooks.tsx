import React from 'react'
import { sampleBooks } from '@/constants'
import BookListVertical from './BookListVertical'

const BorrowedBooks = () => {
  return (
    <div>
      <BookListVertical books={sampleBooks} title='Borrowed Books' />
    </div>
  )
}

export default BorrowedBooks
