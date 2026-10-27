// The only module that imports three.js. StackGraph loads it with a dynamic import once the
// section scrolls into view, so three.js stays out of the initial page bundle.
import * as THREE from "three";
import type { StackGraph } from "@/lib/stack-graph";

export type StackGraphScene = {
  setFocus: (index: number | null) => void;
  dispose: () => void;
};

type SceneOptions = {
  onHover: (index: number | null) => void;
  reducedMotion: boolean;
};

const LABEL_BASE =
  "pointer-events-none absolute top-0 left-0 rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap transition-opacity duration-150";
const LABEL_PROJECT = "bg-ink text-bg";
const LABEL_TECH = "bg-accent-soft text-accent-ink";

function readPalette() {
  const css = getComputedStyle(document.documentElement);
  const color = (name: string) =>
    new THREE.Color(css.getPropertyValue(name).trim() || "#888888");
  return {
    project: color("--accent"),
    // Technologies sit a step back from the projects at rest and come forward when lit.
    tech: color("--ink-muted").lerp(color("--surface"), 0.4),
    techLit: color("--ink-muted"),
    faded: color("--line"),
    edge: color("--line-strong"),
    edgeFaded: color("--surface-muted"),
  };
}

export function createStackGraphScene(
  container: HTMLElement,
  graph: StackGraph,
  { onHover, reducedMotion }: SceneOptions,
): StackGraphScene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
  } catch {
    return null; // No WebGL: the project list and caption still describe every stack.
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.className = "block size-full";
  container.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
  const group = new THREE.Group();
  scene.add(group);

  const { nodes, edges, neighbours } = graph;
  const extentY = Math.max(...nodes.map((n) => Math.abs(n.position[1])));
  const extentXZ = Math.max(
    ...nodes.map((n) => Math.hypot(n.position[0], n.position[2])),
  );

  const sphere = new THREE.SphereGeometry(1, 20, 20);
  const nodeMaterial = new THREE.MeshBasicMaterial();
  const mesh = new THREE.InstancedMesh(sphere, nodeMaterial, nodes.length);
  const matrix = new THREE.Matrix4();
  const identity = new THREE.Quaternion();
  nodes.forEach((node, i) => {
    const size =
      node.kind === "project"
        ? 0.07
        : 0.03 + Math.min(neighbours[i].length, 7) * 0.006;
    matrix.compose(
      new THREE.Vector3(...node.position),
      identity,
      new THREE.Vector3(size, size, size),
    );
    mesh.setMatrixAt(i, matrix);
  });
  group.add(mesh);

  const linePositions = new Float32Array(edges.length * 6);
  const lineColors = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], i) =>
    linePositions.set([...nodes[a].position, ...nodes[b].position], i * 6),
  );
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(linePositions, 3),
  );
  lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
  const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true });
  group.add(new THREE.LineSegments(lineGeometry, lineMaterial));

  const labels = nodes.map((node) => {
    const el = document.createElement("span");
    el.className = `${LABEL_BASE} ${node.kind === "project" ? LABEL_PROJECT : LABEL_TECH}`;
    el.textContent = node.id;
    el.style.opacity = "0";
    container.appendChild(el);
    return el;
  });

  let palette = readPalette();
  let focus: number | null = null;

  const paint = () => {
    const lit = focus === null ? null : new Set([focus, ...neighbours[focus]]);
    nodes.forEach((node, i) => {
      if (node.kind === "project") {
        mesh.setColorAt(
          i,
          lit === null || lit.has(i) ? palette.project : palette.faded,
        );
      } else {
        mesh.setColorAt(
          i,
          lit === null
            ? palette.tech
            : lit.has(i)
              ? palette.techLit
              : palette.faded,
        );
      }
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    edges.forEach(([a, b], i) => {
      const touches = focus !== null && (a === focus || b === focus);
      const c =
        focus === null
          ? palette.edge
          : touches
            ? palette.project
            : palette.edgeFaded;
      lineColors.set([c.r, c.g, c.b, c.r, c.g, c.b], i * 6);
    });
    lineGeometry.attributes.color.needsUpdate = true;
  };
  paint();

  const themeObserver = new MutationObserver(() => {
    palette = readPalette();
    paint();
  });
  themeObserver.observe(document.documentElement, {
    attributeFilter: ["data-theme"],
  });

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Pull the camera back until the whole graph fits with a margin: the spin around y can
    // swing any node to the edge horizontally, while the vertical extent stays fixed.
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const fitHeight = (extentY * 1.35) / Math.tan(halfFov);
    const fitWidth = (extentXZ * 1.2) / (Math.tan(halfFov) * camera.aspect);
    camera.position.z = Math.max(fitHeight, fitWidth) + extentXZ * 0.3;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered: number | null = null;
  let drag: { x: number; y: number } | null = null;
  let idleSince = 0;

  const onPointerDown = (e: PointerEvent) => {
    drag = { x: e.clientX, y: e.clientY };
    container.setPointerCapture(e.pointerId);
  };
  const onPointerUp = () => {
    drag = null;
    idleSince = performance.now();
  };
  const onPointerMove = (e: PointerEvent) => {
    if (drag) {
      group.rotation.y += (e.clientX - drag.x) * 0.008;
      group.rotation.x = THREE.MathUtils.clamp(
        group.rotation.x + (e.clientY - drag.y) * 0.008,
        -1.2,
        1.2,
      );
      drag = { x: e.clientX, y: e.clientY };
      return;
    }
    const rect = container.getBoundingClientRect();
    pointer.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const next = raycaster.intersectObject(mesh)[0]?.instanceId ?? null;
    // Only report changes, so resting the pointer on empty space does not clear a focus set from the list.
    if (next !== hovered) {
      hovered = next;
      onHover(next);
    }
  };
  const onPointerLeave = () => {
    if (hovered !== null) {
      hovered = null;
      onHover(null);
    }
  };
  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("pointerup", onPointerUp);
  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerleave", onPointerLeave);

  const projected = new THREE.Vector3();
  const placeLabels = () => {
    const { width, height } = container.getBoundingClientRect();
    const lit = focus === null ? null : new Set([focus, ...neighbours[focus]]);
    const candidates = nodes
      .map((node, i) => {
        projected
          .set(...node.position)
          .applyMatrix4(group.matrixWorld)
          .project(camera);
        return {
          i,
          x: (projected.x * 0.5 + 0.5) * width,
          y: (-projected.y * 0.5 + 0.5) * height,
          z: projected.z,
        };
      })
      .filter(({ i }) =>
        lit === null ? nodes[i].kind === "project" : lit.has(i),
      )
      // The focused node claims its spot first, then the nearest labels.
      .sort((a, b) => (a.i === focus ? -1 : b.i === focus ? 1 : a.z - b.z));

    const placed: { x: number; y: number; w: number }[] = [];
    const shown = new Set<number>();
    for (const c of candidates) {
      const w = nodes[c.i].id.length * 6.5 + 18;
      const overlaps = placed.some(
        (p) => Math.abs(p.x - c.x) < (p.w + w) / 2 && Math.abs(p.y - c.y) < 22,
      );
      if (overlaps) continue;
      placed.push({ x: c.x, y: c.y, w });
      shown.add(c.i);
      labels[c.i].style.transform =
        `translate(${c.x}px, ${c.y}px) translate(-50%, -170%)`;
    }
    labels.forEach((el, i) => {
      el.style.opacity = shown.has(i) ? "1" : "0";
    });
  };

  let raf = 0;
  let last = performance.now();
  // The scene is only created once the graph is in view, so start running straight away
  // instead of waiting for the observer's first callback, which can be missed in a background tab.
  let onScreen = true;
  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (
      !drag &&
      !reducedMotion &&
      focus === null &&
      hovered === null &&
      now - idleSince > 1200
    ) {
      group.rotation.y += dt * 0.15;
    }
    group.updateMatrixWorld();
    renderer.render(scene, camera);
    placeLabels();
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
    setFocus(index) {
      focus = index;
      paint();
    },
    dispose() {
      cancelAnimationFrame(raf);
      visibility.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", updateLoop);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      labels.forEach((el) => el.remove());
      sphere.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      mesh.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
