"use client"
import Experience from '@/components/Experience';
import Lights from '@/components/Lights';
import { Canvas } from '@react-three/fiber'

export default function Home() {
  return (
   <>
    <Canvas camera={{
        position: [-5, 6, 12],  
        fov: 45, 
        near: 0.1, 
        far: 1000
      }}>
      <Lights />
      <Experience />
    </Canvas>
   </>
  );
}
