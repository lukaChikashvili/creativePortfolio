import { Html, OrbitControls, Text, Text3D, useGLTF, useTexture } from '@react-three/drei'
import React, { useEffect, useRef, useState } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber';

const Experience = () => {
  const model = useGLTF('./bus_stop.glb');
  const bus = useGLTF('./bus.glb')
  const me = useGLTF('./characterbody.glb')

  // text
  const [text, setText] = useState(`Waiting for\nnew opportunities`)

  const busRef = useRef();
  const wheelRefs = useRef([]);
  const fence = useTexture('./fence.png');


  const animationState = useRef('movingIn'); 
  const pauseStart = useRef(0);
  const waitStart = useRef(0);

  function getRandomColor() {
    const colors = ['#537FE7', '#E75480', '#32CD32', '#FFD700', '#FF8C00', '#8A2BE2', '#00CED1'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  useFrame((state, delta) => {
    const busObj = busRef.current;
    if (!busObj) return;

    const t = state.clock.getElapsedTime();

    if (animationState.current === 'movingIn') {
      if (busObj.position.x > 2) {
        busObj.position.x -= 0.05;
      } else {
        animationState.current = 'paused';
        pauseStart.current = t;
      }
    }

    else if (animationState.current === 'paused') {
      if (t - pauseStart.current >= 2) {
        animationState.current = 'movingOut';
      }
    }

    else if (animationState.current === 'movingOut') {
      if (busObj.position.x > -15) {
        busObj.position.x -= 0.05;
      } else {
        animationState.current = 'waiting';
        waitStart.current = t;
      }
    }

    else if (animationState.current === 'waiting') {
      if (t - waitStart.current >= 6) { 
        busObj.position.x = 55;
        animationState.current = 'movingIn';

        bus.scene.traverse((child) => {
          if (child.isMesh && child.name === "Object_9") {
            child.material.color.set(getRandomColor());
          }
        });
      }
    }
  });

  useEffect(() => {
    model.scene.traverse((child) => {
      if (child.isMesh) {
        if (child.name === "Object_8") {
          child.material.emissive.set('orange');
          child.material.emissiveIntensity = 3;
        }
        if (child.name === "Object_5") {
          child.material.emissive.set('orange');
          child.material.emissiveIntensity = 1.5;
        }
        if (child.name === "Object_6") {
          child.material.map = fence
          child.material.transparent = true
          child.material.alphaMap = fence
          child.material.side = THREE.DoubleSide
          child.material.color.set(0x222222)
          child.material.metalness = 0.9
          child.material.roughness = 0.4
          child.material.needsUpdate = true
        }
        if (child.name === "Object_9") {
          child.material.color.set('black');
        }
        if (child.name === "Object_4") {
          child.material.color.set('#EFEEEA');
        }
      }
    });
  }, [model]);

  useEffect(() => {
    bus.scene.traverse((child) => {
      if (child.isMesh) {
        if (child.name === "Object_9") {
          child.material.color.set('#537FE7')
        }
        if (child.name === "Object_35") {
          wheelRefs.current.push(child);
        }
      }
    })
  }, [bus]);

  return (
    <>
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={1} intensity={2} />
      </EffectComposer>

      <group position={[0, 0, 0]}>
        <primitive shadow object={model.scene} scale={2} position={[-1, -1, 0]} />
        <primitive ref={busRef} object={bus.scene} scale={1} rotation={[0, -1.5, 0]} position={[15, 0, 4]} />
        <primitive object={me.scene} scale={0.5} position={[0, 0, 3]} />
      </group>

      <mesh receiveShadow position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#C8ACD6" />
      </mesh>

      <Text3D
        font="./helvetiker_regular.typeface.json"
        size={0.75}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.0005}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
        position={[-4, -1.1, 2]}
        rotation={[-Math.PI / 2, 0, 0]}>
        {text}
        <meshStandardMaterial color="white" />
      </Text3D>
    </>
  );
}

export default Experience;
