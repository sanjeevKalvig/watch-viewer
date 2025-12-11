import { Canvas } from "@react-three/fiber";
import { EffectComposer, SMAA } from "@react-three/postprocessing";
import { OrbitControls, Environment } from "@react-three/drei";
import { useState } from "react";
import WatchModel from "./WatchModel";
import "./App.css";
import * as THREE from "three";

export default function App() {
  const [strapColor, setStrapColor] = useState("#0B1B26");
  const colors = ["#0B1B26", "#0F4868", "#9DA6AD"];

  return (
    <>
      <div className="luxury-text">LUXURY</div>

      <div className="swatches">
        {colors.map((c) => (
          <button
            key={c}
            className={`swatch ${c === strapColor ? "active" : ""}`}
            style={{ background: c }}
            onClick={() => setStrapColor(c)}
          />
        ))}
      </div>

      <Canvas
        camera={{ position: [0, 0, 1.2], fov: 65 }}
        dpr={[2, 3]}
        gl={{
          antialias: true,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        {/* Balanced lighting for realism */}
        <ambientLight intensity={1.8} />
        <directionalLight intensity={0.8} position={[5, 5, 5]} castShadow />
        <pointLight intensity={0.4} position={[-5, 5, 0]} />
        <pointLight intensity={0.3} position={[0, -3, 3]} />

        {/* Environment for reflections and realism */}
        <Environment preset="city" environmentIntensity={0.6} />

        <WatchModel strapColor={strapColor} />

        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={1.2}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          minPolarAngle={Math.PI / 2 - Math.PI / 6}
          maxPolarAngle={Math.PI / 2 + Math.PI / 6}
        />

      {/*   <EffectComposer multisampling={2}>
          <SMAA />
        </EffectComposer> */}
      </Canvas>
    </>
  );
}
