import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

export default function App() {
  const assetBaseUrl = import.meta.env.BASE_URL;
  const [noButtonScale, setNoButtonScale] = useState(1);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 120 });
  const [showCelebration, setShowCelebration] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hideNoButton, setHideNoButton] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const celebrationSoundRef = useRef<HTMLAudioElement>(null);

  // Monitor background music and restart if it stops unexpectedly
  useEffect(() => {
    const bgMusic = bgMusicRef.current;
    if (!bgMusic) return;

    const handlePause = () => {
      // If music is paused but we want it playing (and user has started music)
      if (musicStarted && bgMusic.paused) {
        bgMusic.play().catch(err => console.log('Could not resume music:', err));
      }
    };

    bgMusic.addEventListener('pause', handlePause);
    return () => bgMusic.removeEventListener('pause', handlePause);
  }, [musicStarted]);

  const startMusic = async () => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.3;
      try {
        await bgMusicRef.current.play();
        setMusicStarted(true);
      } catch (error) {
        console.log('Could not play music:', error);
      }
    }
  };


  const handleNoHover = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // After 7 attempts, hide the button completely
    if (newAttempts >= 7) {
      setHideNoButton(true);
      return;
    }

    // Shrink the button
    const newScale = Math.max(0.1, noButtonScale - 0.15);
    setNoButtonScale(newScale);

    // Teleport to random position
    const maxX = window.innerWidth - 150;
    const maxY = window.innerHeight - 100;
    const newX = Math.random() * maxX - maxX / 2;
    const newY = Math.random() * maxY - maxY / 2;
    
    setNoButtonPosition({ x: newX, y: newY });
  };

  const handleYesClick = () => {
    // Play celebration sound at lower volume (background music continues)
    if (celebrationSoundRef.current) {
      celebrationSoundRef.current.volume = 0.4;
      celebrationSoundRef.current.play();
    }
    // Ensure background music is still playing
    if (bgMusicRef.current && bgMusicRef.current.paused) {
      bgMusicRef.current.play();
    }
    setShowCelebration(true);
  };

  // Get message based on attempts
  const getMessage = () => {
    if (attempts >= 5) {
      return "Are you sure saying no? 🥺";
    } else if (attempts > 3) {
      return "The button is running away! 😄 Maybe it's a sign...";
    }
    return null;
  };

  return (
    <div
  className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-200 flex items-center justify-center overflow-hidden relative">

      {/* Audio elements */}
      {/* Replace these src URLs with your own audio files */}
      <audio ref={bgMusicRef} loop>
        <source src={`${assetBaseUrl}loveSong.mp3`} type="audio/mpeg" />
        {/* To add your own music: Place an MP3 file in the /public folder named "love-song.mp3" */}
        {/* Or use a URL: <source src="https://your-audio-url.com/song.mp3" type="audio/mpeg" /> */}
      </audio>
      <audio ref={celebrationSoundRef}>
        <source src={`${assetBaseUrl}buttonSound.mp3`} type="audio/mpeg" />
        {/* To add your own sound: Place an MP3 file in the /public folder named "celebration.mp3" */}
      </audio>

      {/* Trademark/Credit Footer */}
      <motion.div 
        className="absolute bottom-4 left-0 right-0 text-center z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-gray-600 text-sm">
          Made with ❤️ by{' '}
          <a 
            href="https://github.com/vctrmmnlbrbn" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-600 font-medium transition-colors underline"
          >
            @vctrmmnlbrbn
          </a>
        </p>
      </motion.div>

      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 50,
              opacity: 0.3,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: -100,
              x: Math.random() * window.innerWidth,
              rotate: Math.random() * 360
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          >
            <Heart fill="currentColor" size={24} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {!musicStarted && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-pink-200 via-red-100 to-pink-300 z-50 flex items-center justify-center cursor-pointer"
            onClick={startMusic}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="text-red-500 mx-auto mb-6" size={80} fill="currentColor" />
              <h2 className="text-5xl font-bold text-red-600 mb-4">
                Click to Start 💕
              </h2>
              <p className="text-xl text-gray-600">
                Tap anywhere to begin...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!showCelebration ? (
          <motion.div 
            className="text-center z-10 px-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {/* Title */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <h1 className="text-6xl md:text-8xl font-bold text-red-600 mb-4 drop-shadow-lg">
                Hey You! 💕
              </h1>
            </motion.div>

            <motion.p 
              className="text-3xl md:text-4xl text-gray-700 mb-12 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Will you be my Valentine? 🌹
            </motion.p>

            {/* Buttons Container */}
            <div className="flex flex-col items-center gap-8 relative h-40">
              {/* Yes Button */}
              <motion.button
                onClick={handleYesClick}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-6 px-16 rounded-full text-2xl shadow-xl transition-colors flex items-center gap-3"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart fill="currentColor" size={28} />
                Yes! 💖
                <Heart fill="currentColor" size={28} />
              </motion.button>

              {/* No Button - Teleporting and Shrinking, then disappearing */}
              {!hideNoButton && (
                <motion.button
                  ref={noButtonRef}
                  onMouseEnter={handleNoHover}
                  onClick={handleNoHover}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg absolute cursor-pointer"
                  style={{
                    scale: noButtonScale,
                    x: noButtonPosition.x,
                    y: noButtonPosition.y,
                  }}
                  animate={{
                    scale: noButtonScale,
                    x: noButtonPosition.x,
                    y: noButtonPosition.y,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  No
                </motion.button>
              )}
            </div>

            {/* Progressive messages */}
            <AnimatePresence mode="wait">
              {getMessage() && (
                <motion.p
                  key={getMessage()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-pink-600 mt-8 text-lg font-medium"
                >
                  {getMessage()}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Message when button disappears */}
            {hideNoButton && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-red-600 mt-8 text-xl font-bold"
              >
                The "No" option has left the chat! 😊💕
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center z-10 px-4"
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          >
            {/* Celebration Screen */}
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <h1 className="text-7xl md:text-9xl font-bold text-red-600 mb-6 drop-shadow-lg">
                Yay! 🎉
              </h1>
            </motion.div>

            <p className="text-4xl md:text-5xl text-gray-700 mb-4 font-medium">
              I knew you'd say yes! 💕
            </p>

            <motion.p 
              className="text-5xl md:text-6xl text-red-500 mb-8 font-bold"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              I Love You! ❤️
            </motion.p>

            <div className="flex justify-center gap-4 flex-wrap mb-8">
              {['❤️', '💕', '💖', '💗', '💝', '💘'].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="text-6xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    delay: i * 0.1,
                    rotate: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </div>

            <motion.p 
              className="text-2xl text-gray-600 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Happy Valentine's Day! 🌹✨
            </motion.p>

            {/* Sparkles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                >
                  <Sparkles className="text-yellow-400" size={20} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
