"use server"
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";
export const borrowBook = async (params : BorrowBookParams) => {
    const {userId,  bookId} = params;
    try {
        const book = await db.select({availableCopies : books.availableCopies}).from(books).where(eq(books.id, bookId)).limit(1);

        if(!book.length || book[0].availableCopies <= 0) {
            return {
                success : false,
                message : "Book not available"
            }
        }

        const dueDate = dayjs().add(7, 'day').toDate().toDateString()

        const record = db.insert(borrowRecords).values({
            bookId,
            userId,
            dueDate,
            status : "BORROWED"
        })

        await db.update(books).set({availableCopies : book[0].availableCopies - 1}).where(eq(books.id, bookId))

        return {
            success : true,
            message : "Book borrowed successfully",
            data : JSON.parse(JSON.stringify(record))
        }

    } catch (error: any) {
        console.error(error);
        return {
            success :false,
            message : error.message
        }
    }
}