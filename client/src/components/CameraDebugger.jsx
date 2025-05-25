"use client"

import { useControls } from 'leva'
import { useThree } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'


export default function CameraDebugger() {
  const { camera } = useThree()

  const pos = useControls('Camera Position', {
    x: { value: camera.position.x, min: -20, max: 20, step: 0.1 },
    y: { value: camera.position.y, min: -20, max: 20, step: 0.1 },
    z: { value: camera.position.z, min: -20, max: 20, step: 0.1 },
  })


  useFrame(() => {
    camera.position.set(pos.x, pos.y, pos.z)
  })

  return null
}
