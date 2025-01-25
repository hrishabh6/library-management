"use client"
import { cn, getInitials } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Session } from 'next-auth'

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname()
  return (
    <header className='my-10 flex justify-between itens-center gap-5 mx-auto min-w-7 '>
      <Link href={`/`} className='flex gap-2 items-center'>
        <Image
          src="/icons/logo.svg"
          alt="logo"
          width={40}
          height={40}
        />
        <h1 className='text-white text-2xl font-bold'>BookWise</h1>
      </Link>
      <div className='flex items-center gap-5 text-white font-thin text-xl'>
        <Link href={"/home"}>
          <p>Home</p>
        </Link>
        <Link href={"/search"}>
          <p>Search</p>
        </Link>
        
        <Link href={"/my-profile"} className='flex gap-2 items-center'>
          <Avatar>
            <AvatarFallback className='bg-amber-100 text-black'>{getInitials(session?.user?.name || "IN")}</AvatarFallback>
          </Avatar>
          <p className='text-white font-semibold text-xl'>{session?.user?.name}</p>
        </Link>

      </div>
    </header>
  )
}

export default Header
