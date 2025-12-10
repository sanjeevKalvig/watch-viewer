import { useGLTF, Html, Line } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function WatchModel({ strapColor }) {
  const { scene } = useGLTF("/Watch.glb");
  const wrapperRef = useRef();
  const strapMeshes = useRef([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!scene || initialized.current) return;
    initialized.current = true;

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const target = 0.8;
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? target / maxDim : 1;

    if (wrapperRef.current) {
      wrapperRef.current.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale
      );
      wrapperRef.current.scale.setScalar(scale);
    }

    strapMeshes.current = [];

    scene.traverse((obj) => {
      if (obj.isMesh) {
        if (
          obj.name === "Plane006" ||
          obj.name === "Plane010" ||
          obj.name === "Plane005" ||
          obj.name === "Plane021"
        ) {
          // Create strap material with emissive for consistent color
          obj.material = new THREE.MeshStandardMaterial({
            color: strapColor,
            roughness: 0.8, // Increased for less reflection
            metalness: 0.05, // Reduced for more diffuse color
            emissive: strapColor, // Makes color glow slightly
            emissiveIntensity: 0.8, // 20% emissive glow
            normalMap: obj.material.normalMap,
            side: THREE.DoubleSide,
          });
          strapMeshes.current.push(obj);
        } else {
          // Clone materials for other meshes
          if (Array.isArray(obj.material)) {
            obj.material = obj.material.map((m) => m.clone());
          } else {
            obj.material = obj.material.clone();
          }
        }
      }
    });
  }, [scene, strapColor]);

  useEffect(() => {
    if (strapMeshes.current.length > 0) {
      strapMeshes.current.forEach((mesh) => {
        mesh.material.color.set(strapColor);
        mesh.material.emissive.set(strapColor); // Update emissive too
        mesh.material.needsUpdate = true;
      });
    }
  }, [strapColor]);

  // Click handler for mesh name logging
  const handleMeshClick = (event) => {
    event.stopPropagation();
    const clickedMesh = event.object;
    console.log("Clicked mesh name:", clickedMesh.name);
    console.log("Clicked mesh:", clickedMesh);
  };

  return (
    <group>
      <group ref={wrapperRef} onClick={handleMeshClick}>
        <primitive object={scene} />
      </group>

      {/* LEFT-TOP callout */}
      <LeftTopCallout />

      {/* RIGHT-BOTTOM callout */}
      <RightBottomCallout />
    </group>
  );
}

// [Rest of your callout components remain the same...]
function LeftTopCallout() {
  const position = [-0.45, 0.28, 0.27];
  const dotPosition = [-0.2, 0.13, 0.28];
  const title = "200+";
  const subtitle = "Craftsmanship";
  const align = "right";

  const totalDistanceX = position[0] - dotPosition[2];
  const totalDistanceY = position[1] - dotPosition[1];
  const totalDistanceZ = position[2] - dotPosition[2];

  const bendPoint = [
    dotPosition[0] + totalDistanceX * 0.2,
    dotPosition[2],
    dotPosition[2] + totalDistanceZ * 0.3,
  ];

  const linePoints = [dotPosition, bendPoint, position];

  return (
    <group>
      <mesh position={dotPosition} renderOrder={999}>
        <sphereGeometry args={[0.008, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={1} />
      </mesh>

      <Line
        points={linePoints}
        color="rgba(255, 255, 255, 0.5)"
        lineWidth={1.5}
        renderOrder={999}
        transparent
        opacity={0.7}
      />

      <Html
        position={position}
        center
        style={{ pointerEvents: "none" }}
        zIndexRange={[100, 0]}
      >
        <div
          style={{
            textAlign: align,
            whiteSpace: "nowrap",
            fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: "300",
              color: "#ffffff",
              lineHeight: "1",
              marginBottom: "6px",
              letterSpacing: "-1px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "rgba(255, 255, 255, 0.3)",
              margin: align === "right" ? "0 0 6px auto" : "0 auto 6px 0",
            }}
          />
          <div
            style={{
              fontSize: "9px",
              color: "rgba(255, 255, 255, 0.5)",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: "400",
            }}
          >
            {subtitle}
          </div>
        </div>
      </Html>
    </group>
  );
}

function RightBottomCallout() {
  const position = [0.39, -0.3, 0.28];
  const dotPosition = [0.2, -0.1, 0.28];
  const title = "100%";
  const subtitle = "Water Resistance";
  const align = "left";

  const totalDistanceX = position[0] - dotPosition[0];
  const totalDistanceY = position[1] - dotPosition[1];
  const totalDistanceZ = position[2] - dotPosition[2];

  const bendPoint = [
    dotPosition[0] + totalDistanceX * 0.9,
    -dotPosition[0],
    dotPosition[2] + totalDistanceZ * 0.3,
  ];

  const linePoints = [dotPosition, bendPoint, position];

  return (
    <group>
      <mesh position={dotPosition} renderOrder={999}>
        <sphereGeometry args={[0.008, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={1} />
      </mesh>

      <Line
        points={linePoints}
        color="rgba(255, 255, 255, 0.5)"
        lineWidth={1.5}
        renderOrder={999}
        transparent
        opacity={0.7}
      />

      <Html
        position={position}
        center
        style={{ pointerEvents: "none" }}
        zIndexRange={[100, 0]}
      >
        <div
          style={{
            textAlign: align,
            whiteSpace: "nowrap",
            fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: "300",
              color: "#ffffff",
              lineHeight: "1",
              marginTop: "40px",
              letterSpacing: "-1px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "rgba(255, 255, 255, 0.3)",
              margin: align === "right" ? "0 0 6px auto" : "0 auto 6px 0",
            }}
          />
          <div
            style={{
              fontSize: "9px",
              color: "rgba(255, 255, 255, 0.5)",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: "400",
            }}
          >
            {subtitle}
          </div>
        </div>
      </Html>
    </group>
  );
}

useGLTF.preload("/Watch.glb");
