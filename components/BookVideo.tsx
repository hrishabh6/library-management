"use client"
import config from '@/lib/config'
import { IKVideo, ImageKitProvider } from 'imagekitio-next'
import React from 'react'

const BookVideo = () => {
    const [loading, setLoading] = React.useState(false);
    const videoUrl = "books/videos/stock-footage-an-open-book-is-on-fire-big-bright-flame-burning-paper-on-old-publication-in-the-dark-book.webm/ik-video.mp4?updatedAt=1737739265517"
  return (
    <ImageKitProvider publicKey={config.env.imagekit.publicKey} urlEndpoint={config.env.imagekit.urlEndpoint} >
        <IKVideo
            path={videoUrl}
            controls={true}
            className='w-full rounded-xl'
        />
    </ImageKitProvider>
  )
}
export default BookVideo
