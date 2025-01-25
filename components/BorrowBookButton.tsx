"use client"
import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { borrowBook } from '@/lib/actions/book'

interface props {
    bookId : string,
    userId : string,
    borrowingEligibility : {
        isEligible : boolean,
        message : string
    }
}

const BorrowBookButton = ({bookId, userId, borrowingEligibility : {isEligible, message}} : props) => {

    const router = useRouter()
    const [borrowing , setBorrowing] = React.useState(false)

    const handleBorrow = async () => {
        if(!isEligible) {
            toast({
                title : "Error",
                description : message,
                variant : "destructive"
            })
        }
        setBorrowing(true)

        try {
            const result = await borrowBook({bookId, userId})

            if(result.success){
                toast({
                    title:  "Success",
                    description : "Book borrowed successfully",
                    variant : "default"
                })
                router.push("/my-profile")
            } else {
                toast({
                    title : "Error",
                    description : result.message,
                    variant : "destructive"
                })
            }


        } catch (error: any) {
            toast({
                title : "Error",
                description : "An error occured while borrowing the book",
                variant : "destructive"
            })
            
        } finally {
            setBorrowing(false)
        }
    }

    return (
        <Button
            className="book-overview_btn"
            onClick={handleBorrow}
            disabled={!isEligible || borrowing}
        >
            <Image src="/icons/book.svg" alt="book" width={20} height={20} />
            <p className="font-bebas-neue text-xl text-dark-100">
                {borrowing ? "Borrowing..." : "Borrow Book"}
            </p>
        </Button>
    )
}

export default BorrowBookButton
