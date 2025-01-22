"use client"
import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, UseFormReturn, Path } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { bookSchema } from '@/lib/validations'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '../ui/button'
import FileUpload from '../FileUpload'
import ColorPicker from './ColorPicker'
import { createBook } from '@/lib/admin/actions/book'
import { toast } from '@/hooks/use-toast'


interface Props extends Partial<Book> {
    type?: "create" | "update";
}

const BookForm = ({ type, ...book }: Props) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof bookSchema>>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: "",
            author: "",
            genre: "",
            rating: 1,
            totalCopies: 1,
            description: "",
            coverUrl: "",
            coverColor: "",
            videoUrl: "",
            summary: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof bookSchema>) => {
        console.log("submitting...")
        const result = await createBook(values);
        if (result.success) {
            toast({
                title: "Book Created",
                description: "Book has been successfully created",
                
            })
            router.push(`/admin/books/${result.data.id}`);
        } else {
            toast({
                title: "Error",
                description: result.message ?? "An error occurred",
                variant: "destructive"
            })
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name={"title"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Book Title
                            </FormLabel>
                            <FormControl className='flex flex-col gap-1'>
                                <Input
                                    placeholder='Enter book title'
                                    required
                                    className='book-form_input'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={"author"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Author
                            </FormLabel>
                            <FormControl className='flex flex-col gap-1'>
                                <Input
                                    placeholder='Book Author'
                                    required
                                    className='book-form_input'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={"genre"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Book Genre
                            </FormLabel>
                            <FormControl className='flex flex-col gap-1'>
                                <Input
                                    placeholder='Book Genre'
                                    required
                                    className='book-form_input'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={"rating"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Book Rating
                            </FormLabel>
                            <FormControl className='flex flex-col gap-1'>
                                <Input
                                    type='number'
                                    min={1}
                                    max={5}
                                    placeholder='Enter book title'
                                    required
                                    className='book-form_input'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={"totalCopies"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Total Copies
                            </FormLabel>
                            <FormControl className='flex flex-col gap-1'>
                                <Input
                                    type='number'
                                    min={1}
                                    max={10000}
                                    placeholder='Enter book title'
                                    required
                                    className='book-form_input'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={"coverUrl"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Book Image
                            </FormLabel>
                            <FormControl className='flex flex-col gap-1'>
                                <FileUpload
                                    type='image'
                                    accept='image/*'
                                    placeHolder='Upload Book Image'
                                    folder='books/covers'
                                    variant='light'
                                    onFileChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={"coverColor"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Primary Color
                            </FormLabel>
                            <FormControl className='flex flex-col gap-1'>
                                <ColorPicker
                                    value={field.value}
                                    onPickerChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={"description"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Book Description
                            </FormLabel>
                            <FormControl className='flex flex-col gap-1'>
                                <Textarea
                                    placeholder='Enter book description'
                                    required
                                    className='book-form_input'
                                    {...field}
                                    rows={10}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={"videoUrl"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Book Trailer
                            </FormLabel>
                            <FormControl className='flex flex-col gap-1'>
                            <FileUpload
                                    type='video'
                                    accept='video/*'
                                    placeHolder='Upload Book Trailer'
                                    folder='books/videos'
                                    variant='light'
                                    onFileChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={"summary"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Book Summary
                            </FormLabel>
                            <FormControl className='flex flex-col gap-1'>
                                <Textarea
                                    placeholder='Enter book Summary'
                                    required
                                    className='book-form_input'
                                    {...field}
                                    rows={10}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className='book-form_btn text-white' type="submit">Submit</Button>
            </form>
        </Form>

    );
};

export default BookForm;
