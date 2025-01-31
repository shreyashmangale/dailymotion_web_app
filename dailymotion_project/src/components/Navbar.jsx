import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faUser } from '@fortawesome/free-regular-svg-icons'
import { faBars, faHome, faMultiply, faRightToBracket, faSearch, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { Dropdown } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';



const Navbar = () => {

    const navigate = useNavigate();
    const [authState, setAuthState] = useState(auth);


    const [searchInput, setSearchInput] = useState('');

    function handleSearch() {
        navigate(`/search/${searchInput}`)
    }



    const [sidebar, setSidebar] = useState(false);


    const toggleSidebar = () => {
        setSidebar(!sidebar);
    }


    // Detect screen size changes and reset `isOpen`
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebar(false); // Close the toggleable sidebar on lg screens
            }
        };

        // Add event listener on component mount
        window.addEventListener("resize", handleResize);

        // Run the handler once during initialization to ensure state sync
        handleResize();

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


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

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/');
    }



    const items = [
        {
            label: <button className='px-4 py-2 text-sm' onClick={()=>navigate('/login')}>Log in</button>,
            key: '0',
        },
        {
            label: <button className='px-4 py-2 text-sm' onClick={()=>navigate('/signup')}>Sign up</button>,
            key: '1',
        },
        {
            label: <button className={`px-4 py-2 text-sm ${!authState.currentUser ? 'hidden' : 'block'}`} onClick={handleLogout}>Log out</button>,
            key: '2',
        }
    ];

    return (
        <>
            <div className='navbar flex gap-2 pt-2 pb-4 shadow-lg ps-4'>
                <div className='flex items-center lg:hidden lg:scale-110'>
                    {!sidebar ? <FontAwesomeIcon icon={faBars} onClick={toggleSidebar} /> : <FontAwesomeIcon icon={faMultiply} onClick={toggleSidebar} />
                    }
                </div>



                <div className='flex flex-grow justify-between ps-8'>
                    <h1 className='text-slate-800 sm:text-3xl text-xl font-semibold uppercase italic'>Dailymotion</h1>
                    <div className='hidden sm:flex lg:w-[500px] md:w-[300px] bg-gray-100 rounded-md  gap-4 px-4 items-center'>
                        <FontAwesomeIcon className='cursor-pointer' icon={faSearch} onClick={handleSearch} />
                        <input className='w-full h-full rounded focus:outline-none' type="text" placeholder='Search' onChange={(e) => setSearchInput(e.target.value)} />
                    </div>
                    <div className='flex items-center cursor-pointer sm:hidden'>
                        <div className='sm:w-[40px] w-[25px] sm:h-[40px] h-[25px] rounded-sm bg-gray-600 flex justify-center items-center'>
                            <FontAwesomeIcon icon={faSearch} style={{ color: 'white' }} />
                        </div>
                    </div>
                    <div className='auth-buttons hidden lg:flex gap-8 '>
                        <Link to={'/'}>
                            <button className='px-4 py-2 border-1 rounded-md cursor-pointer'> <FontAwesomeIcon className='mr-1' icon={faHome} /></button>
                        </Link>
                        <Link to={'/login'}>
                            <button className='px-4 py-2 border-1 rounded-md cursor-pointer'> <FontAwesomeIcon className='mr-1' icon={faRightToBracket} /> Log in</button>
                        </Link>
                        <Link to={'/signup'}>
                            <button className='px-4 py-2 border-1 rounded-md bg-black text-white cursor-pointer'><FontAwesomeIcon className='mr-1' icon={faUser} /> Sign up</button>
                        </Link>
                        <button className={`px-4 py-2 border-1 rounded-md bg-black text-white cursor-pointer ${!authState.currentUser ? 'hidden' : 'block'}`} onClick={handleLogout}><FontAwesomeIcon className='mr-1' icon={faSignOut} />Log out</button>
                    </div>
                    <Dropdown menu={{ items }} trigger={"click"}>
                        <div className='flex flex-col justify-center items-center cursor-pointer lg:hidden'>
                            <div className='sm:w-[40px] w-[25px] sm:h-[40px] h-[25px] rounded-sm bg-gray-600 flex justify-center items-center'>
                                <FontAwesomeIcon icon={faUser} style={{ color: 'white' }} />
                            </div>

                        </div>
                    </Dropdown>
                </div>



            </div>

            {/* Sidebar for below lg screens */}
            <div className={`fixed inset-y-0 sm:top-16 top-13 left-0 bg-white flex flex-col gap-6 font-semibold  px-4 py-12 text-black w-64  shadow-[0px_0_8px_rgba(0,0,0,0.1)] transform ${sidebar ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 z-50`}>
                    <button onClick={() => navigate('/')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faHome} /> Home</button>
                <button onClick={() => navigate('/watchlist')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faBookmark} /> Watchlist</button>
                <button onClick={() => navigate('/signup')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faUser} /> Sign up</button>
                <button onClick={() => navigate('/login')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faRightToBracket} /> Log in</button>
                <div className='border border-slate-600 p-2 rounded-lg'>
                    <h1>{auth.currentUser ? auth.currentUser.email : <span>User Not LoggedIn</span> }</h1>
                </div>
            </div>



        </>
    )
}

export default Navbar