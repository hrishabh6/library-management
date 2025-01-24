import ImageKit from 'imagekit';
import dummyBooks from '../dummyBooks.json';
import { books } from './schema';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

config({
    path : ".env.local"
})

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({client : sql});


const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
})

const uploadToImageKit = async (url: string, fileName: string, folder: string) => {
    try {
        const response = await imageKit.upload({
            file : url,
            fileName,
            folder
        })
        return response.filePath
    } catch (error) {
        console.log('Error uploading to ImageKit');
        console.log(error);     
    }
}

const seed = async () => {
    console.log('Seed is running');
    // Seed the database
    try {
        for(const book of dummyBooks) {
            console.log('Seeding book image', book.title);
            const coverUrl = await uploadToImageKit(book.coverUrl, `${book.title}.jpg`, "/books/covers" )
            if(!coverUrl) {
                console.log('Error uploading book cover', book.title, book.coverUrl);
                continue;
            }
            console.log('Uploading Trailer', book.videoUrl);
            const videoUrl = await uploadToImageKit(book.videoUrl, `${book.title}.mp4`, "/books/videos" )
            if(!videoUrl) {
                console.log('Error uploading book cover', book.title, book.coverUrl);
                continue;
            }
            console.log('Inserting book', book.title);
            await db.insert(books).values({
                ...book,
                coverUrl: coverUrl || '',
                videoUrl: videoUrl || ''
            })
        }
        console.log('Database seeded successfully');
    } catch (error) {
        console.log('Error seeding the database');
        return error;
    }
}

seed();