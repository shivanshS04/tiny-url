'use client';
import { useState } from "react";
import { createUrlRecord } from '../../services/appwrite'
import { nanoid } from "nanoid";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from 'next/navigation'
import { AiOutlineUser } from 'react-icons/ai'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'


export default function page() {
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('user-email'))
  const [url, setUrl] = useState('')
  const [resultUrl, setResultUrl] = useState()

  const router = useRouter();

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
  function handleLogin() {
    router.push('/login')
  }
  function handleSignUp() {
    router.push('/signup')
  }
  function handleLogout() {
    localStorage.removeItem('user-email')
    setLoggedInUser()
  }
  return (
    <div className="w-screen h-screen bg-black " >
      <nav className="absolute top-0 left-0 w-screen float-right flex flex-row justify-end items-center gap-3 pr-4" >

        {
          loggedInUser
            ? <>
              <AiOutlineUser className="mt-2 cursor-pointer text-red-400 hover:bg-red-400 hover:text-black rounded-full transition-all duration-300" size={40} data-tooltip-id="user-icon" data-tooltip-content={loggedInUser} />
              <button className="text-red-400 bg-black border-red-400 border-2 font-bold mt-3 lg:w-1/12 sm:w-20 p-2 rounded-xl " onClick={() => handleLogout()} >Log Out</button>
            </>
            : <>
              <button className="bg-red-400 text-black font-bold mt-3 lg:w-1/12 sm:w-20 p-2 rounded-xl " onClick={() => handleLogin()} >Login</button>
              <button className="text-red-400 bg-black border-red-400 border-2 font-bold mt-3 lg:w-1/12 sm:w-20 p-2 rounded-xl " onClick={() => handleSignUp()} >Sign Up</button>
            </>
        }
      </nav>
      <div className=" flex justify-center items-center flex-col">

        <form onSubmit={(e) => {
          e.preventDefault();
          handleClick()
        }}
          className="w-screen h-screen flex justify-center items-center flex-col"
        >
          <input type="text" value={url} onChange={(e) => {
            setUrl(e.target.value)
          }} className="rounded-2xl text-lg md:w-2/4 text-white font-mono bg-slate-800 p-4 " placeholder="Enter the URL here !" />
          <button type="submit" className="bg-red-400 text-black font-bold mt-3 lg:w-1/12 sm:w-20  p-2 rounded-xl " >Convert</button>
        </form>

      </div>
      <Tooltip id="user-icon" />
      <Toaster />
    </div >
  )
}

