"use client"
import { DeviceSettings, VideoPreview, useCall } from '@stream-io/video-react-sdk'


import { Camera } from 'lucide-react';
import { Input } from 'postcss';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';

const MeetingSetup = ( { setIsSetupLoaded } : { setIsSetupLoaded : (value:boolean) => void}) => {

    const [isMicCamToggledOn, setisMicCamToggledOn] = useState(false);
    const call = useCall();

    useEffect(() => {

        if(isMicCamToggledOn)
            {
                call?.camera.disable();
                call?.microphone.disable();
            }
           else{
            call?.camera.enable();
            call?.microphone.enable();
           }

       

        
        
    }, [isMicCamToggledOn,call?.camera,call?.microphone]);
  return (


    <div
    className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white '>
        <h1 className='text-2xl font-bold'>Setup</h1>
        <VideoPreview/>
        <div
         className='flex h-16 items-center justify-center gap-3'>
          <label className='flex items-center justify-center gap-2 font-medium'>
            <input type='checkbox'checked={isMicCamToggledOn} onChange={(e)=>{setisMicCamToggledOn(e.target.checked)}}/>

            Join With Mic And Camera Off
          </label>

          <DeviceSettings
          >

          </DeviceSettings>
         </div>
         <Button
         onClick={()=>{
          call?.join();

          setIsSetupLoaded(true);
         }}
         
          className='rounded-mg bg-green-500 px-4 py-2'>
            Join Meeting
          </Button>
    </div>
  )
}

export default MeetingSetup