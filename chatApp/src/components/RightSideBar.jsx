import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { logout } from '../config/firebase'
import { AppContext } from '../context/AppContext'

const RightSideBar = () => {

  const {chatUser, messages} = useContext(AppContext)
  const [msgImage, setMsgImage] = useState([])

  useEffect(() => {
    let temp = []
    messages.map((msg) => {
     if(msg.image){
        temp.push(msg.image)
      }
    })
    setMsgImage(temp)
  },[messages])

  return chatUser ? (
    <div className='rs text-black bg-white h-[90vh] relative overflow-y-scroll'>
      <div className="rs-profile flex flex-col pt-[60px] items-center max-w-[70%] m-auto">
        <img className='w-[110px] aspect-[1/1] rounded-full' src={chatUser.userData.avatar} alt="" />
        <h3 className=''> {chatUser.userData.name} </h3>
        <p className='text-[13px] opacity-[80%] font-light'> {Date.now() - chatUser.userData.lastSeen <= 70000 ? <img src={assets.green_dot} alt="" /> : null }{chatUser.userData.bio}</p>
      </div>
        <hr className='bg-[#ffffff50] m-[15px_0px]' />
        <div className="rs-media p-[0px_20px] text-[13px]">
          <p>Media</p>
          <div className='max-h-[180px] grid grid-cols-1 overflow-y-scroll gap-[5px] mt-[8px]'>
            {msgImage.map((url, index) =>(<img onClick={() => window.open(url)} key={index} src ={url} />))}
            {/* <img src={assets.pic1} alt="" />
            <img src={assets.pic2} alt="" />
            <img src={assets.pic3} alt="" />
            <img src={assets.pic4} alt="" />
            <img src={assets.pic1} alt="" />
            <img src={assets.pic2} alt="" /> */}
          </div>
        </div>
        <button className='absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#077eff] text-white border-none text-[12px] font-light p-[10px_65px] rounded-4xl cursor-pointer'
        onClick={()=>logout()} >Logout</button>
    </div>
  )
  :
  (
    <div className='rs text-white bg-white h-[90vh] relative overflow-y-scroll'>
       <button className='absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#077eff] text-white border-none text-[12px] font-light p-[10px_65px] rounded-4xl cursor-pointer' onClick={()=>logout()}>Logout</button>
    </div>
  )
}

export default RightSideBar