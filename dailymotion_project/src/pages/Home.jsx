import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faUser } from '@fortawesome/free-regular-svg-icons';
import { faHome, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import Content from './Content';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';


const Home = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        if (auth.currentUser) {
            auth.onAuthStateChanged( async (user) => {
                if(user){
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                      //console.log(docSnap.data());
                    }
                }
            })
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [])

    return (
        <div>
            <Navbar />
            {/* Sidebar for above lg screens */}

            <div className='flex gap-8'>
                <div className="hidden lg:flex lg:flex-col items-start gap-8 font-semibold pt-16 ps-8 pb-8 text-black w-64 h-[92vh] shadow-[0px_0_8px_rgba(0,0,0,0.1)]">
                    <button onClick={() => navigate('/')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faHome} /> Home</button>
                    <button onClick={() => navigate('/watchlist')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faBookmark} /> Watchlist</button>
                    <button onClick={() => navigate('/signup')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faUser} /> Sign up</button>
                    <button onClick={() => navigate('/login')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faRightToBracket} /> Log in</button>
                    <div className='border border-slate-600 p-2 rounded-lg'>
                    <h1>{auth.currentUser ? auth.currentUser.email : <h2>User Not LoggedIn</h2> }</h1>
                    </div>
                </div>
                <div className='w-fit mt-12 lg:mx-28 h-fit'>
                    <Content />
                </div>
            </div>
        </div>
    )
}

export default Home