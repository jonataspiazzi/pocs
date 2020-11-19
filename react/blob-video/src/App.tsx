import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { assets } from './assets';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [video, setVideo] = useState<string>();

  function onLoad() {
    const request = new XMLHttpRequest();

    console.log('open sample ', assets.sample);
    request.open('GET', assets.sample);
    request.responseType = 'blob';

    request.addEventListener('loadstart', () => {
      setProgress(0);
    });

    request.addEventListener('progress', e => {
      setProgress(e.loaded);
    });

    request.addEventListener('load', e => {
      //const blob = new Blob([request.response], { type: 'video/mp4' });
      const data = URL.createObjectURL(request.response);
      setProgress(e.loaded);
      setVideo(data);
    });

    request.addEventListener('error', (...args: any) => {
      console.error('Request not completed. error trigged:', {
        args,
        response: request.response,
        responseText: request.responseText
      });
    });

    request.addEventListener('timeout', (...args: any) => {
      console.error('Request not completed. timeout trigged:', {
        args,
        response: request.response,
        responseText: request.responseText
      });
    });

    request.send();
  }

  function onPlay() {
    if (videoRef.current) {
      try {
        console.log('trying to start the video');
        videoRef.current.play();
      }
      catch (ex) {
        console.error('The play fail ', ex);
      }
    }
  }

  function onPause() {
    if (videoRef.current) videoRef.current.pause();
  }

  useEffect(() => {
    if (videoRef.current && video) {
      try {
        console.log('Appling ', video, ' to ', videoRef.current);
        videoRef.current.src = video;
      }
      catch (ex) {
        console.error('Was an error on try to apply the video file to the player.', ex);
      }
    }
  }, [videoRef, video]);

  return (
    <div className="App">
      <input type="button" value="load" onClick={onLoad} />
      <span className="progress">Bytes loaded: {progress}</span>
      <input type="button" value="play" onClick={onPlay} disabled={progress < 100} />
      <input type="button" value="pause" onClick={onPause} disabled={progress < 100} />
      <video src={null} ref={videoRef} width={368} height={207} />
    </div>
  );
}

export default App;
