import React, { useContext, useEffect, useState } from 'react'
import LeftSideBar from '../components/LeftSideBar'
import ChatBox from '../components/ChatBox'
import { AppContext } from '../context/AppContext'
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading.json'; 

const Chat = () => {
  const { chatData, userData } = useContext(AppContext)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData]);

  return (
    <div className='h-[100vh] bg-image bg-cover bg-center grid place-items-center'>
      {loading ? (
        <div className='flex flex-col items-center'>
          <Lottie animationData={loadingAnimation} loop={true} className="w-[500px] h-[500px]" />
          <p className='text-[24px] text-white mt-4'>Loading...</p>
        </div>
      ) : (
        <div className='h-[90%] md:w-[95%] max-w-full bg-blue-50 grid grid-cols-[1fr_2fr] rounded-[24px] overflow-hidden'>
          <LeftSideBar />
          <ChatBox />
        </div>
      )}
    </div>
  )
}

export default Chat
