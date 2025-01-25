import React from 'react'
import BookCard from './BookCard'

interface props {
  title: string,
  books: Book[]
  containerClassName?: string
}

const BookListVertical = ({ title, books, containerClassName }: props) => {
  {
    if (books.length < 2) return null
  return (
    <section className={containerClassName}>
      <h2 className='font-bebas-neue text-4xl text-light-100'>{title}</h2>
        <ul className='mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2'>
          {
            books.map((book) => (
              <BookCard key={book.title} {...book} />
            ))
          }
        </ul>

    </section>
  )
}
}

export default BookListVertical
