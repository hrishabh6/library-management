"use client"
import AuthForm from '@/components/AuthForm'
import {  signUpSchema } from '@/lib/validations'
import React from 'react'

const page = () => {
  return (
    <AuthForm
        type='SIGN_UP'
        schema={signUpSchema}
        defaultValues={{fullname: "", email: '', password: '', universityId: 0,  universityCard : ""}}
        onSubmit={async (data) => {
            console.log(data);
            return { success: true };
        }}
    />
  )
}

export default page
