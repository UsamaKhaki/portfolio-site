// three.js scene for ProjectShowcase, loaded with a dynamic import when the section is in view.
import * as THREE from "three";

export type ProjectShowcaseScene = {
  setActive: (index: number) => void;
  dispose: () => void;
};

type SceneOptions = {
  onSelect: (index: number) => void;
  onReady: () => void;
  reducedMotion: boolean;
};

const WINDOW_WIDTH = 2.4;
const WINDOW_HEIGHT = 1.5;

// Draws the screenshot inside a rounded browser window with a title bar, and fades windows
// further back in the stack toward the page background.
function windowMaterial(texture: THREE.Texture, background: THREE.Color) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uDim: { value: 0 },
      uBackground: { value: background },
      uAspect: { value: WINDOW_WIDTH / WINDOW_HEIGHT },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform float uDim;
      uniform vec3 uBackground;
      uniform float uAspect;
      varying vec2 vUv;

      float roundedBox(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + r;
        return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
      }

      void main() {
        vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
        if (roundedBox(p, vec2(uAspect, 1.0) * 0.5, 0.045) > 0.0) discard;

        float bar = step(0.93, vUv.y);
        vec3 color = texture2D(uMap, vec2(vUv.x, vUv.y / 0.93)).rgb;
        color = mix(color, vec3(0.92, 0.93, 0.95), bar);
        float dots = 0.0;
        for (int i = 0; i < 3; i++) {
          vec2 centre = vec2(0.03 + float(i) * 0.025, 0.965);
          dots += step(length(vec2((vUv.x - centre.x) * uAspect, vUv.y - centre.y)), 0.012);
        }
        color = mix(color, vec3(0.74, 0.76, 0.8), clamp(dots * bar, 0.0, 1.0));
        color = mix(color, uBackground, uDim);
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }`,
  });
}

function readBackground() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--bg")
    .trim();
  return new THREE.Color(value || "#f7f8fa");
}

export function createProjectShowcaseScene(
  container: HTMLElement,
  imageUrls: string[],
  { onSelect, onReady, reducedMotion }: SceneOptions,
): ProjectShowcaseScene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
  } catch {
    return null; // No WebGL: the static screenshot stays in place.
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.className = "block size-full";
  container.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
  camera.position.set(0, 0.1, 5);

  const geometry = new THREE.PlaneGeometry(WINDOW_WIDTH, WINDOW_HEIGHT);
  const planes: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = [];
  const background = readBackground();
  let active = 0;
  let disposed = false;

  const loader = new THREE.TextureLoader();
  Promise.all(imageUrls.map((url) => loader.loadAsync(url)))
    .then((textures) => {
      if (disposed) {
        textures.forEach((t) => t.dispose());
        return;
      }
      textures.forEach((texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;
        const mesh = new THREE.Mesh(
          geometry,
          windowMaterial(texture, background),
        );
        planes.push(mesh);
        scene.add(mesh);
      });
      layout(1);
      onReady();
    })
    .catch(() => {
      // Leave the static screenshot in place if an image fails to load.
    });

  const themeObserver = new MutationObserver(() => {
    const next = readBackground();
    for (const plane of planes)
      plane.material.uniforms.uBackground.value = next;
  });
  themeObserver.observe(document.documentElement, {
    attributeFilter: ["data-theme"],
  });

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Fit the spread-out stack (front window plus the offsets behind it) inside the width.
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    camera.position.z = Math.max(
      4.4,
      1.85 / (Math.tan(halfFov) * camera.aspect),
    );
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  let spread = 0;
  let hovering = false;
  let time = 0;

  // Moves each window toward its slot in the stack; k = 1 snaps straight there.
  const layout = (k: number) => {
    planes.forEach((mesh, i) => {
      const depth = (i - active + planes.length) % planes.length; // 0 is the front window
      const float = reducedMotion ? 0 : Math.sin(time * 0.8 + i * 1.7) * 0.02;
      const target = {
        x: depth * (0.42 + spread * 0.35) - 0.35 - spread * 0.2,
        y: depth * (0.16 + spread * 0.06) + 0.05 + float,
        z: -depth * (0.55 + spread * 0.25),
      };
      mesh.position.x += (target.x - mesh.position.x) * k;
      mesh.position.y += (target.y - mesh.position.y) * k;
      mesh.position.z += (target.z - mesh.position.z) * k;
      mesh.rotation.y += (-0.32 - spread * 0.08 - mesh.rotation.y) * k;
      mesh.rotation.x += (-0.06 - mesh.rotation.x) * k;
      const dim = mesh.material.uniforms.uDim;
      dim.value += (depth * 0.3 - dim.value) * k;
      mesh.renderOrder = planes.length - depth;
    });
  };

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const onPointerEnter = () => {
    hovering = true;
  };
  const onPointerLeave = () => {
    hovering = false;
  };
  const onClick = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    pointer.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(planes)[0];
    if (hit) onSelect(planes.indexOf(hit.object as (typeof planes)[number]));
  };
  container.addEventListener("pointerenter", onPointerEnter);
  container.addEventListener("pointerleave", onPointerLeave);
  container.addEventListener("click", onClick);

  let raf = 0;
  let last = performance.now();
  // Created only once the section is in view, so start running straight away.
  let onScreen = true;
  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    spread +=
      ((hovering && !reducedMotion ? 1 : 0) - spread) * Math.min(1, dt * 5);
    layout(reducedMotion ? 1 : Math.min(1, dt * 6));
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  const updateLoop = () => {
    const run = onScreen && !document.hidden;
    if (run && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else if (!run && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
  const visibility = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    updateLoop();
  });
  visibility.observe(container);
  document.addEventListener("visibilitychange", updateLoop);
  updateLoop();

  return {
    setActive(index) {
      active = index;
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      visibility.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", updateLoop);
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("click", onClick);
      for (const plane of planes) {
        plane.material.uniforms.uMap.value.dispose();
        plane.material.dispose();
      }
      geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
