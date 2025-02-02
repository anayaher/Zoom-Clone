'use client'
import { useGetCalls } from '@/hooks/useGetCalls'
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';


import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard';
import Loader from './loader';

const CallList = ({type} :{type:'ended' |'upcoming' | 'recordings' }) => {

    const{endedCalls,upcomingCalls,CallRecordings,isLoading} = useGetCalls();
    const router = useRouter();
    const [recordings, setrecordings] = useState<CallRecording[]>([]);

    const getCalls = ()=>
        {
            switch (type) {
                case 'ended':
                    return endedCalls;
                case 'recordings':
                    return recordings;
                case 'upcoming':
                    return upcomingCalls;
                default:
                    return '';
            }
        }

        const noCallsMessage = ()=>
            {
                switch (type) {
                    case 'ended':
                        return 'No Previous Meetings';
                    case 'recordings':
                        return 'No Recordings';
                    case 'upcoming':
                        return 'No Upcoming Meetings';
                    default:
                        return '';
                }
            }

            useEffect(() => {
                const fetchRecordings = async () => {
                  const callData = await Promise.all(
                    CallRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
                  );
            
                  const recordings = callData
                    .filter((call) => call.recordings.length > 0)
                    .flatMap((call) => call.recordings);
            
                  setrecordings(recordings);
                };
            
                if (type === 'recordings') {
                  fetchRecordings();
                }
              }, [type, CallRecordings]);
            
              if (isLoading) return <Loader />;
            
           
            const calls = getCalls();
            const callsMessage = noCallsMessage();

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
    {calls && calls.length > 0 ? (
      calls.map((meeting: Call | CallRecording) => (
        <MeetingCard
          key={(meeting as Call).id}
          icon={
            type === 'ended'
              ? '/icons/previous.svg'
              : type === 'upcoming'
                ? '/icons/upcoming.svg'
                : '/icons/recordings.svg'
          }
          title={
            (meeting as Call).state?.custom?.description ||
            (meeting as CallRecording).filename?.substring(0, 20) ||
            'No Description'
          }
          date={
            (meeting as Call).state?.startsAt?.toLocaleString() ||
            (meeting as CallRecording).start_time?.toLocaleString()
          }
          isPreviousMeeting={type === 'ended'}
          link={
            type === 'recordings'
              ? (meeting as CallRecording).url
              : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
          }
          buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
          buttonText={type === 'recordings' ? 'Play' : 'Start'}
          handleClick={
            type === 'recordings'
              ? () => router.push(`${(meeting as CallRecording).url}`)
              : () => router.push(`/meeting/${(meeting as Call).id}`)
          }
        />
      ))
    ) : (
      <h1 className="text-2xl font-bold text-white">{callsMessage}</h1>
    )}
  </div>
);
  
  
}

export default CallList