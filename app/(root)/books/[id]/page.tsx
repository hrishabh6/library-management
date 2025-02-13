import { auth } from '@/auth';
import BookOverview from '@/components/BookOverview';
import BookVideo from '@/components/BookVideo';
import { db } from '@/database/drizzle';
import { books } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({params} : {params : Promise<{id : string}>}) => {
    const id = (await params).id;
    const [bookDetails] = await db.select().from(books).where(eq(books.id, id)).limit(1)
    const session = await auth()
    if(!bookDetails) {
        redirect("/404")
    }


    
  return (
    <>
      <BookOverview
        {...bookDetails}
        userId={session?.user?.id as string}
      />
      <div className='book-details'>
        <div className='flex-[1.5]'>
            <section className='flex flex-col gap-7'>
                <h3>Book Trailer</h3>
                <BookVideo
                    
                />
            </section>
            <section className='mt-10 flex flex-col gap-7'>
                <h3>
                    Summary
                </h3>
                <div className='space-y-5 text-xl text-white'>
                    {bookDetails.summary.split('\n').map((para, index) => (
                        <p key={index}>{para}</p>
                    ))}
                </div>
            </section>
        </div>
        {/* similar books */}
      </div>
    </>
  )
}

export default page
