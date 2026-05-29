import { useState, useEffect, useRef } from 'react';

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('enter'); // enter -> hold -> exit
  const videoRef = useRef(null);

  useEffect(() => {
    // Start the hold phase slightly after render
    const holdTimer = setTimeout(() => {
      setPhase('hold');
    }, 100);

    // Fallback timer in case the video doesn't play automatically (browsers block it, etc.)
    const fallbackTimer = setTimeout(() => {
      handleFinish();
    }, 8000);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleFinish = () => {
    setPhase('exit');
    setTimeout(() => {
      onFinish();
    }, 800); // match the CSS fade out duration
  };

  return (
    <div className={`splash-screen ${phase}`}>
      {/* Clean, minimalist layout like ChatGPT */}
      
      {/* Video Logo */}
      <div className="splash-logo-container" style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'center' }}>
        <video 
          ref={videoRef}
          src="/intro.mp4"
          autoPlay
          muted
          playsInline
          onEnded={handleFinish}
          className="splash-video"
        />
      </div>

      {/* Special Loading Animation */}
      <div className="splash-loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}
