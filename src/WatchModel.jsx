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
            roughness: 0.8,
            metalness: 0.05,
            emissive: strapColor,
            emissiveIntensity: 0.8,
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
        mesh.material.emissive.set(strapColor);
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
        <style>
          {`
            .callout-container {
              text-align: ${align};
              white-space: nowrap;
              font-family: 'Helvetica Neue', 'Arial', sans-serif;
            }

            .callout-title {
              font-weight: 300;
              color: #ffffff;
              line-height: 1;
              margin-bottom: 6px;
              letter-spacing: -1px;
              font-size: 18px; /* xs: 20 * 0.9 = 18px */
            }

            .callout-divider {
              width: 40px;
              height: 1px;
              background: rgba(255, 255, 255, 0.3);
              margin: ${align === "right" ? "0 0 6px auto" : "0 auto 6px 0"};
            }

            .callout-subtitle {
              color: rgba(255, 255, 255, 0.5);
              letter-spacing: 2px;
              text-transform: uppercase;
              font-weight: 400;
              font-size: 5.85px; /* xs: 6.5 * 0.9 = 5.85px */
            }

            /* sm: 640px - 1023px */
            @media (min-width: 640px) {
              .callout-title {
                font-size: 21.6px; /* 24 * 0.9 */
              }
              .callout-subtitle {
                font-size: 6.75px; /* 7.5 * 0.9 */
              }
            }

            /* md: 1024px - 1439px */
            @media (min-width: 1024px) {
              .callout-title {
                font-size: 28.8px; /* 32 * 0.9 */
              }
              .callout-subtitle {
                font-size: 8.1px; /* 9 * 0.9 */
              }
            }

            /* lg: 1440px+ */
            @media (min-width: 1440px) {
              .callout-title {
                font-size: 32.4px; /* 36 * 0.9 */
              }
              .callout-subtitle {
                font-size: 9px; /* 10 * 0.9 */
              }
            }
          `}
        </style>
        <div className="callout-container">
          <div className="callout-title">{title}</div>
          <div className="callout-divider" />
          <div className="callout-subtitle">{subtitle}</div>
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
        <style>
          {`
            .callout-container-right {
              text-align: ${align};
              white-space: nowrap;
              font-family: 'Helvetica Neue', 'Arial', sans-serif;
            }

            .callout-title-right {
              font-weight: 300;
              color: #ffffff;
              line-height: 1;
              margin-top: 40px;
              letter-spacing: -1px;
              font-size: 18px; /* xs: 20 * 0.9 = 18px */
            }

            .callout-divider-right {
              width: 40px;
              height: 1px;
              background: rgba(255, 255, 255, 0.3);
              margin: ${align === "right" ? "0 0 6px auto" : "0 auto 6px 0"};
            }

            .callout-subtitle-right {
              color: rgba(255, 255, 255, 0.5);
              letter-spacing: 2px;
              text-transform: uppercase;
              font-weight: 400;
              font-size: 5.85px; /* xs: 6.5 * 0.9 = 5.85px */
            }

            /* sm: 640px - 1023px */
            @media (min-width: 640px) {
              .callout-title-right {
                font-size: 21.6px; /* 24 * 0.9 */
              }
              .callout-subtitle-right {
                font-size: 6.75px; /* 7.5 * 0.9 */
              }
            }

            /* md: 1024px - 1439px */
            @media (min-width: 1024px) {
              .callout-title-right {
                font-size: 28.8px; /* 32 * 0.9 */
              }
              .callout-subtitle-right {
                font-size: 8.1px; /* 9 * 0.9 */
              }
            }

            /* lg: 1440px+ */
            @media (min-width: 1440px) {
              .callout-title-right {
                font-size: 32.4px; /* 36 * 0.9 */
              }
              .callout-subtitle-right {
                font-size: 9px; /* 10 * 0.9 */
              }
            }
          `}
        </style>
        <div className="callout-container-right">
          <div className="callout-title-right">{title}</div>
          <div className="callout-divider-right" />
          <div className="callout-subtitle-right">{subtitle}</div>
        </div>
      </Html>
    </group>
  );
}

useGLTF.preload("/Watch.glb");
