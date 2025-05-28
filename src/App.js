import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AIFace from './components/AIFace';
import SpeechRecognition from './services/SpeechRecognition';
import AIService from './services/AIService';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('ai_api_key') || '');
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  
  const speechRecognition = useRef(null);
  const aiService = useRef(null);
  
  useEffect(() => {
    // Initialize services
    speechRecognition.current = new SpeechRecognition();
    aiService.current = new AIService(apiKey);
    
    // Setup speech recognition events
    speechRecognition.current.onResult = handleSpeechResult;
    speechRecognition.current.onEnd = () => setIsListening(false);
    
    return () => {
      speechRecognition.current.cleanup();
    };
  }, [apiKey]);
  
  const handleSpeechResult = async (text) => {
    if (!text.trim()) return;
    
    setMessage(`Sen: ${text}`);
    setEmotion('listening');
    
    try {
      // Get response from AI
      const response = await aiService.current.getResponse(text);
      
      // Display AI response
      setMessage(`Yaoay: ${response}`);
      
      // Determine emotion based on response content
      determineEmotion(response);
      
      // Speak the response
      speakResponse(response);
    } catch (error) {
      console.error('AI response error:', error);
      setMessage('Üzgünüm, bir hata oluştu.');
      setEmotion('sad');
    }
  };
  
  const determineEmotion = (text) => {
    // Simple emotion detection based on keywords
    if (text.match(/üzgün|özür|hata|yapamıyorum/i)) {
      setEmotion('sad');
    } else if (text.match(/harika|mükemmel|sevindim|mutlu/i)) {
      setEmotion('happy');
    } else if (text.match(/düşünüyorum|analiz|hesaplıyorum/i)) {
      setEmotion('thinking');
    } else {
      setEmotion('neutral');
    }
  };
  
  const speakResponse = (text) => {
    setSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    
    utterance.onend = () => {
      setSpeaking(false);
      setEmotion('neutral');
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  const toggleListening = () => {
    if (isListening) {
      speechRecognition.current.stop();
    } else {
      setMessage('Dinliyorum...');
      setEmotion('listening');
      speechRecognition.current.start();
    }
    setIsListening(!isListening);
  };
  
  const saveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('ai_api_key', apiKey);
    aiService.current.setApiKey(apiKey);
    setMessage('API anahtarı kaydedildi.');
  };
  
  return (
    <div className="app-container">
      {message && (
        <div className="message-bubble">
          {message}
        </div>
      )}
      
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          
          <AIFace 
            emotion={emotion} 
            speaking={speaking} 
            position={[0, 0, 0]} 
          />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2 - 0.5}
            maxPolarAngle={Math.PI / 2 + 0.5}
          />
        </Canvas>
      </div>
      
      <div className="controls">
        <button 
          className={`mic-button ${isListening ? 'recording' : ''}`}
          onClick={toggleListening}
        >
          <i className={isListening ? 'fas fa-stop' : 'fas fa-microphone'}></i>
        </button>
      </div>
      
      {!apiKey && (
        <div className="api-key-modal">
          <form className="api-key-form" onSubmit={saveApiKey}>
            <h2>API Anahtarı Gerekli</h2>
            <p>Yapay zeka hizmetlerini kullanmak için bir API anahtarı gereklidir.</p>
            <input
              type="text"
              placeholder="API Anahtarınızı girin"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
            <button type="submit">Kaydet</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
