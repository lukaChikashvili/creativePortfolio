import React from 'react'

const Lights = () => {
  return (
    <>
     <ambientLight intensity={1} />

<directionalLight
      castShadow
      position={[5, 5, 5]}
      intensity={1}
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />


    </>
  )
}

export default Lights
