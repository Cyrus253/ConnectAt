import React, { use, useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'
import { toast } from 'react-toastify'
import { updateDoc, arrayUnion, getDoc } from 'firebase/firestore'
import upload from '../lib/upload'

const ChatBox = () => {

  const { userData, messagesId, chatUser, messages, setMessages } = useContext(AppContext)

  const [input, setInput] = useState("")
  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          })
        })

        const userIDs = [chatUser.rId, userData.id];
        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId);
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData
            });
          }
        })

      }
    } catch (error) {
      toast.error(error.message);
    }

    setInput("")
  }

  const sendImage = async (e) => {
    try {
      const fileUrl = await upload(e.target.files[0]);

      if (fileUrl && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date(),
          })
        })

        const userIDs = [chatUser.rId, userData.id];
        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId);
            userChatData.chatsData[chatIndex].lastMessage = 'Image';
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData
            });
          }
        })

      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  const convertTimeStamp = (timestamp) => {
    let date = timestamp.toDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (hours > 12) {
      return hours - 12 + ':' + minutes + ' PM';
    } else {
      return hours + ':' + minutes + ' AM';
    }
  }

  useEffect(() => {
    if (messagesId) {
      const onSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        setMessages(res.data().messages.reverse());
      })
      return () => {
        onSub();
      }
    }
  }, [messagesId])

  return chatUser ? (
    <div className='chat-box h-[90vh] bg-[#f1f5ff] relative'>
      <div className="chat-user p-[10px] px-[15px] flex items-center gap-[10px] border-b-[1px] border-[#c6c6c6]">
        <img className='w-[35px] rounded-full aspect-[1/1] ' src={chatUser.userData.avatar} alt="" />
        <p className='flex items-center gap-[5px] flex-1 font-medium text-[#393939] '>
          {chatUser.userData.name}
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? <img className='w-[15px]' src={assets.green_dot} alt="" /> : null }</p>
        <img className='w-[25px] rounded-full' src={assets.help_icon} alt="" />
      </div>

      <div className="chat-msg h-[calc(100%-70px)] pb-[50px] overflow-scroll flex flex-col-reverse">
        {messages.map((msg, index) =>
          msg.sId === userData.id ? (
            // Sent messages
            <div key={index} className="s-msg flex items-end justify-end px-[15px] gap-[5px]">
              {msg["image"] ?
                <img className='w-[227px] aspect-[1/1] rounded-xl mt-7' src={msg.image} alt="" />
                :
                <p className='msg text-white bg-[#077EFF] p-[8px] max-w-[200px] text-[14px] font-light rounded-[8px_8px_0px_8px] mb-[30px] mt-3'>
                  {msg.text}
                </p>
              }

              <div className="flex flex-col items-center">
                <img className='w-[27px] aspect-[1/1] rounded-full ' src={userData.avatar} alt="" />
                <p className='text-[10px]'>{convertTimeStamp(msg.createdAt)}</p>
              </div>
            </div>
          ) : (
            // Received messages
            <div key={index} className="r-msg flex items-end justify-start px-[15px] gap-[5px]">
              <div className="flex flex-col items-center">
                <img className='w-[27px] aspect-[1/1] rounded-full ' src={chatUser.userData.avatar} alt="" />
                <p className='text-[10px]'>{convertTimeStamp(msg.createdAt)}</p>
              </div>
              {msg["image"] ?
                <img className='w-[227px] aspect-[1/1] rounded-xl mt-7' src={msg.image} alt="" />
                :
                <p className='msg text-white bg-[#077EFF] p-[8px] max-w-[200px] text-[14px] font-light rounded-[8px_8px_8px_0px] mb-[30px] mt-3'>
                  {msg.text}
                </p>
              }

            </div>
          ))}

      </div>

      <div className="flex items-center p-[10px] px-[15px] gap-[12px] bg-white absolute bottom-0 left-0 right-0 ">
        <input onChange={(e) => setInput(e.target.value)} value={input} className='flex-1 outline-none border-none' type="text" placeholder='Type a message' />
        <input onChange={sendImage} type="file" id='image' hidden />
        <label className='flex' htmlFor="image">
          <img className='w-[22px] cursor-pointer' src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} className='w-[30px] cursor-pointer' src={assets.send_button} alt="" />
      </div>
    </div>
  )
    :
    <div className='chat-welcome w-[100%] flex flex-col items-center justify-center gap-[5px]'>
      <img className='w-[200px] h-[150px]' src={assets.logo} alt="" />
      <p className='text-[20px] font-medium text-[#383838]'>Select a chat to start messaging</p>
    </div>
}

export default ChatBox