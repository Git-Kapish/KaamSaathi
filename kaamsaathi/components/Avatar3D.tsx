'use client'
/* eslint-disable react-hooks/immutability -- three.js scene objects are mutated imperatively in useFrame by design */
import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bounds, useGLTF } from '@react-three/drei'
import { KTX2Loader } from 'three-stdlib' // same loader types drei's useGLTF expects
import type * as THREE from 'three'
import { peekAnalyser } from '@/lib/audio'

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking'

// Model: facecap.glb (ARKit-style blend shapes). Licence is NOT stated in the three.js repo: confirm with
// https://www.bannaflak.com/face-cap before the public demo, or swap in another GLB with a jawOpen morph target.
const MODEL = '/avatars/facecap.glb'

function Head({ state }: { state: AvatarState }) {
  const { gl } = useThree()
  const gltf = useGLTF(MODEL, false, true, (loader) => {
    loader.setKTX2Loader(new KTX2Loader().setTranscoderPath('/basis/').detectSupport(gl))
  })
  const meshes = useMemo(() => {
    const found: THREE.Mesh[] = []
    gltf.scene.traverse((o) => { if ((o as THREE.Mesh).morphTargetDictionary) found.push(o as THREE.Mesh) })
    return found
  }, [gltf])
  const wave = useRef(new Float32Array(512))
  const jaw = useRef(0)

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    let level = 0
    const an = peekAnalyser()
    if (an && state === 'speaking') {
      an.getFloatTimeDomainData(wave.current)
      let sum = 0
      for (const x of wave.current) sum += x * x
      level = Math.min(1, Math.sqrt(sum / wave.current.length) * 6)
    }
    jaw.current += (level - jaw.current) * Math.min(1, dt * 18)

    const ph = t % 3.5
    const blink = ph < 0.15 ? Math.sin((ph / 0.15) * Math.PI) : 0
    const pose: Record<string, number> = {
      jawOpen: jaw.current * 0.7,
      mouthFunnel: jaw.current * 0.25,
      eyeBlink_L: blink,
      eyeBlink_R: blink,
      mouthSmile_L: state === 'idle' ? 0.25 : 0.1,
      mouthSmile_R: state === 'idle' ? 0.25 : 0.1,
      browInnerUp: state === 'thinking' ? 0.6 : state === 'listening' ? 0.25 : 0,
      eyeLookUp_L: state === 'thinking' ? 0.4 : 0,
      eyeLookUp_R: state === 'thinking' ? 0.4 : 0,
      eyeWide_L: state === 'listening' ? 0.3 : 0,
      eyeWide_R: state === 'listening' ? 0.3 : 0,
    }
    for (const m of meshes) {
      for (const [name, v] of Object.entries(pose)) {
        const i = m.morphTargetDictionary![name]
        if (i !== undefined) m.morphTargetInfluences![i] = v
      }
    }
    gltf.scene.rotation.y = Math.sin(t * 0.5) * 0.06 // slight idle sway
  })

  return <primitive object={gltf.scene} />
}

export default function Avatar3D({ state }: { state: AvatarState }) {
  return (
    <Canvas camera={{ fov: 30 }} dpr={[1, 1.5]} className="!h-full !w-full">
      <ambientLight intensity={1.4} />
      <directionalLight position={[2, 3, 4]} intensity={2} />
      <Suspense fallback={null}>
        <Bounds fit margin={1.15}>
          <Head state={state} />
        </Bounds>
      </Suspense>
    </Canvas>
  )
}
