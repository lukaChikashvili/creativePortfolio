import { Float, Html, OrbitControls, Stars, Text, Text3D, useGLTF, useMatcapTexture, useTexture } from '@react-three/drei'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three'
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import gsap from 'gsap'




const Experience = () => {
  const model = useGLTF('./bus_stop.glb');
  const bus = useGLTF('./bus.glb')
  const me = useGLTF('./characterbody.glb')

  // audio effects
  const busSound = new Audio('./bus.mp3');
  const busDoor = new Audio('./busDoor.wav');
  const pop = new Audio('./pop.wav');




 // navigation
 const [nav, setNav] = useState(false);
 const [home, setHome] = useState(false);

 const menuImg = useLoader(THREE.TextureLoader, './menu.png');



  //refs
  const busStopRef = useRef();
  const clouds = useRef();
  const menuRef = useRef();


  const [showScene, setShowScene] = useState(false);

  // matcap
  const matcap = useLoader(THREE.TextureLoader, './reflect.jpg');
  const matcapGold = useLoader(THREE.TextureLoader, './gold.jpg');

  const textGroupRef = useRef();

  // text
  const [text, setText] = useState(`Waiting for\nnew opportunities`);
  const [textIndex, setTextIndex] = useState(0);

  const texts = [`Waiting for\nnew opportunities`, `Creative web \ndeveloper `, `Based in \ntbilisi, georgia`];

  const busRef = useRef();
  const wheelRefs = useRef([]);
  const fence = useTexture('./fence.png');

  const groupRef = useRef();

   // raycaster
   const raycaster = new THREE.Raycaster();
   const mouse = new THREE.Vector2();

   const [isClicked, setIsClicked] = useState(false);

   const cameraRef = useRef();



  // text animation
  useEffect(() => {
    if (!textGroupRef.current) return;

    gsap.fromTo(
      textGroupRef.current.position,
      { y: -2 },
      {
        y: -1.1, 
        duration: 1.2,
        delay: 2,
        ease: 'power3.out'
      }

      
    );

    setTimeout(() => {
      pop.play();
    }, [2000]);


    
  }, [text])
  

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
      if (busObj.position.x > 0.5) {
        busObj.position.x -= 0.05;
        busSound.play();
      } else {
        animationState.current = 'paused';
        pauseStart.current = t;
        busDoor.play();
      }
    }

    else if (animationState.current === 'paused') {
      if (t - pauseStart.current >= 2) {
        animationState.current = 'movingOut';
        const nextIndex = (textIndex + 1) % texts.length;
        setText(texts[nextIndex]);
        setTextIndex(nextIndex);
        
      }
    }

    else if (animationState.current === 'movingOut') {
      if (busObj.position.x > -15) {
        busObj.position.x -= 0.05;
        busSound.play();
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


    if (cameraRef.current) {
     
      if (isClicked) {
        gsap.to(cameraRef.current.position, {
          x: 10,
          y: 3,
          z: 10,
          duration: 2,
          ease: "power3.out",
          onComplete: () => setIsClicked(false), 
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
        if (child.isMesh && child.name === "Object_5") {
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
  }, [bus, menuImg]);

  const { camera } = useThree();

  const originalCameraPosition = useRef(null);
   const originalCameraRotation = useRef(null);

useEffect(() => {
  if (!originalCameraPosition.current) {
    originalCameraPosition.current = camera.position.clone();
    originalCameraRotation.current = camera.rotation.clone();
  }
}, []);

  const resetCamera = () => {
    
    gsap.to(camera.position, {
      x: originalCameraPosition.current.x,
      y: originalCameraPosition.current.y,
      z: originalCameraPosition.current.z,
      duration: 2,
      ease: "power3.out",
    });
  
    gsap.to(camera.rotation, {
      x: originalCameraRotation.current.x,
      y: originalCameraRotation.current.y,
      z: originalCameraRotation.current.z,
      duration: 2,
      ease: "power3.out",
    });
  };

    
  const onMouseClick = (event) => {


    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

   
    raycaster.setFromCamera(mouse, camera);

    
    const intersects = raycaster.intersectObjects([model.scene, bus.scene, me.scene], true);

    
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      if (clickedObject.name === "Object_5") {
        setIsClicked(!isClicked); 
        console.log('clicked')
      }
    }
  };

  useEffect(() => {
    window.addEventListener("click", onMouseClick);
    return () => {
      window.removeEventListener("click", onMouseClick);
    };
  }, []);

  useLayoutEffect(() => {
    if (busStopRef.current) {
      busStopRef.current.position.y = -3;
    }
    if (clouds.current) {
      clouds.current.position.y = -3;
    }
  }, []);


  // enter animation
  useEffect(() => {
    if (showScene) {
      gsap.to(busStopRef.current.position, {
        y: -1,
        duration: 1.5,
        ease: 'power3.out',
      });
  
      gsap.to(clouds.current.position, {
        y: 0,
        duration: 1.5,
        delay: 1,
        ease: 'power3.out',
      });
    }
  }, [])



  useEffect(() => {
    if (isClicked) {
      gsap.to(camera.position, {
        x: -2,
        y: 1.5,
        z: 0,
        duration: 2,
        ease: "power3.out",
      });
  
      gsap.to(camera.rotation, {
        x: 0,
        y: -1.7,
        z: 0,
        duration: 2,
        ease: "power3.out",
        onComplete: () => {
          setIsClicked(false);
          setNav(!nav);
          
        },
      });

     

    
    }

  
  }, [isClicked, camera]);



  useEffect(() => {
    if (nav && home &&  menuRef.current) {
      gsap.fromTo(
        menuRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          delay: 2,
          ease: 'power3.out'
        }
      );
    }else {
      gsap.fromTo(
        menuRef.current,
        { y: 50, opacity: 1 },
        {
          y: 0,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          delay: 2,
          ease: 'power3.out'
        }
      );

     
    }


  
  }, [nav]);



// hide menu
const hideMenu = () => {
  gsap.to(menuRef.current, {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    onComplete: () => {
      setNav(false); 
      resetCamera();
   
    },
  });

}
  

  
  return (
    <>
    
     {showScene && (
     <group ref={groupRef}>

      <group position={[0, 0, 0]}>
        <primitive ref = {busStopRef} shadow object={model.scene} scale={2} position={[-1, -1, 0]} />
        <primitive ref={busRef} object={bus.scene} scale={1} rotation={[0, -1.5, 0]} position={[15, 0, 4]} />
        <primitive object={me.scene} scale={0.5} position={[0, 0, 3]}  />
      </group>

     

      <mesh receiveShadow position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#578FCA" />
      </mesh>

<group ref = {clouds}>
   <mesh position={[-7, -0.5, 0]} >
    <cylinderGeometry args = {[2, 1, 1]} />
    <meshBasicMaterial color = "white" />
   </mesh>

   <Float>
   <mesh position={[-7, 2, 0]}>
    <boxGeometry args={[1, 1]} />
    <meshMatcapMaterial matcap={matcap} />
    
  </mesh>
  </Float>

   <mesh position={[10, -0.5, -4]} >
    <cylinderGeometry args = {[2, 1, 1]} />
    <meshBasicMaterial color = "white" />
   </mesh>

   <Float >
   <mesh position={[10, 1.2, -3]}>
    <coneGeometry args={[0.5]} />
    <meshMatcapMaterial matcap={matcapGold} />
    
  </mesh>
  </Float>



   <mesh position={[-3, -0.5, -10]} >
    <cylinderGeometry args = {[2, 1, 1]} />
    <meshBasicMaterial color = "white" />
   </mesh>

   <mesh position={[3, -0.5, 8]} >
    <cylinderGeometry args = {[2, 1, 1]} />
    <meshBasicMaterial color = "white" />
   </mesh>
   </group>
  
      <group ref={textGroupRef} position={[-4, -1.1, 2]} rotation={[-Math.PI / 2, 0, 0]}>
  <Text3D
    font="./helvetiker_regular.typeface.json"
    size={0.75}
    height={0.2}
    curveSegments={12}
    bevelEnabled
    bevelThickness={0.0005}
    bevelSize={0.02}
    bevelOffset={0}
    bevelSegments={5}>
    {text}
    <meshStandardMaterial color="white" />
  </Text3D>
</group>

</group> )}
{!showScene && (
  <mesh
  position={[0, 0, 0]}
  onClick={() => {
    setShowScene(true);
   
  }}
>
  <planeGeometry args={[2, 1]} />
  <meshStandardMaterial color="orange" />
  <Html position={[0, 0, 0.01]} center>
    <div style={{ color: 'white', fontWeight: 'bold' }}>ENTER</div>
  </Html>
</mesh>

)}


{nav && (
  <group position={[0, 1.4, 0]}> 
    <Html center
        
     >
      <div className="w-[350px] h-[500px]   overflow-hidden menu" ref={menuRef} style={{ display: nav ? "block" : "none" }}>
        <nav className="w-full h-full bg-transparent flex flex-col items-center justify-center gap-12 p-4">
          <button onClick={hideMenu} className="button bg-white w-full px-4 py-4 rounded shadow">Home</button>
          <button className="button bg-white  w-full px-4 py-4 rounded shadow">About Me</button>
          <button className=" button bg-white  w-full px-4 py-4 rounded shadow">Projects</button>
          <button className="button bg-white w-full  px-4 py-4 rounded shadow">Contact</button>
        </nav>
      </div>
    </Html>
  </group>
)}

    </>
  );
}

export default Experience;
