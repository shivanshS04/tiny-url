'use client'
import { getUrlRecord } from '../../../services/appwrite'
import { useEffect, useState } from 'react';
import { useParams, redirect } from 'next/navigation'

export default function page() {
    const params = useParams()
    const [result, setResult] = useState()
    useEffect(() => {

        (async () => {
            var url = await getUrlRecord(params.url_id)
            setResult(url);
            console.log(url)
        })()

    }, [])

    if (result) {
        if (result == 'not found') {
            redirect('/not_found')
        }
        redirect(result)
    }
    return (
        <div className='w-screen h-screen bg-black flex justify-center items-center flex-col'>
            <img className='w-50 h-auto' src='./loading.png' alt="loadingVectorArt" />
            <h1 className='mt-4 font-sans text-4xl text-white'>Redirecting....</h1>
        </div>
    );
}