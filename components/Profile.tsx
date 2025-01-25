import Image from 'next/image'
import React from 'react'
import BorrowedBooks from './BorrowedBooks'
import { Avatar, AvatarFallback } from './ui/avatar'
import { getInitials } from '@/lib/utils'
import { auth } from '@/auth'

const Profile = async () => {
    const session = await auth()
    return (
        <div className='flex justify-between max-w-7xl'>
            <div className='flex flex-col max-md:w-full bg-gradient-to-b from-[#232839] to-[#12141D] rounded-xl  px-8 pb-6'>
                <Image
                    src={`/images/badge.png`}
                    alt='badge'
                    height={50}
                    width={50}
                    className='mx-auto relative top-[-15px]'
                />
                <div className='flex justify-center items-center gap-5'>
                    <Avatar>
                        <AvatarFallback className='bg-amber-100 text-black'>{getInitials(session?.user?.name || "IN")}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className='flex items-center gap-2'>
                            <Image
                                src={`/images/verified.png`}
                                alt='verified_badge'
                                height={18}
                                width={18}
                            />
                            <p className='text-[#D6E0FF]'>verified student</p>
                        </div>

                    </div>
                </div>

            </div>

            <BorrowedBooks />

        </div>
    )
}

export default Profile
