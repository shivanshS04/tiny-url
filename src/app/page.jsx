'use client';
import { useState, useEffect } from "react";
import { createUrlRecord, getUserUrls } from '../../services/appwrite'
import { nanoid } from "nanoid";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from 'next/navigation'
import { AiOutlineUser } from 'react-icons/ai'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'



export default function page() {
  const [loggedInUser, setLoggedInUser] = useState()
  const [url, setUrl] = useState('')
  const [resultUrl, setResultUrl] = useState()
  const [userUrls, setUserUrls] = useState([])
  const [renderer, setRenderer] = useState(0)
  const router = useRouter();

  async function getRecords() {

    const result = await getUserUrls(loggedInUser);
    console.log(result)
    setUserUrls(result)
  }

  useEffect(() => {
    if (localStorage) {
      setLoggedInUser(localStorage.getItem('user-email'))
    }
    if (loggedInUser) {
      setLoggedInUser(localStorage.getItem('user-email'));
      getRecords()
    }
  }, [loggedInUser, renderer])

  const handleClick = () => {
    const result = nanoid(7)
    const response = createUrlRecord(
      result, url, loggedInUser
    )
    if (response == 'error') {
      toast.error('error', {
        duration: 2000
      })
    }
    else {
      setResultUrl('http://' + window.location.host + "/" + result)
      navigator.clipboard.writeText('http://' + window.location.host + "/" + result)
      toast.success('copied short URL to clipboard', {
        duration: 1500
      })
      setRenderer(renderer + 1)

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
      <div className={`${loggedInUser && 'mt-72'} w-screen h-full flex justify-center items-center flex-col `}>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleClick()
        }}
          className="w-screen flex justify-center items-center flex-col"
        >
          <input type="text" value={url} onChange={(e) => {
            setUrl(e.target.value)
          }} className="rounded-2xl text-lg md:w-2/4 text-white font-mono bg-slate-800 p-4 " placeholder="Enter the URL here !" />
          <button type="submit" className="bg-red-400 text-black font-bold mt-3 lg:w-1/12 sm:w-20  p-2 rounded-xl " >Convert</button>
        </form>
        <div className=" w-screen flex justify-center items-center flex-col gap-2 mt-10 ">
          {resultUrl && <h1 onClick={() => {
            navigator.clipboard.writeText(resultUrl)
            toast.success('copied to clipboard !', {
              duration: 1500
            })
          }}
            className="cursor-pointer border-2 border-red-400 p-3 font-mono text-2xl text-red-400" >{resultUrl}</h1>}

          {loggedInUser && <h1 className="text-2xl font-mono font-extrabold" >Your URL<span className="text-red-400">(s)</span></h1>}

          {userUrls.length > 0 && loggedInUser ?

            userUrls.map((item, index) => (
              <div key={index} onClick={() => {
                navigator.clipboard.writeText('http://' + window.location.host + "/" + item.url_id)
                toast.success('copied link to clipboard !', {
                  duration: 1500
                })
              }}
                className=" last:mb-12 sm:w-full md:w-2/4 p-5 text-left text-white border-2 border-red-400 cursor-pointer"
              > <h1 className="text-white font-mono ">http://{window.location.host}/{item.url_id}</h1>
                <h3> {item.url} </h3>
              </div>
            ))
            :
            <></>
          }

        </div>

      </div>

      <Tooltip id="user-icon" />
      <Toaster />
    </div >
  )
}

