import { useUser } from '@/context/UserContext';
import React from 'react'

const Lights = () => {

  const { isNight } = useUser();


  return (
    <>
    
      <ambientLight intensity={isNight ? 0.1 : 1}  />

    
      {!isNight && (
        <directionalLight
          castShadow
          position={[5, 5, 5]}
          intensity={1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
      )}

   
      {isNight && (
        <spotLight
          position={[2, 3, 5]}
          angle={2}
          intensity={40}
          penumbra={5}
          castShadow
          color="#fff"
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
      )}

{isNight && (
        <spotLight
          position={[-10, 15, 2]}
          angle={2}
          intensity={60}
          penumbra={5}
          castShadow
          color="#fff"
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
      )}



    </>
  )
}

export default Lights
