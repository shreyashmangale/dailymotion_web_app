import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from '../firebase/firebase'
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faHome, faRightToBracket, faTv, faUser } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';

const Watchlist = () => {
  const navigate = useNavigate();

  const [watchlistData, setWatchlistData] = useState();


  const fetchwatchlist = async () => {
    try {
      if(auth.currentUser){
        const watchlistRef = collection(db, "users", auth.currentUser.uid, "watchlist");
        const querySnapshot = await getDocs(watchlistRef);
        const watchlist = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        //console.log(watchlist);
        setWatchlistData(watchlist);
      }
    } catch (error) {
      console.error("Error fetching watchlist: ", error);
    }
  };

  const [userData, setUserData] = useState(auth.currentUser);

  // const fetchUserData = async () => {
  //   if (auth.currentUser) {
  //     auth.onAuthStateChanged(async (user) => {
  //       if(user){
  //         const docRef = doc(db, "users", user.uid);
  //         const docSnap = await getDoc(docRef);
  //         if (docSnap.exists()) {
  //           setUserData(docSnap.data());
  //         //console.log(docSnap.data());
  //         }
  //       }
  //     })
  //   }
  // }

  useEffect(() => {
    fetchwatchlist();
    // fetchUserData();
  }, [])


  return (
    <div>
      <Navbar />
      {/* Sidebar for above lg screens */}

      <div className='flex gap-8 '>
        <div className="hidden lg:flex lg:flex-col items-start gap-8 font-semibold pt-16 ps-8 pb-8 text-black w-64 h-[92vh] shadow-[0px_0_8px_rgba(0,0,0,0.1)]">
          <button onClick={() => navigate('/')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faHome} /> Home</button>
          <button onClick={() => navigate('/watchlist')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faBookmark} /> Watchlist</button>
          <button onClick={() => navigate('/signup')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faUser} /> Sign up</button>
          <button onClick={() => navigate('/login')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faRightToBracket} /> Log in</button>
          <div className='border border-slate-600 p-2 rounded-lg'>
            <h1>{auth.currentUser ? auth.currentUser?.email : <span>User Not LoggedIn</span>}</h1>
          </div>
        </div>

        <div className='flex-grow mt-12 lg:mx-28 h-fit'>
          <h1 className='text-start lg:text-3xl text-lg font-bold mb-8 px-2'>Watchlist Videos</h1>
          {
            userData ?
              <div className='flex flex-col gap-8'>
                {
                  watchlistData?.length > 0 ? watchlistData?.map((item) => {
                    return (

                      <div className='h-fit sm:px-2 px-4 py-1 flex sm:flex-row flex-col gap-4 items-center'>
                        {/* <ReactPlayer light={true} controls={true} url='' height="340px" width="600px" /> */}
                        <div className='lg:w-[350px] mb-2'>
                          <img className='w-full max-h-[200px] rounded-lg' src={item?.thumbnail[2].url ? item.thumbnail[2].url : item?.thumbnail[0].url} alt="video-thumbnail" />
                        </div>
                        <div className='text-start'>
                          <Link to={`/single/${item.videoId}`} >
                            <h1 className='lg:text-xl text-xs font-bold mb-2 cursor-pointer'>{item.title}</h1>
                          </Link>
                          <h2 className='text-sm font-bold mb-4'>{item.channelTitle}</h2>
                        

                        <div className='flex gap-4 px-2'>
                          <div className='sm:w-[40px] w-[25px] sm:h-[40px] h-[25px] rounded-sm bg-gray-200 flex justify-center items-center cursor-pointer'>
                            <Link to={`/single/${item.videoId}`} >
                              <FontAwesomeIcon icon={faTv} />
                            </Link>
                          </div>
                          <div className='sm:w-[40px] w-[25px] sm:h-[40px] h-[25px] rounded-sm bg-gray-200 flex justify-center items-center cursor-pointer'>
                            <FontAwesomeIcon icon={faBookmark} />
                          </div>
                        </div>
                        </div>
                      </div>
                    )
                  }
                  ) : <div><h1>No data</h1></div>
                }
              </div> 
              : 
              <div className='mx-auto w-full h-[70vh] flex flex-col items-center justify-center'>
                <h1>You are not Logged In</h1>
                <button className='bg-gray-500 text-gray-100 px-3 py-1 rounded-lg mt-4' onClick={()=>navigate('/login')}>Login</button>
              </div>
          }

        </div>
      </div>
    </div>
  )
}

export default Watchlist
