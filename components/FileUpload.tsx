"use client"
import React, { useEffect, useRef, useState } from 'react'
import { IKImage, ImageKitProvider, IKUpload, IKVideo, } from "imagekitio-next";
import config from '@/lib/config';
import { Button } from './ui/button';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const {
    env: {
        imagekit: { publicKey, urlEndpoint }
    }
} = config

interface props {
    type: "image" | "video";
    accept: string;
    placeHolder: string;
    folder: string;
    variant: "dark" | "light";
    value?: string;
    onFileChange: (filePath: string) => void
}

const FileUpload = ({
    type,
    accept,
    placeHolder,
    folder,
    variant,
    value,
    onFileChange
}: props) => {
    const ikUploadRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<{ filePath: string  | null}>({ filePath: value || null });
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        console.log(progress)

    }, [progress])

    const styles = {
        button: variant === "dark" ? "bg-dark-300" : "bg-light-600 border-gray-100 border hover:bg-light-600",
        placeHolder: variant === "dark" ? "text-light-100" : "text-slate-500",
        text: variant === "dark" ? "text-light-100" : "text-dark-400"
    }

    const authenticator = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`, {})

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Request failed with a status ${error}`);
            }

            const data = await response.json();
            const { signature, expire, token } = data;
            return { signature, expire, token };

        } catch (error: any) {
            throw new Error(`Authentication failed: ${error.message}`);

        } finally {
            setLoading(false);
        }
    }
    const onError = (error: any) => {
        console.error(error);
        toast({
            title: `${type} Upload Failed`,
            description: `Your ${type} could not be uploaded. Please try again later`,
            variant: "destructive"
        })
    }
    const onSuccess = (res: any) => {
        setFile(res);
        onFileChange(res.filePath);
        toast({
            title: `${type} Uploaded Successfully`,
            description: `${res.filePath} has been uploaded successfully`,
        })
    }
    const onValidate = (file: File) => {
        if (type === "image") {
            if (file.size > 20 * 1024 * 1024) {
                toast({
                    title: "File too large",
                    description: "Please upload an image that is less than 20MB",
                    variant: "destructive"
                })
                return false;
            } else if (file.size > 50 * 1024 * 1024) {
                toast({
                    title: "File too large",
                    description: "Please upload an image that is less than 50MB",
                    variant: "destructive"
                })
                return false;
            }
        }
        return true;
    }

    return (
        <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
            <IKUpload
                ref={ikUploadRef}
                onError={onError}
                onSuccess={onSuccess}
                className='hidden'
                useUniqueFileName={true}
                validateFile={onValidate}
                onUploadStart={() => {
                    console.log("Upload started");
                    setProgress(0);
                }}
                onUploadProgress={({ loaded, total }) => {
                    const percent = Math.round((loaded / total) * 100);
                    setTimeout(() => {
                        setProgress(percent);
                    }, 200); // Simulate slower updates
                }}
                
                folder={folder}
                accept={accept}

            />
            <Button className={cn('upload-btn bg-[#232839] hover:bg-[#232839]', styles.button)}
                onClick={(e) => {
                    e.preventDefault();
                    if (ikUploadRef.current) {
                        //@ts-ignore
                        ikUploadRef.current?.click();
                    }
                }}>
                {
                    loading ? <p>Uploading...</p>
                        :
                        <>
                            <Image
                                src={"/icons/upload.svg"}
                                width={20}
                                height={20}
                                alt="Upload"
                                className='object-contain'
                            />
                            <p className={cn("text-base", styles.placeHolder)}>{placeHolder}</p>
                        </>

                }

            </Button>
            {
                progress > 0 && progress < 100 && (
                    <div className="w-full rounded-full bg-green-200">
                        <div
                            className="bg-green-500 text-white text-center h-6 rounded-full"
                            style={{ width: `${progress}%` }}
                        >
                            {progress}%
                        </div>
                    </div>
                )
            }


            {
                file && (
                    (type === "image" ?
                        (<IKImage
                            alt={file.filePath || ''}
                            path={file.filePath || undefined}
                            width={500}
                            height={300}
                        />)
                        :
                        type === "video" ? (
                            <IKVideo
                                path={file.filePath || undefined}
                                controls={true}
                                className='h-90 w-full rounded-xl'

                            />
                        ) :
                            null
                    )

                )
            }
        </ImageKitProvider>
    )
}

export default FileUpload

