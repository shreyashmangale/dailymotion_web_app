import { faMultiply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase/firebase'
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogIn(e) {
        e.preventDefault();
        try {
            const loggedIn = await signInWithEmailAndPassword(auth, email, password);
          //console.log("user logged in successfully");
            if (loggedIn) {
                toast.success("User Logged In");
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }

        } catch (error) {
          //console.log(error.message)
        }
    }

    return (
        <div className='bg-gray-200 h-[100vh] flex flex-col justify-center items-center gap-16'>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            <div className='relative auth w-[400px] bg-white rounded-xl flex flex-col justify-center items-center p-8 shadow-2xl'>

                <div className='absolute top-2 right-2'>
                    <button><FontAwesomeIcon icon={faMultiply} onClick={() => navigate('/')} /></button>
                </div>


                <h1 className='text-black font-bold text-2xl mb-4'>Welcome to Dailymotion</h1>
                <h2 className='text-gray-400 font-bold text-xl'>Log In</h2>
                <form className='flex flex-col gap-4 w-full mt-8 text-start'>
                    <label htmlFor="email" className='text-sm font-semibold'>Email address</label>
                    <input className='border-1 border-gray-400 rounded-lg p-2' required type="text" name='email' onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="password" className='text-sm font-semibold'>Password</label>
                    <input className='border-1 border-gray-400 rounded-lg p-2' required type="password" name='password' onChange={(e) => setPassword(e.target.value)} />

                    <button className='mt-6 px-4 py-3 rounded-lg bg-[#FC4747] text-white text-sm hover:text-[#161D2F] transition hover:ease-in-out cursor-pointer' onClick={handleLogIn}>Log in</button>
                    {/* {err && <p>{err}</p>} */}
                    <p className='mt-4 text-black text-sm'>Don't you have an account? <Link to="/signup"><span className='text-red-500 ms-2'>Sign up</span></Link></p>

                </form>
            </div>
        </div>
    )
}

export default Login