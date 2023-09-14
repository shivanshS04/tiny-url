'use client';
import { useState, useEffect } from "react";
import { createUrlRecord, getUserUrls, deleteUrlRecord } from '../../services/appwrite'
import { nanoid } from "nanoid";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from 'next/navigation'
import { AiOutlineUser } from 'react-icons/ai'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'
import { BsClipboard, BsTrash } from 'react-icons/bs'



export default function page() {
  const [loggedInUser, setLoggedInUser] = useState()
  const [url, setUrl] = useState('')
  const [resultUrl, setResultUrl] = useState()
  const [userUrls, setUserUrls] = useState([])
  var renderer = 0;
  const router = useRouter();

  async function getRecords() {

    const result = await getUserUrls(loggedInUser);
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

  const handleClick = async () => {
    const result = nanoid(7)
    toast.loading('Compressing URL...')
    const response = await createUrlRecord(
      result, url, loggedInUser
    )
    toast.dismiss()
    if (response == 'error') {
      toast.error('Please enter a valid url', {
        duration: 2000
      })
    }
    else {
      setResultUrl('https://' + window.location.host + "/" + result)
      navigator.clipboard.writeText('https://' + window.location.host + "/" + result)
      toast.success('copied short URL to clipboard', {
        duration: 1500
      })
      renderer++;

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
  async function handleDelete(doc_id) {
    toast.loading('Deleting....')
    const result = await deleteUrlRecord(doc_id);
    toast.dismiss()
    if (result != 'error') {
      toast.success('Url Deleted Successfully !', {
        duration: 1500
      })
      renderer--;
    }
    else {
      toast.error('error deleting the url !', {
        duration: 2000
      })
    }
  }
  return (
    <div className="w-screen h-screen bg-black " >
      <nav className="absolute top-0 left-0 w-screen float-right flex flex-row justify-end items-center gap-3 pr-4" >

        {
          loggedInUser
            ? <>
              <AiOutlineUser className="mt-2 cursor-pointer text-red-400 hover:bg-red-400 hover:text-black rounded-full transition-all duration-300" size={40} data-tooltip-id="tooltip" data-tooltip-content={loggedInUser} />
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
              <div key={index}
                className="flex justify-between gap-3 items-center last:mb-12 sm:w-full md:w-2/4 p-5 text-left text-white border-2 border-red-400"
              >
                <div
                >
                  <h1 className="text-white font-mono ">https://{window.location.host}/{item.url_id}</h1>
                  <h3> {item.url} </h3>
                </div>
                <div className="float-right flex gap-4" >
                  <BsClipboard data-tooltip-id="tooltip" data-tooltip-content='Copy Link !' onClick={() => {
                    navigator.clipboard.writeText('https://' + window.location.host + "/" + item.url_id)
                    toast.success('copied link to clipboard !', {
                      duration: 1500
                    })
                  }} className="text-white" size={25} />
                  <BsTrash data-tooltip-id="tooltip" data-tooltip-content='Delete' className="text-red-400" size={25} onClick={() => {
                    handleDelete(item.$id)
                  }} />
                </div>

              </div>
            ))
            :
            <></>
          }

        </div>

      </div>

      <Tooltip id="tooltip" />
      <Toaster />
    </div >
  )
}

