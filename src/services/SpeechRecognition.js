/**
 * Speech Recognition Service
 * 
 * This service handles voice input using the Web Speech API.
 * It provides methods to start and stop listening, and events for results.
 */
class SpeechRecognition {
  constructor() {
    // Check if browser supports speech recognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      console.error('Speech recognition is not supported in this browser.');
      return;
    }
    
    // Initialize speech recognition
    this.recognition = new SpeechRecognitionAPI();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'tr-TR'; // Turkish language
    
    // Event callbacks
    this.onResult = null;
    this.onEnd = null;
    this.onError = null;
    
    // Setup event listeners
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    if (!this.recognition) return;
    
    // Handle results
    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      // If we have a final result and a callback
      if (finalTranscript && typeof this.onResult === 'function') {
        this.onResult(finalTranscript);
      }
    };
    
    // Handle end of speech
    this.recognition.onend = () => {
      if (typeof this.onEnd === 'function') {
        this.onEnd();
      }
    };
    
    // Handle errors
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      if (typeof this.onError === 'function') {
        this.onError(event.error);
      }
      
      if (typeof this.onEnd === 'function') {
        this.onEnd();
      }
    };
  }
  
  // Start listening
  start() {
    if (!this.recognition) return;
    
    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  }
  
  // Stop listening
  stop() {
    if (!this.recognition) return;
    
    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
    }
  }
  
  // Clean up resources
  cleanup() {
    if (!this.recognition) return;
    
    try {
      this.recognition.stop();
    } catch (error) {
      // Ignore errors during cleanup
    }
    
    // Remove event listeners
    this.recognition.onresult = null;
    this.recognition.onend = null;
    this.recognition.onerror = null;
  }
}

export default SpeechRecognition;
