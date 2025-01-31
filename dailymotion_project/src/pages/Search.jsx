import { faBookmark, faUser } from '@fortawesome/free-regular-svg-icons';
import { faHome, faRightToBracket, faTv } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';

const Search = () => {

  const navigate = useNavigate();


  const location = useLocation();
  const searchKey = location.pathname.split('/')[2];
  //console.log(searchKey);

  const [user, setUser] = useState(auth.currentUser);

  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    if (auth.currentUser) {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
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
  }, []);

  const [data, setdata] = useState(null);

  useEffect(() => {
    const searchVideos = async () => {
      const options = {
        method: 'GET',
        url: 'https://yt-api.p.rapidapi.com/search',
        params: { query: searchKey },
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
          'x-rapidapi-host': 'yt-api.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        //console.log(response.data.data.filter(item => item.type === "video"));
        setdata(response.data.data.filter(item => item.type === "video"));
      } catch (error) {
        console.error(error);
      }
    };
    searchVideos()
  }, [searchKey]);


  const addToWatchlist = async (videoData) => {
    console.log(videoData)
    if (user) {
      const userId = user.uid;
      try {
        const watchlistRef = doc(db, "users", userId, "watchlist", videoData.videoId); // Unique video ID
        await setDoc(watchlistRef, {
          title: videoData.title,
          thumbnail: videoData.thumbnail,
          channelTitle: videoData.channelTitle,
          videoId: videoData.videoId
        });
      //console.log("Video added to watchlist!");
        toast.success("Added to watchlist")
      } catch (error) {
        console.error("Error adding to watchlist: ", error);
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      <Navbar />
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      {/* Sidebar for above lg screens */}

      <div className='flex gap-8 '>
        <div className="hidden lg:flex lg:flex-col items-start gap-8 font-semibold pt-16 ps-8 pb-8 text-black w-64 h-[92vh] shadow-[0px_0_8px_rgba(0,0,0,0.1)]">
          <button onClick={() => navigate('/')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faHome} /> Home</button>
          <button onClick={() => navigate('/watchlist')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faBookmark} /> Watchlist</button>
          <button onClick={() => navigate('/signup')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faUser} /> Sign up</button>
          <button onClick={() => navigate('/login')} className='cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faRightToBracket} /> Log in</button>
          <div className='border border-slate-600 p-2 rounded-lg'>
            <h1>{auth.currentUser ? auth.currentUser?.email : <h2>User Not LoggedIn</h2>}</h1>
          </div>
        </div>
        <div className='w-fit mt-12 lg:mx-28 h-fit'>
          <div className='grid lg:grid-cols-2 grid-cols-1'>
            {
              data?.length > 0 ? data?.map((item) => {
                return (

                  <div className='h-fit px-8 py-4 flex flex-col items-start mb-8'>
                    {/* <ReactPlayer light={true} controls={true} url='' height="340px" width="600px" /> */}
                    <div className='w-full h-fit mb-2'>
                      <img className='w-full max-h-[300px] rounded-lg' src={item.thumbnail[0].url} alt="video-thumbnail" />
                    </div>
                    <div className='pr-8 text-start'>
                      <Link to={`/single/${item.videoId}`} >
                        <h1 className='text-2xl font-bold mb-2 text-start cursor-pointer'>{item.title}</h1>
                      </Link>
                      <h2 className='text-sm font-bold mb-4'>{item.channelTitle}</h2>
                    </div>

                    <div className='flex gap-4 px-2'>
                      <div className='sm:w-[40px] w-[25px] sm:h-[40px] h-[25px] rounded-sm bg-gray-200 flex justify-center items-center cursor-pointer'>
                        <Link to={`/single/${item.videoId}`} >
                          <FontAwesomeIcon icon={faTv} />
                        </Link>
                      </div>
                      <div className='sm:w-[40px] w-[25px] sm:h-[40px] h-[25px] rounded-sm bg-gray-200 flex justify-center items-center cursor-pointer'>
                        <FontAwesomeIcon icon={faBookmark} onClick={() => addToWatchlist(item)} />
                      </div>
                    </div>
                  </div>
                )
              }
              ) : <div className='flex items-center justify-center w-[50vw] h-[50vh]'><h1 className='font-bold'>Loading Videos</h1></div>
            }
          </div>
        </div>
      </div>
    </div>

  )
}

export default Search