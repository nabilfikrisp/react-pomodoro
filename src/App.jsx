import {
    IconAlarmMinus,
    IconAlarmPlus,
    IconPlayerPause,
    IconPlayerPlay,
    IconRefresh,
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

const App = () => {
    const [breakCount, setBreakCount] = useState(5);
    const [sessionCount, setSessionCount] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [timerLabel, setTimerLabel] = useState('Session');
    const [isPlaying, setIsPlaying] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            const id = setInterval(() => {
                setTimeLeft((prevCount) => {
                    if (prevCount === 0) {
                        if (timerLabel === 'Session') {
                            setTimerLabel('Break');
                            audioRef.current.play();
                            return breakCount * 60;
                        } else if (timerLabel === 'Break') {
                            setTimerLabel('Session');
                            audioRef.current.pause();
                            audioRef.current.currentTime = 0;
                            return sessionCount * 60;
                        }
                    } else {
                        return prevCount - 1;
                    }
                });
            }, 1000);
            setIntervalId(id);
            return () => clearInterval(id);
        } else {
            clearInterval(intervalId);
        }
    }, [isPlaying, timeLeft]);


    const handleReset = () => {
        clearInterval(intervalId);
        setIsPlaying(false);
        setTimeLeft(25 * 60);
        setBreakCount(5);
        setSessionCount(25);
        setTimerLabel('Session');
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    };

    const handlePlayPause = () => {
        setIsPlaying((prevPlaying) => !prevPlaying);
    };

    const convertTime = (count) => {
        if (timeLeft < 0) return '00:00';
        const minutes = `0${Math.floor(count / 60)}`.slice(-2);
        const seconds = `0${count % 60}`.slice(-2);
        return `${minutes}:${seconds}`;
    };

    const handleBreakDecrease = () => {
        if (breakCount > 1) {
            setBreakCount(breakCount - 1);
        }
    };

    const handleBreakIncrease = () => {
        if (breakCount < 60) {
            setBreakCount(breakCount + 1);
        }
    };

    const handleSessionDecrease = () => {
        if (sessionCount > 1) {
            setSessionCount(sessionCount - 1);
            setTimeLeft((sessionCount - 1) * 60);
        }
    };

    const handleSessionIncrease = () => {
        if (sessionCount < 60) {
            setSessionCount(sessionCount + 1);
            setTimeLeft((sessionCount + 1) * 60);
        }
    };

    return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-teal-700 font-cond font-semibold text-slate-50'>
            <div className='flex gap-x-2'>
                <SetTimer
                    title={'Break Length'}
                    type={'break'}
                    count={breakCount}
                    handleDecrease={handleBreakDecrease}
                    handleIncrease={handleBreakIncrease}
                />
                <SetTimer
                    title={'Session Length'}
                    type={'session'}
                    count={sessionCount}
                    handleDecrease={handleSessionDecrease}
                    handleIncrease={handleSessionIncrease}
                />
            </div>
            <div className='clock-conatiner flex flex-col items-center'>
                <div className='mb-8 flex flex-col gap-y-2 rounded-lg border-4 p-12 px-24 text-center text-3xl font-semibold'>
                    <h1 id='timer-label'>
                        {timerLabel === 'Session' ? 'Session' : 'Break'}
                    </h1>
                    <span className='text-7xl' id='time-left'>
                        {convertTime(timeLeft)}
                    </span>
                </div>
                <div className='flex gap-x-4'>
                    <button
                        id='start_stop'
                        onClick={() => {
                            handlePlayPause();
                        }}
                    >
                        {isPlaying ? (
                            <IconPlayerPause className='h-10 w-10 transition duration-150 ease-in-out hover:scale-125' />
                        ) : (
                            <IconPlayerPlay className='h-10 w-10 transition duration-150 ease-in-out hover:scale-125' />
                        )}
                    </button>
                    <button
                        id='reset'
                        onClick={() => {
                            handleReset();
                        }}
                    >
                        <IconRefresh className='h-10 w-10 rounded-xl transition duration-150 ease-in-out hover:scale-125' />
                    </button>
                </div>
            </div>
            <audio
                src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'
                id='beep'
                preload='auto'
                ref={audioRef}
            ></audio>
        </div>
    );
};

const SetTimer = (props) => {
    return (
        <div className='timer-container m-5 text-center'>
            <h1 className='text-3xl font-bold' id={props.type + '-label'}>
                {props.title}
            </h1>
            <div className='actions-wrapper m-2 flex items-center justify-center p-2 text-xl'>
                <button
                    onClick={() => props.handleDecrease(props.type)}
                    id={props.type + '-decrement'}
                >
                    <IconAlarmMinus className='h-12 w-12 transition duration-150 ease-in-out hover:scale-125' />
                </button>
                <span className='mx-3 text-4xl' id={props.type + '-length'}>
                    {props.count}
                </span>
                <button
                    onClick={() => props.handleIncrease(props.type)}
                    id={props.type + '-increment'}
                >
                    <IconAlarmPlus className='h-12 w-12 transition duration-150 ease-in-out hover:scale-125' />
                </button>
            </div>
        </div>
    );
};

export default App;
