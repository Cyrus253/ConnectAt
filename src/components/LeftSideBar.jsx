import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, setDoc, serverTimestamp, updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const LeftSideBar = () => {
  const navigate = useNavigate()
  const { userData, chatData,chatUser, setChatUser,setMessagesId,messagesId } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);


  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].id !== userData.id) {
          let userExist = false;
          chatData.map((user) =>{
            if(user.rId === querySnap.docs[0].data().id ){
              userExist = true;
            } 
          })
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      }
      else {
        setShowSearch(false);
      }

    } catch (error) {

    }
  }

  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: []
      })

      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        })
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        })
      });

      const uSnap = await getDoc(doc(db, "users", user.id));
      const uData = uSnap.data();
      setChatUser({
        messagesId:newMessageRef.id,
        lastMessage: "",
        rId: user.id,
        updatedAt: Date.now(),
        messageSeen: true,
        userData:uData
      })
      setShowSearch(false);
      // setChatVisible(true);

    } catch (error) {
      toast.error(error.message);
      console.log("Error adding chat:", error);
    }
  }

  useEffect(() => {
    const updateChatUserData = async () => {
      if(chatUser){
        const userRef = doc(db, "users", chatUser.userData.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setChatUser(prev =>({...prev,userData: userData}));
      }
    }
    updateChatUserData();
  },[chatData])

  const setChat = async (item) =>{
    setMessagesId(item.messageId);
    setChatUser(item);
    const userChatsRef= doc(db, "chats", userData.id);
    const userChatsSnapshot = await getDoc(userChatsRef);
    const userChatsData = userChatsSnapshot.data();
    const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === item.messageId);
    userChatsData.chatsData[chatIndex].messageSeen = true;
    await updateDoc(userChatsRef, {
      chatsData: userChatsData.chatsData
    });
  }

  return (
    <div className='bg-white text-black h-[93%]'>
      <div className='p-[20px]'>
        <div className='flex justify-between items-center'>
          <img className='max-w-[80px]' src={userData?.avatar || assets.logo} alt="" />
          <div className='menu relative p-[10px_0px] group' >
            <img className='max-h-[20px] opacity-60 cursor-pointer' src={assets.menu_icon1} alt="" />
            <div className='sub-menu absolute top-[100%] right-0 w-[130px] p-[20px] rounded-lg bg-[#077eff] text-white hidden group-hover:block'>
              <p onClick={() => navigate("/profile")} className='cursor-pointer text-[14px]'>Edit Profile </p>
              <hr className='border-none h-[1px] bg-[#a4a4a4] m-[8px_0px]' />
              <p className='cursor-pointer text-[14px]'>Logout </p>
            </div>

          </div>
        </div>
        <div className="bg-gray-200 flex items-center gap-[10px] p-[15px] px-[20px] mt-[20px] rounded-3xl">
          <img className='w-[16px] ' src={assets.search_icon} alt="" />
          <input onChange={inputHandler} className='bg-transparent border-none outline-none text-gray-600 text-[12px]' type="text" placeholder='Search..' />
        </div>
      </div>
      <div className="flex flex-col h-[70%] overflow-y-scroll ">
        {showSearch && user
         ?
          <div onClick={addChat} className='flex items-center gap-[10px] p-[10px] px-[20px] cursor-pointer hover:bg-blue-500 transition-all duration-200'><img className='w-[35px] aspect-[1/1] rounded-full' src={user.avatar} alt="" />
            <p>{user.username}</p>
          </div>
         
          :
          chatData.map((item, index) => {
  if (!item?.userData) return null; // safely skip rendering this item

  return (
    <div
      onClick={() => setChat(item)}
      key={index}
      className="group flex items-center gap-[10px] p-[10px] px-[20px] cursor-pointer text-[13px] hover:bg-blue-500 transition-all duration-200 bg-gray-50 mt-0.5 rounded-xl"
    >
      <img
        className={`w-[35px] aspect-[1/1] rounded-full ${
          item.messageSeen || item.messageId === messagesId ? "" : "ring-3 ring-[#08b946]"
        }`}
        src={item.userData.avatar || assets.defaultAvatar}
        alt=""
      />
      <div className="flex flex-col">
        <p>{item.userData.name}</p>
        <span className="text-gray-400 text-[11px] group-hover:text-white">{item.lastMessage}</span>
      </div>
    </div>
  );
})
        }
      </div>

    </div>
  )
}

export default LeftSideBar