import type { Group, Object3D, PerspectiveCamera, PointLight } from 'three';
import type { gsap as Gsap } from 'gsap';
import type { ScrollTrigger as Trigger } from 'gsap/ScrollTrigger';

export const CINEMATIC_STAGES = ['producto', 'marca', 'ensamblaje', 'categorias', 'catalogo', 'aplicaciones', 'servicios', 'confianza', 'sedes', 'contacto', 'footer'] as const;

// Conceptual compositions, not dimensions or locations of commercial products.
export const CINEMATIC_POSES = [
  { x: 0, y: .5, rx: .48, ry: -.55, rz: -.08, scale: .9, camera: 12, spread: 0, light: 30 },
  { x: 0, y: .2, rx: .58, ry: -.4, rz: -.06, scale: .85, camera: 12, spread: .35, light: 40 },
  { x: 0, y: -.1, rx: .5, ry: -.45, rz: -.06, scale: .8, camera: 13, spread: 1, light: 45 },
  { x: 0, y: .2, rx: .58, ry: -.5, rz: -.05, scale: .85, camera: 12, spread: .45, light: 40 },
  { x: 0, y: .5, rx: .45, ry: -.6, rz: -.06, scale: .9, camera: 12, spread: 0, light: 35 },
  { x: 0, y: .6, rx: .35, ry: -.7, rz: -.06, scale: 1, camera: 12, spread: 0, light: 35 },
  { x: 0, y: .5, rx: .4, ry: -.55, rz: -.06, scale: .9, camera: 12, spread: 0, light: 35 },
  { x: 0, y: .5, rx: .45, ry: -.5, rz: -.06, scale: .9, camera: 12, spread: 0, light: 30 },
  { x: 0, y: .5, rx: .42, ry: -.6, rz: -.06, scale: .85, camera: 12, spread: 0, light: 30 },
  { x: 0, y: .5, rx: .4, ry: -.65, rz: -.06, scale: .8, camera: 13, spread: 0, light: 25 },
  { x: 0, y: -.4, rx: .4, ry: -.65, rz: -.06, scale: .65, camera: 14, spread: 0, light: 20 },
] as const;

export function stageProgress(scroll: number, stops: readonly number[]): number {
  if (stops.length < 2 || scroll <= stops[0]) return 0;
  for (let i = 1; i < stops.length; i++) {
    if (scroll <= stops[i]) return (i - 1 + (scroll - stops[i - 1]) / Math.max(1, stops[i] - stops[i - 1])) / (stops.length - 1);
  }
  return 1;
}

export function cinematicPose(progress: number): Record<keyof typeof CINEMATIC_POSES[0], number> {
  const position = Math.max(0, Math.min(1, progress)) * (CINEMATIC_POSES.length - 1);
  const index = Math.min(Math.floor(position), CINEMATIC_POSES.length - 2);
  const t = (1 - Math.cos((position - index) * Math.PI)) / 2;
  return Object.fromEntries(Object.keys(CINEMATIC_POSES[0]).map(key => {
    const field = key as keyof typeof CINEMATIC_POSES[0];
    return [field, CINEMATIC_POSES[index][field] + (CINEMATIC_POSES[index + 1][field] - CINEMATIC_POSES[index][field]) * t];
  })) as Record<keyof typeof CINEMATIC_POSES[0], number>;
}

export function createCinematicSequence(
  gsap: typeof Gsap, ScrollTrigger: typeof Trigger, root: HTMLElement,
  assembly: Group, pieces: Object3D[], camera: PerspectiveCamera, rim: PointLight,
): () => void {
  const clock = { progress: 0 };
  let stops: number[] = [];
  const apply = () => {
    const progress = stageProgress(scrollY, stops);
    const state = cinematicPose(progress);
    const mobile = innerWidth < 700;
    assembly.position.set(state.x * (mobile ? .25 : 1), state.y, 0);
    assembly.rotation.set(state.rx, state.ry, state.rz);
    assembly.scale.setScalar(state.scale * (mobile ? .8 : 1));
    pieces[1].position.y = state.spread * 1.5;
    pieces[2].position.y = state.spread * .5;
    pieces[3].position.y = state.spread;
    const footer = root.querySelector<HTMLElement>('#footer');
    const surface = root.querySelector<HTMLElement>('.cinema-surface');
    const clearance = footer ? footer.getBoundingClientRect().top - innerHeight : innerHeight;
    const opacity = Math.max(0, Math.min(1, clearance / Math.max(1, innerHeight * .45)));
    assembly.visible = opacity > 0;
    if (surface) {
      // A continuous envelope moves the same viewport; no chapter threshold changes layout.
      const position = progress * (CINEMATIC_POSES.length - 1);
      const envelope = (center: number) => {
        const distance = Math.abs(position - center);
        const t = Math.max(0, Math.min(1, (1.25 - distance) / .65));
        return t * t * (3 - 2 * t);
      };
      const chapter = Math.max(envelope(2), envelope(5));
      const hero = Math.max(0, 1 - position);
      const alpha = opacity * Math.max(hero, chapter);
      surface.style.opacity = String(alpha);
      surface.style.visibility = alpha > 0 ? 'visible' : 'hidden';
      surface.style.zIndex = '0';
      surface.style.top = `${mobile ? 490 - 380 * chapter : 110}px`;
      surface.style.bottom = 'auto';
      surface.style.height = `${mobile ? 280 : 340 + (innerHeight - 450) * (1 - chapter)}px`;
      surface.style.left = `${mobile ? 0 : 52 * (1 - chapter)}%`;
      surface.dataset['progress'] = String(progress);
      surface.dataset['pose'] = JSON.stringify(Object.fromEntries(Object.keys(CINEMATIC_POSES[0]).map(key => [key, state[key as keyof typeof CINEMATIC_POSES[0]]])));
    }
    camera.position.set(0, 0, state.camera + (mobile ? 2 : 0));
    camera.lookAt(0, 0, 0);
    rim.intensity = state.light;
  };
  // GSAP owns only the scrub clock. Object transforms are pure functions of native scroll.
  const timeline = gsap.timeline({ paused: true, onUpdate: apply });
  timeline.to(clock, { progress: 1, duration: 1, ease: 'none' });
  let pending = 0;
  let disposed = false;
  const measure = () => {
    pending = 0;
    const bottom = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    let last = 0;
    stops = CINEMATIC_STAGES.map((id) => {
      const element = root.querySelector<HTMLElement>(`#${id}`);
      // Optional ERP sections keep their place in the story without fabricated content.
      last = Math.max(last, Math.min(bottom, element ? element.getBoundingClientRect().top + scrollY - 110 : last));
      return last;
    });
    stops[stops.length - 1] = bottom;
    apply();
  };
  const schedule = () => {
    if (!disposed && !pending) pending = requestAnimationFrame(() => { measure(); trigger.refresh(); });
  };
  const trigger = ScrollTrigger.create({
    trigger: root, start: 'top top', end: () => Math.max(1, document.documentElement.scrollHeight - innerHeight),
    animation: timeline, scrub: true,
    onUpdate: apply, onRefresh: measure,
  });
  const resize = new ResizeObserver(schedule);
  resize.observe(root);
  const mutation = new MutationObserver(schedule);
  mutation.observe(root, { childList: true, subtree: true });
  window.addEventListener('resize', schedule);
  measure();
  return () => {
    disposed = true;
    cancelAnimationFrame(pending);
    resize.disconnect(); mutation.disconnect();
    window.removeEventListener('resize', schedule);
    trigger.kill(); timeline.kill();
  };
}
