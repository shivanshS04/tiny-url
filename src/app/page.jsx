'use client';
import { useState } from "react";
import { createUrlRecord } from '../../services/appwrite'
import { nanoid } from "nanoid";
import { Toaster, toast } from "react-hot-toast";
import { Howl, Howler } from 'howler'

export default function page() {
  const [url, setUrl] = useState('')
  const [resultUrl, setResultUrl] = useState()
  const handleClick = () => {
    const result = nanoid(20)
    const response = createUrlRecord(
      result, url
    )
    if (response == 'error') {
      toast.error('error', {
        duration: 2000
      })
    }
    else {
      setResultUrl('http://localhost:3000/' + result)
      navigator.clipboard.writeText('http://localhost:3000/' + result)
      toast.success('copied short URL to clipboard', {
        duration: 1500
      })
    }
  }

  const playsong = () => {
    var sound = new Howl({
      src: ['https://open.spotify.com/track/5aszL9hl6SBzFNsOvw8u8w'],
      format: ['mp3'],
      autoplay: true,
      loop: true,
      volume: 0.5,
    });
    sound.play()
  }


  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center flex-col " >
      <form onSubmit={(e) => {
        e.preventDefault();
        handleClick()
      }}
        className="w-screen h-screen flex justify-center items-center flex-col"
      >
        <input type="text" value={url} onChange={(e) => {
          setUrl(e.target.value)
        }} className="rounded-2xl text-lg w-2/4 text-white font-mono bg-slate-800 p-4 " placeholder="Enter the URL here !" />
        <button type="submit" className="bg-red-400 text-black font-bold mt-3 w-1/12 p-2 rounded-xl " >Convert</button>
      </form>
      <button className="bg-red-400 text-black font-bold mt-3 w-1/12 p-2 rounded-xl " onClick={() => playsong()} >Song</button>
      <h1 >
        {
          resultUrl ? resultUrl : ''
        }
      </h1>



      <Toaster />
    </div>
  )
}

