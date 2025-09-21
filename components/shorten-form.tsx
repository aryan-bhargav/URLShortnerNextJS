"use client"

import React, { useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
interface ShortenFormProps{
    handleUrlShortened :()=>void,
}
const ShortenForm = ({handleUrlShortened}:ShortenFormProps ) => {
    const [url, setUrl] = useState<string>("");
    const [isLoading,setIsLoading] = useState<boolean>(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("/api/shorten",{
                method:"POST",
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    url
                })
            });

            await response.json();
            setUrl("")
            handleUrlShortened();

        } catch (error) {
            
        }
        finally{
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='mb-4' action="">
            <div className='space-y-4'>
                <Input value={url} onChange={(e)=>setUrl(e.target.value)} className='h-12' type='url' placeholder='Enter your URL to shorten' required />
                <Button className='w-full p-2'>{isLoading ? "Shortening...." : "Shorten URL"}</Button>
            </div>
        </form>
    )
}

export default ShortenForm;