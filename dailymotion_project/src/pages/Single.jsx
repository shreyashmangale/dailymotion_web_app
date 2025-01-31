import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTv } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import toast, { Toaster } from 'react-hot-toast';

const Single = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const id = location.pathname.split('/')[2];
    // console.log(id);

    const [data, setData] = useState(null);

    const [videoData, setVideoData] = useState(null);
    const [videoThumbnail, setVideoThumbnail] = useState(null);

    const [error, setError] = useState(false);

    const [relatedVideo, setRelatedVideo] = useState(null);

    const [loadingVideo, setLoadingVideo] = useState(false)

    useEffect(() => {
        const fetchData = async () => {

            const options = {
                method: 'GET',
                url: 'https://yt-api.p.rapidapi.com/video/info',
                params: { id: id },
                headers: {
                    'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
                    'x-rapidapi-host': 'yt-api.p.rapidapi.com'
                }
            };

            try {
                const response = await axios.request(options);
                //console.log(response.data);
                setData(response.data);
            } catch (error) {
                console.error(error.error);
            }
        };

        fetchData();


        const fetchVideo = async () => {
            const options = {
                method: 'GET',
                url: 'https://yt-api.p.rapidapi.com/dl',
                params: {
                    id: id,
                    cgeo: 'IN'
                },
                headers: {
                    'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
                    'x-rapidapi-host': 'yt-api.p.rapidapi.com'
                }
            };

            try {
                const response = await axios.request(options);
                //console.log(response.data);
                setTimeout(() => {
                    if (response.data) {
                        if (response.data.status === "OK") {
                            setVideoData(response.data.formats[0].url);
                            setVideoThumbnail(response.data.thumbnail[4] ? response.data.thumbnail[4].url : response.data.thumbnail[0].url)
                        }
                    }
                }, 2000);
            } catch (error) {
                console.error(error);
            }
        };
        fetchVideo();



        const fetchRelatedVideo = async () => {
            const options = {
                method: 'GET',
                url: 'https://yt-api.p.rapidapi.com/related',
                params: { id: id },
                headers: {
                    'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
                    'x-rapidapi-host': 'yt-api.p.rapidapi.com'
                }
            };

            try {
                setLoadingVideo(true);
                const response = await axios.request(options);
                //console.log(response.data.data);
                setRelatedVideo(response.data.data);
                setLoadingVideo(false);
            } catch (error) {
              //console.log(error);
            }
        };
        fetchRelatedVideo();

    }, [id]); // Empty dependency array ensures this runs only once when the component mounts


    const [user, setUser] = useState(auth.currentUser);

    const addToWatchlist = async (videoData) => {
        //console.log(videoData)
        if (user) {
            const userId = user.uid;
            try {
                const watchlistRef = doc(db, "users", userId, "watchlist", videoData.id); // Unique video ID
                await setDoc(watchlistRef, {
                    title: videoData.title,
                    thumbnail: videoData.thumbnail,
                    channelTitle: videoData.channelTitle,
                    videoId: videoData.id
                });
              //console.log("Video added to watchlist!");
                toast.success("Added to watchlist");
                
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
            {
                <div className='flex lg:flex-row flex-col'>
                    {
                        (data && videoData && relatedVideo) ?
                            <div className='mt-4 m-8 lg:w-[60vw] h-fit text-start'>
                                <div className='relative w-full lg:h-[480px] md:h-[340px] h-[280px] mb-2 border-1 rounded border-gray-200'>

                                    {/* //provide url here of streaming data */}
                                    {videoData ?
                                        <ReactPlayer light={<img className='w-full h-full' src={videoThumbnail} alt='Thumbnail' />} playing={true} controls={true} width="100%" height="100%" url={videoData} />
                                        :
                                        <div className='flex items-center justify-center w-full h-full'>
                                            <h1 className='text-lg'>Loading video</h1>
                                        </div>
                                    }

                                </div>
                                <h1 className='px-2 lg:text-3xl md:text-2xl text-lg font-bold mb-2'>{data?.title}</h1>
                                <div className='flex items-center mt-2'>
                                    <div className='flex gap-4 px-2'>
                                        <div className='w-fit h-[32px]  rounded-sm flex gap-2 justify-center items-center cursor-pointer'>
                                            {/* {data?.author.avatar.length ? <img className='w-[32px] h-[32px] rounded-lg' src={data.author.avatar[1].url} alt="channel profile img" /> : <div></div>} */}
                                            <h2 className='px-2 text-black font-bold'>{data?.channelTitle}</h2>
                                        </div>
                                        <div className='ms-4 w-fit h-[32px] px-2 rounded-sm border-1 border-gray-400 flex gap-2 justify-center items-center cursor-pointer'>
                                            <FontAwesomeIcon icon={faBookmark} style={{ color: "gray" }} />
                                            <h1 className='text-gray-600' onClick={() => addToWatchlist(data)}>Add To Watchlist</h1>
                                        </div>
                                    </div>
                                </div>
                                <p className='mt-4 px-2 text-sm text-gray-600'><FontAwesomeIcon icon={faEye} /> :  {data?.viewCount}</p>
                                <h2 className='mt-2 px-2 md:text-lg text-sm text-gray-600 font-semibold mb-4'>{data?.description.slice(0, 150) + '...'}</h2>

                            </div> :
                            <div className='w-full h-[60vh] flex items-center justify-center'>
                                <h1 className='text-lg'>Error while loading the video <br /> OR <br />The video is not available</h1>
                            </div>
                    }


                    <div className="related-videos mt-4 mx-auto lg:w-[30vw] w-full">
                        <h1 className='mx-8 text-3xl font-semibold text-start mb-4'>Related Videos</h1>
                        {
                            relatedVideo?.length ? relatedVideo?.map(item => {
                                return (
                                    <div className='flex gap-4 lg:w-[450px] w-[full] lg:mx-auto mx-8 rounded mb-4'>
                                        <img className="w-[150px] h-[100px] rounded-lg" src={item.thumbnail[0].url} alt="Thumbnail" />
                                        <div className='flex flex-col content-start'>
                                            <Link to={`/single/${item.videoId}`} >
                                                <h1 className='text-lg font-semibold text-start'>{item.title.slice(0, 60) + "..."}</h1>
                                            </Link>
                                            <h2 className='font-semibold  text-start text-gray-600'>{item.channelTitle}</h2>
                                        </div>
                                    </div>
                                );
                            }) : <div>Loading Related Videos</div>
                        }

                    </div>
                </div>
            }

        </div>

    )
}

export default Single