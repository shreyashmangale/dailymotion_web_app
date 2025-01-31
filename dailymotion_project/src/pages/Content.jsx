import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import toast, { Toaster } from 'react-hot-toast';

const Content = () => {


    const navigate = useNavigate();

    const [data, setData] = useState(null);


    //Fetching data fro home screen
    useEffect(() => {
        const fetchData = async () => {

            const options = {
                method: 'GET',
                url: 'https://yt-api.p.rapidapi.com/trending',
                params: { geo: 'IN' },
                headers: {
                    'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
                    'x-rapidapi-host': 'yt-api.p.rapidapi.com'
                }
            };

            try {
                const response = await axios.request(options);
                // console.log(response.data.data.filter(item => item.type === "video"));
                setData(response.data.data.filter(item => item.type === "video"));
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    const [user, setUser] = useState(auth.currentUser);
    // console.log(user)


    //Add to watchlist function
    const addToWatchlist = async (videoData) => {
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
                toast.success("Added to Watchlist");
            } catch (error) {
                console.error("Error adding to watchlist: ", error);
            }
        } else {
            navigate('/login');
        }
    };


    return (
        <div className='w-full h-fit px-2'>
            <h1 className='md:text-3xl text-xl font-bold text-start'>Trending Videos</h1>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className='grid md:grid-cols-2 grid-cols-1'>
                {
                    data?.length > 0 ? data?.map((item) => {
                        return (

                            <div className='h-fit px-8 py-4 flex flex-col items-start mb-8'>
                                {/* <ReactPlayer light={true} controls={true} url='' height="340px" width="600px" /> */}
                                <div className='w-full h-fit mb-2'>
                                    <img className='w-full max-h-[300px] rounded-lg' src={item.thumbnail[2].url} alt="video-thumbnail" />
                                </div>
                                <div className='pr-8 text-start'>
                                    <Link to={`/single/${item.videoId}`} >
                                        <h1 className='md:text-2xl text-lg font-bold mb-2 text-start cursor-pointer'>{item.title.slice(0, 60)}</h1>
                                    </Link>
                                    <div className='flex gap-4'>
                                        <img className='w-[32px] h-[32px] rounded-xl' src={item.channelThumbnail[0].url} alt="ChannelThumbnail" />
                                        <h2 className='md:text-lg text-sm text-gray-600 font-bold mb-4'>{item.channelTitle}</h2>
                                    </div>
                                </div>

                                <div className='flex gap-4 mt-2'>
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
                    ) : <div className='w-[100vw] lg:w-[50vw] h-[70vh] flex items-center justify-center'>
                        <h1 className='text-lg'>Loading Data</h1>
                    </div>
                }
            </div >
        </div>
    )
}

export default Content