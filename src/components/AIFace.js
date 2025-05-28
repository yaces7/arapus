import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

// This component renders a 3D robot face with different expressions
function AIFace({ emotion, speaking, position }) {
  const groupRef = useRef();
  const eyeLeftRef = useRef();
  const eyeRightRef = useRef();
  const mouthRef = useRef();
  
  const [blinking, setBlinking] = useState(false);
  const [mouthHeight, setMouthHeight] = useState(0.1);
  const [mouthPosY, setMouthPosY] = useState(-0.3);
  const [mouthRotX, setMouthRotX] = useState(0);
  const [mouthWidth, setMouthWidth] = useState(0.4);
  const [eyeLeftScale, setEyeLeftScale] = useState({ x: 1, y: 1, z: 1 });
  const [eyeRightScale, setEyeRightScale] = useState({ x: 1, y: 1, z: 1 });
  const [eyeLeftPosY, setEyeLeftPosY] = useState(0.2);
  const [eyeRightPosY, setEyeRightPosY] = useState(0.2);
  
  // Set up blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(blinkInterval);
  }, []);
  
  // Handle emotion changes
  useEffect(() => {
    updateExpression(emotion);
  }, [emotion]);
  
  // Handle speaking animation
  useEffect(() => {
    let speakingInterval;
    
    if (speaking) {
      speakingInterval = setInterval(() => {
        const mouthOpenValue = 0.1 + Math.random() * 0.2;
        setMouthHeight(mouthOpenValue);
      }, 150);
    } else {
      setMouthHeight(0.1);
    }
    
    return () => {
      if (speakingInterval) clearInterval(speakingInterval);
    };
  }, [speaking]);
  
  // Update facial expression based on emotion
  const updateExpression = (emotion) => {
    switch (emotion) {
      case 'happy':
        setEyeLeftScale({ x: 1, y: 0.8, z: 1 });
        setEyeRightScale({ x: 1, y: 0.8, z: 1 });
        setEyeLeftPosY(0.2);
        setEyeRightPosY(0.2);
        setMouthPosY(-0.25);
        setMouthWidth(0.5);
        setMouthRotX(0.1);
        break;
        
      case 'sad':
        setEyeLeftScale({ x: 1, y: 1, z: 1 });
        setEyeRightScale({ x: 1, y: 1, z: 1 });
        setEyeLeftPosY(0.15);
        setEyeRightPosY(0.15);
        setMouthPosY(-0.35);
        setMouthWidth(0.5);
        setMouthRotX(-0.1);
        break;
        
      case 'thinking':
        setEyeLeftScale({ x: 1, y: 0.8, z: 1 });
        setEyeRightScale({ x: 1, y: 1, z: 1 });
        setEyeLeftPosY(0.25);
        setEyeRightPosY(0.2);
        setMouthPosY(-0.3);
        setMouthWidth(0.3);
        setMouthRotX(0);
        break;
        
      case 'listening':
        setEyeLeftScale({ x: 1, y: 1.2, z: 1 });
        setEyeRightScale({ x: 1, y: 1.2, z: 1 });
        setEyeLeftPosY(0.2);
        setEyeRightPosY(0.2);
        setMouthPosY(-0.3);
        setMouthWidth(0.2);
        setMouthRotX(0);
        break;
        
      case 'neutral':
      default:
        setEyeLeftScale({ x: 1, y: 1, z: 1 });
        setEyeRightScale({ x: 1, y: 1, z: 1 });
        setEyeLeftPosY(0.2);
        setEyeRightPosY(0.2);
        setMouthPosY(-0.3);
        setMouthWidth(0.4);
        setMouthRotX(0);
        break;
    }
  };
  
  // Subtle floating animation
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.05;
    groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
  });
  
  return (
    <group ref={groupRef} position={position}>
      {/* Face */}
      <mesh rotation={[0.1, 0, 0]}>
        <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial 
          color="#4285f4" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Left Eye */}
      <mesh 
        ref={eyeLeftRef}
        position={[-0.3, eyeLeftPosY, 0.85]} 
        scale={[eyeLeftScale.x, blinking ? 0.1 : eyeLeftScale.y, eyeLeftScale.z]}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#66ffff" 
          emissive="#33cccc" 
          emissiveIntensity={0.5} 
        />
      </mesh>
      
      {/* Right Eye */}
      <mesh 
        ref={eyeRightRef}
        position={[0.3, eyeRightPosY, 0.85]} 
        scale={[eyeRightScale.x, blinking ? 0.1 : eyeRightScale.y, eyeRightScale.z]}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#66ffff" 
          emissive="#33cccc" 
          emissiveIntensity={0.5} 
        />
      </mesh>
      
      {/* Mouth */}
      <mesh 
        ref={mouthRef}
        position={[0, mouthPosY, 0.85]} 
        rotation={[mouthRotX, 0, 0]}
      >
        <boxGeometry args={[mouthWidth, mouthHeight, 0.1]} />
        <meshStandardMaterial 
          color="#66ffff" 
          emissive="#33cccc" 
          emissiveIntensity={0.3} 
        />
      </mesh>
    </group>
  );
}

export default AIFace;
