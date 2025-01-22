import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <section className='w-full rounded-2xl bg-white p-7'>
      <div className='flex flex-wra items-center justify-between gap-2'>
        <h2 className='text-xl font-semibold'>All Books</h2>
        <Button className='bg-primary-admin' asChild>
            <Link href='/admin/books/new' className='text-light-100'>
                + Create a new book
            </Link>
        </Button>
      </div>
      <div>
        <p className='mt-7 w-full overflow-hidden'>
            
        </p>
      </div>
    </section>
  )
}

export default page