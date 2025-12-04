import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useState } from "react";
import WatchModel from "./WatchModel";
import "./App.css";
import * as THREE from "three";

export default function App() {
  const [strapColor, setStrapColor] = useState("#0B1B10");

  const colors = ["#0B1B26", "#0F4868", "#9DA6AD"];

  return (
    <>
      {/* LUXURY background text */}
      <div className="luxury-text">LUXURY</div>

      <div className="swatches">
        {colors.map((c) => (
          <button
            key={c}
            className={`swatch ${c === strapColor ? 'active' : ''}`}
            style={{ background: c }}
            onClick={() => setStrapColor(c)}
          />
        ))}
      </div>

      <Canvas 
        camera={{ position: [0, 0, 1.2], fov: 50 }}
        gl={{ 
          outputEncoding: THREE.sRGBEncoding,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          intensity={1.8} 
          position={[5, 5, 5]} 
          castShadow
        />
        <pointLight intensity={0.8} position={[-5, 5, 0]} />
        
        <Environment preset="studio" />
        
        <WatchModel strapColor={strapColor} />
        
        <OrbitControls 
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={3}
        />
      </Canvas>
    </>
  );
}
