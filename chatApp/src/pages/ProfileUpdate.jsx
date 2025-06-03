import React, { useContext, useEffect } from 'react'
import assets from '../assets/assets'
import { useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc , getDoc, updateDoc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../lib/upload';
import { AppContext } from '../context/AppContext';


const ProfileUpdate = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(false);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [uid, setUid] = useState('');
    const [preImage, setPreImage] = useState('');
    const {setUserData} = useContext(AppContext);

    const ProfileUpdate = async (event) => {
        event.preventDefault()
        try {
          if(!preImage && !image){
            toast.error('Please upload profile image');
          }
          const docRef = doc(db, "users", uid);
          if(image){
            const imgUrl = await upload(image);
            setPreImage(imgUrl);
            await updateDoc(docRef, {
              avatar: imgUrl,
              bio:bio,
              name:name,
            });
          }
          else{
            await updateDoc(docRef, {
              bio:bio,
              name:name,
            });
          }
          const snap = await getDoc(docRef);
          setUserData(snap.data());
          navigate('/chat');
        } catch (error) {
          console.error("Error updating profile:", error);
          toast.error(error.message)
        }
    }

    useEffect(() =>{
      onAuthStateChanged(auth, async(user) =>{
        if(user){
          setUid(user.uid);
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if(docSnap.data().name){
            setName(docSnap.data().name);
          }
           if(docSnap.data().bio){
            setBio(docSnap.data().bio);
          }
          // if(docSnap.data().avatar){
          //   setPreImage(docSnap.data().avatar);
          // }
          else{
            navigate('/');
          }
        }
      })
    },[])

  return (
    <div className='profile min-h-[100vh] flex items-center justify-center bg-[url(./background.jpg)] bg-cover bg-no-repeat bg-center'>
      <div className="profile-container bg-white flex items-center justify-between min-w-[700px] rounded-xl">
        <form onSubmit={ProfileUpdate} className='flex flex-col gap-[20px] p-[40px] '>
          <h3 className='font-medium'> Profile Details </h3>
            <label className='flex items-center gap-[10px] text-gray-400 cursor-pointer' htmlFor="avatar">
              <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='avatar' hidden/>
              <img className='w-[50px] aspect-[1/1] rounded-full' src={image ? URL.createObjectURL(image) :  assets.avatar_icon} alt="" />
               Upload Profile image
            </label>
            <input onChange={(e)=>setName(e.target.value)} value={name} className='p-[10px] min-w-[300px] border border-[#c9c9c9] outline-[#077eff] ' type="text" placeholder='Name' />

            <textarea onChange={(e)=>setBio(e.target.value)} value={bio} className='p-[10px] min-w-[300px] border border-[#c9c9c9] outline-[#077eff]'  placeholder="Profile Bio " id=""></textarea>

            <button className='border-none text-white bg-[#077eff] p-[8px] text-[16px] cursor-pointer' type='submit'>Save</button>
        </form>
        <img className='profile-pic max-w-[160px] aspect-[1/1] mt-[20px] mx-auto rounded-full' src={image ? URL.createObjectURL(image) : preImage ? preImage : assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate