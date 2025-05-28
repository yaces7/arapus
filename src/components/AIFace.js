import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

// This component renders a 3D robot face with different expressions
function AIFace({ emotion, speaking, position }) {
  const groupRef = useRef();
  const eyeLeftRef = useRef();
  const eyeRightRef = useRef();
  const mouthRef = useRef();
  const teethRef = useRef();
  
  const [blinking, setBlinking] = useState(false);
  const [mouthHeight, setMouthHeight] = useState(0.1);
  const [mouthPosY, setMouthPosY] = useState(-0.3);
  const [mouthRotX, setMouthRotX] = useState(0);
  const [mouthWidth, setMouthWidth] = useState(0.4);
  const [showTeeth, setShowTeeth] = useState(false);
  const [teethScale, setTeethScale] = useState(0);
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
        const mouthOpenValue = 0.1 + Math.random() * 0.3;
        setMouthHeight(mouthOpenValue);
        
        // Randomly show teeth while speaking
        if (Math.random() > 0.7) {
          setShowTeeth(true);
          setTeethScale(mouthOpenValue * 0.7);
        } else {
          setShowTeeth(false);
          setTeethScale(0);
        }
      }, 150);
    } else {
      setMouthHeight(0.1);
      setShowTeeth(false);
      setTeethScale(0);
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
      {/* Face - Triangle/Pentagon Shape */}
      <mesh rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0, 1.2, 1.8, 5, 1, false]} />
        <meshStandardMaterial 
          color="#4285f4" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Face Base - For a more complete look */}
      <mesh position={[0, -0.4, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 0.4, 5, 1, false]} />
        <meshStandardMaterial 
          color="#3a75d9" 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>
      
      {/* Left Eye */}
      <mesh 
        ref={eyeLeftRef}
        position={[-0.35, eyeLeftPosY, 0.7]} 
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
        position={[0.35, eyeRightPosY, 0.7]} 
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
        position={[0, mouthPosY, 0.75]} 
        rotation={[mouthRotX, 0, 0]}
      >
        <boxGeometry args={[mouthWidth, mouthHeight, 0.1]} />
        <meshStandardMaterial 
          color="#333333" 
          metalness={0.2} 
          roughness={0.8} 
        />
      </mesh>
      
      {/* Teeth */}
      {showTeeth && (
        <group position={[0, mouthPosY, 0.8]} rotation={[mouthRotX, 0, 0]}>
          {/* Upper Teeth */}
          <mesh position={[0, mouthHeight/2 - 0.02, 0]} ref={teethRef}>
            <boxGeometry args={[mouthWidth * 0.9, 0.04, 0.05]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          
          {/* Lower Teeth */}
          <mesh position={[0, -mouthHeight/2 + 0.02, 0]} scale={[1, teethScale, 1]}>
            <boxGeometry args={[mouthWidth * 0.8, 0.04, 0.05]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          
          {/* Individual Teeth Lines */}
          {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
            <mesh key={i} position={[x, 0, 0.03]} scale={[0.01, mouthHeight * 0.9, 0.05]}>
              <boxGeometry />
              <meshStandardMaterial color="#dddddd" />
            </mesh>
          ))}
        </group>
      )}
      
      {/* Antennas */}
      <mesh position={[-0.3, 0.8, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-0.3, 1.05, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
      
      <mesh position={[0.3, 0.8, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.3, 1.05, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#33ff33" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default AIFace;
