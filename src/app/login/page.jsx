'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '../../../services/appwrite'
import { Toaster, toast } from 'react-hot-toast'

export default function page() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter();
    async function handleClick() {
        toast.loading('validating....')
        const response = await login(email, password)
        toast.dismiss()
        if (response == 'success') {
            toast.success('Login Successful !', {
                duration: 1500
            })
            localStorage.setItem('user-email', email);
            router.replace('/')
        }
        else {
            toast.error('Invalid Credentials ! Try again ', {
                duration: 2000
            });
            setEmail('');
            setPassword('');

        }
    }
    function handleSignUp() {
        router.replace('/signup')
    }
    return (
        <div className='w-screen h-screen bg-black' >
            <form onSubmit={(e) => {
                e.preventDefault();
                handleClick()
            }}
                className="w-screen h-screen flex justify-center items-center flex-col gap-3"
            >
                <h1 className='text-3xl mb-4 font-bold ' >Login</h1>
                <input type="text" value={email} onChange={(e) => {
                    setEmail(e.target.value)
                }} className="rounded-2xl border-red-400 border-2 text-lg md:w-1/4 text-white font-mono bg-black p-4 " placeholder="Your Email here !" />
                <input type="password" value={password} onChange={(e) => {
                    setPassword(e.target.value)
                }} className="rounded-2xl  border-red-400 border-2 text-lg md:w-1/4 text-white font-mono bg-black p-4 " placeholder="Your Password here !" />
                <button type="submit" disabled={email.length == 0 || password.length == 0} className="bg-red-400 text-black font-bold mt-5 lg:w-1/12 sm:w-20  p-2 rounded-xl disabled:cursor-not-allowed disabled:opacity-50 " >Login</button>

                <h2 className='font-light text-white'>Don't have an account  ? <span className='text-red-400 font-mono font-extrabold cursor-pointer' onClick={() => handleSignUp()}> Sign Up Here !</span></h2>
            </form>
            <Toaster />
        </div>
    )
}