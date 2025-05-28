import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// This component renders a 3D robot face with different expressions
function AIFace({ emotion, speaking, position }) {
  const group = useRef();
  const eyeLeftRef = useRef();
  const eyeRightRef = useRef();
  const mouthRef = useRef();
  
  // Animation parameters
  const blinkInterval = useRef(null);
  const speakingAnimation = useRef(null);
  
  // Set up the 3D model and materials
  useEffect(() => {
    // Create robot face parts
    createRobotFace();
    
    // Set up blinking animation
    blinkInterval.current = setInterval(() => {
      if (eyeLeftRef.current && eyeRightRef.current) {
        blink();
      }
    }, 3000 + Math.random() * 2000);
    
    return () => {
      clearInterval(blinkInterval.current);
      if (speakingAnimation.current) {
        clearInterval(speakingAnimation.current);
      }
    };
  }, []);
  
  // Handle emotion changes
  useEffect(() => {
    if (!eyeLeftRef.current || !eyeRightRef.current || !mouthRef.current) return;
    
    updateExpression(emotion);
  }, [emotion]);
  
  // Handle speaking animation
  useEffect(() => {
    if (!mouthRef.current) return;
    
    if (speaking) {
      // Start mouth animation for speaking
      if (speakingAnimation.current) {
        clearInterval(speakingAnimation.current);
      }
      
      speakingAnimation.current = setInterval(() => {
        animateSpeaking();
      }, 150);
    } else {
      // Stop speaking animation
      if (speakingAnimation.current) {
        clearInterval(speakingAnimation.current);
        mouthRef.current.scale.y = 0.2; // Reset mouth
      }
    }
    
    return () => {
      if (speakingAnimation.current) {
        clearInterval(speakingAnimation.current);
      }
    };
  }, [speaking]);
  
  // Create the robot face parts
  const createRobotFace = () => {
    // Create materials
    const faceMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4285f4, 
      metalness: 0.8,
      roughness: 0.2
    });
    
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x66ffff,
      emissive: 0x33cccc,
      emissiveIntensity: 0.5
    });
    
    const mouthMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x66ffff,
      emissive: 0x33cccc,
      emissiveIntensity: 0.3
    });
    
    // Create face shape
    const faceGeometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const face = new THREE.Mesh(faceGeometry, faceMaterial);
    face.rotation.x = Math.PI * 0.1;
    group.current.add(face);
    
    // Create eyes
    const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    
    // Left eye
    const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eyeLeft.position.set(-0.3, 0.2, 0.85);
    eyeLeftRef.current = eyeLeft;
    group.current.add(eyeLeft);
    
    // Right eye
    const eyeRight = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eyeRight.position.set(0.3, 0.2, 0.85);
    eyeRightRef.current = eyeRight;
    group.current.add(eyeRight);
    
    // Create mouth
    const mouthGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.1);
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, -0.3, 0.85);
    mouthRef.current = mouth;
    group.current.add(mouth);
  };
  
  // Blink animation
  const blink = () => {
    const duration = 150;
    const startTime = Date.now();
    const initialScale = { y: 1 };
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Close eyes
      if (progress < 0.5) {
        const t = progress * 2;
        const scaleY = 1 - t;
        eyeLeftRef.current.scale.y = scaleY;
        eyeRightRef.current.scale.y = scaleY;
      } 
      // Open eyes
      else {
        const t = (progress - 0.5) * 2;
        const scaleY = t;
        eyeLeftRef.current.scale.y = scaleY;
        eyeRightRef.current.scale.y = scaleY;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        eyeLeftRef.current.scale.y = initialScale.y;
        eyeRightRef.current.scale.y = initialScale.y;
      }
    };
    
    animate();
  };
  
  // Speaking animation
  const animateSpeaking = () => {
    const mouthOpenValue = 0.1 + Math.random() * 0.2;
    mouthRef.current.scale.y = mouthOpenValue;
  };
  
  // Update facial expression based on emotion
  const updateExpression = (emotion) => {
    switch (emotion) {
      case 'happy':
        // Happy eyes (slightly squinted)
        eyeLeftRef.current.scale.y = 0.8;
        eyeRightRef.current.scale.y = 0.8;
        
        // Smile
        mouthRef.current.scale.y = 0.2;
        mouthRef.current.position.y = -0.25;
        mouthRef.current.geometry = new THREE.BoxGeometry(0.5, 0.1, 0.1);
        mouthRef.current.rotation.z = 0;
        mouthRef.current.rotation.x = 0.1;
        break;
        
      case 'sad':
        // Sad eyes (normal)
        eyeLeftRef.current.scale.y = 1;
        eyeRightRef.current.scale.y = 1;
        eyeLeftRef.current.position.y = 0.15;
        eyeRightRef.current.position.y = 0.15;
        
        // Frown
        mouthRef.current.scale.y = 0.2;
        mouthRef.current.position.y = -0.35;
        mouthRef.current.geometry = new THREE.BoxGeometry(0.5, 0.1, 0.1);
        mouthRef.current.rotation.z = 0;
        mouthRef.current.rotation.x = -0.1;
        break;
        
      case 'thinking':
        // Thinking eyes (one raised)
        eyeLeftRef.current.scale.y = 0.8;
        eyeRightRef.current.scale.y = 1;
        eyeLeftRef.current.position.y = 0.25;
        eyeRightRef.current.position.y = 0.2;
        
        // Neutral mouth
        mouthRef.current.scale.y = 0.2;
        mouthRef.current.position.y = -0.3;
        mouthRef.current.geometry = new THREE.BoxGeometry(0.3, 0.1, 0.1);
        mouthRef.current.rotation.z = 0;
        mouthRef.current.rotation.x = 0;
        break;
        
      case 'listening':
        // Alert eyes (wider)
        eyeLeftRef.current.scale.y = 1.2;
        eyeRightRef.current.scale.y = 1.2;
        eyeLeftRef.current.position.y = 0.2;
        eyeRightRef.current.position.y = 0.2;
        
        // Small mouth
        mouthRef.current.scale.y = 0.15;
        mouthRef.current.position.y = -0.3;
        mouthRef.current.geometry = new THREE.BoxGeometry(0.2, 0.1, 0.1);
        mouthRef.current.rotation.z = 0;
        mouthRef.current.rotation.x = 0;
        break;
        
      case 'neutral':
      default:
        // Neutral eyes
        eyeLeftRef.current.scale.y = 1;
        eyeRightRef.current.scale.y = 1;
        eyeLeftRef.current.position.y = 0.2;
        eyeRightRef.current.position.y = 0.2;
        
        // Neutral mouth
        mouthRef.current.scale.y = 0.2;
        mouthRef.current.position.y = -0.3;
        mouthRef.current.geometry = new THREE.BoxGeometry(0.4, 0.1, 0.1);
        mouthRef.current.rotation.z = 0;
        mouthRef.current.rotation.x = 0;
        break;
    }
  };
  
  // Subtle floating animation
  useFrame((state) => {
    if (!group.current) return;
    
    const time = state.clock.getElapsedTime();
    group.current.position.y = position[1] + Math.sin(time * 0.5) * 0.05;
    group.current.rotation.y = Math.sin(time * 0.3) * 0.1;
  });
  
  return (
    <group ref={group} position={position}>
      {/* The robot face parts are created in the createRobotFace function */}
    </group>
  );
}

export default AIFace;
