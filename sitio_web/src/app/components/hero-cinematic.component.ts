import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, effect, inject, signal } from '@angular/core';
import { CmsStore } from '../core/cms.store';
import { TemaService } from '../core/tema.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-cinematic',
  imports: [RouterLink],
  template: `
    <section #host class="cinema" aria-label="Materiales para construir">
      <div class="cinema-sticky">
        <div #surface class="cinema-surface" aria-hidden="true"></div>
        @if (!ready()) {
          <div class="cinema-fallback" aria-hidden="true"><div class="material-orbit"></div><div class="material-stack"><span></span><span></span><span></span><i></i><i></i></div><span class="material-caption">01 / POLICARBONATO + ALUMINIO</span></div>
        }
        <div class="cinema-copy">
          <p class="kicker reveal">POLICALUM / Trujillo</p>
          <h1 class="reveal">Construye<br>con luz.<br><em>Diseña sin límites.</em></h1>
          <p class="lead reveal">Policarbonatos y aluminios que transforman espacios. Encuentra la transparencia, el color y el acabado para tu próxima obra.</p>
          <div class="hero-actions reveal"><a class="btn btn-primary" routerLink="/catalogo">Explorar materiales ↗</a><a class="btn btn-line" routerLink="/cotizar">Cotizar proyecto</a></div>
        </div>
        <div class="cinema-controls"><button type="button" class="btn btn-line btn-sm" (click)="alternarEscena()" [disabled]="cargando()" [attr.aria-pressed]="ready()">{{ cargando() ? 'Preparando vista…' : ready() ? 'Volver a vista ligera' : 'Explorar cubierta en 3D ↗' }}</button><small role="status">{{ aviso() || 'Ilustración conceptual · conoce nuestros materiales' }}</small></div>
        <p class="cinema-scroll">Desplázate para explorar ↓</p>
      </div>
    </section>
  `,
})
export class HeroCinematicComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLElement>;
  @ViewChild('surface', { static: true }) surface!: ElementRef<HTMLElement>;
  readonly ready = signal(false);
  readonly cargando = signal(false);
  readonly aviso = signal('');
  private disposed = false;
  private cleanup = () => {};
  private readonly cms = inject(CmsStore);
  private readonly tema = inject(TemaService);
  private actualizarPaleta = () => {};

  constructor() {
    effect(() => {
      this.cms.paquete();
      this.tema.modo();
      this.actualizarPaleta();
    });
  }

  ngAfterViewInit(): void {
    // The lightweight material composition is available without WebGL or downloads.
  }

  async alternarEscena(): Promise<void> {
    if (this.ready()) { this.cleanup(); this.ready.set(false); return; }
    this.cargando.set(true);
    this.aviso.set('');
    await this.initialize();
    this.cargando.set(false);
  }

  ngOnDestroy(): void {
    this.disposed = true;
    this.cleanup();
  }

  private async initialize(): Promise<void> {
    const releases: Array<() => void> = [];
    this.cleanup = () => releases.splice(0).reverse().forEach((release) => release());
    try {
      const T = await import('three');
      if (this.disposed) return;
      const surface = this.surface.nativeElement;
      const host = this.host.nativeElement;
      const renderer = new T.WebGLRenderer({ alpha: true, antialias: innerWidth > 700, powerPreference: 'low-power' });
      releases.push(() => { renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.25 : 1.75));
      renderer.outputColorSpace = T.SRGBColorSpace;
      surface.append(renderer.domElement);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(35, 1, .1, 60);
      camera.position.set(0, 0, 10);
      const hemisphere = new T.HemisphereLight(0xffffff, 0x476475, 1.2);
      scene.add(hemisphere);
      const key = new T.DirectionalLight(0xffffff, 2);
      key.position.set(3, 4, 5);
      scene.add(key);
      // Neutral fill reveals the underside; accent rim remains CMS controlled.
      const fill = new T.DirectionalLight(0xffffff, .8);
      fill.position.set(-4, 3, -5);
      scene.add(fill);
      const rim = new T.PointLight(0xffffff, 20);
      rim.position.set(-3, 0, 2);
      scene.add(rim);
      const assembly = new T.Group();
      assembly.position.x = 0;
      assembly.rotation.set(.3, -.45, -.2);
      scene.add(assembly);
      const metal = new T.MeshStandardMaterial({ color: 0xffffff, metalness: .28, roughness: .32 });
      const glass = new T.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: .12, transmission: 0, thickness: .025, ior: 1.586, transparent: true, opacity: .28, depthWrite: false });
      const rib = new T.MeshStandardMaterial({ color: 0xffffff, metalness: 0, roughness: .24, transparent: true, opacity: .48, depthWrite: false });
      releases.push(() => metal.dispose(), () => glass.dispose(), () => rib.dispose());
      const pieces = buildConceptualRoof(T, metal, glass, rib, releases);
      assembly.add(...pieces);
      const particlesGeometry = new T.BufferGeometry();
      const positions = new Float32Array((innerWidth < 700 ? 60 : 180) * 3);
      for (let i = 0; i < positions.length; i++) positions[i] = Math.sin(i * 127.1) * 7;
      particlesGeometry.setAttribute('position', new T.BufferAttribute(positions, 3));
      const particlesMaterial = new T.PointsMaterial({ color: 0xffffff, size: .018, transparent: true, opacity: .45 });
      const particles = new T.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);
      this.actualizarPaleta = () => {
        const css = getComputedStyle(document.documentElement);
        const color = (token: string, fallback: string) => {
          const value = css.getPropertyValue(token).trim();
          return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
        };
        const accent = color('--accent', '#0d47a1');
        const paper = color('--paper', '#ffffff');
        const bg = color('--bg', '#f3f6fb');
        hemisphere.color.set(0xffffff).lerp(new T.Color(paper), .15);
        hemisphere.groundColor.set(0xffffff).lerp(new T.Color(bg), .3);
        rim.color.set(accent);
        metal.color.set(0x9bafba);
        glass.color.set(0xffffff).lerp(new T.Color(accent), .035);
        rib.color.copy(glass.color);
        particlesMaterial.color.set(accent);
      };
      this.actualizarPaleta();
      releases.push(() => { this.actualizarPaleta = () => {}; });
      releases.push(() => particlesGeometry.dispose(), () => particlesMaterial.dispose());
      const resize = new ResizeObserver(() => {
        const { width, height } = surface.getBoundingClientRect();
        // CSS owns layout; intrinsic buffer changes must not resize the scroll root.
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.25 : 1.75));
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        resume();
      });
      resize.observe(surface);
      releases.push(() => resize.disconnect());
      const root = host;
      let visible = false;
      let frame = 0;
      const render = () => {
        frame = 0;
        if (!visible || document.hidden || this.disposed) return;
        renderer.render(scene, camera);
      };
      const resume = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        if (visible && !document.hidden && !this.disposed) frame = requestAnimationFrame(render);
      };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
      observer.observe(root);
      const update = () => {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const progress = Math.max(0, Math.min(1, -host.getBoundingClientRect().top / Math.max(host.offsetHeight, 1)));
        assembly.rotation.set(.3 + progress * .3, -.45 + progress * .8, -.2);
        pieces[1].position.y = progress * .8;
        resume();
      };
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', resume);
      releases.push(() => { window.removeEventListener('scroll', update); window.removeEventListener('resize', resume); });
      this.actualizarPaleta = ((palette) => () => { palette(); resume(); })(this.actualizarPaleta);
      document.addEventListener('visibilitychange', resume);
      const motion = matchMedia('(prefers-reduced-motion: reduce)');
      const stopMotion = () => { if (motion.matches) { this.cleanup(); this.ready.set(false); } };
      motion.addEventListener('change', stopMotion);
      const lost = (event: Event) => { event.preventDefault(); this.cleanup(); this.ready.set(false); };
      renderer.domElement.addEventListener('webglcontextlost', lost);
      releases.push(() => {
        cancelAnimationFrame(frame); observer.disconnect();
        document.removeEventListener('visibilitychange', resume);
        motion.removeEventListener('change', stopMotion);
        renderer.domElement.removeEventListener('webglcontextlost', lost);
      });
      this.ready.set(true);
    } catch (error) {
      console.warn('Policalum: WebGL unavailable; using the conceptual roof fallback.', error);
      this.cleanup();
      this.ready.set(false);
      this.aviso.set('Vista ligera disponible. No se pudo iniciar el visor 3D en este dispositivo.');
    }
  }
}

// Shared by rendering and topology tests; no renderer or GPU required.
export function buildConceptualRoof(
  T: typeof import('three'), metal: import('three').MeshStandardMaterial,
  glass: import('three').MeshPhysicalMaterial, rib: import('three').MeshStandardMaterial,
  releases: Array<() => void>,
): import('three').Group[] {
      const box = (x: number, y: number, z: number, material: typeof metal | typeof glass) => {
        const geometry = new T.BoxGeometry(x, y, z);
        releases.push(() => geometry.dispose());
        return new T.Mesh(geometry, material);
      };
      // Four contiguous bays on a perimeter frame, not wings around a central body.
      const supports = new T.Group();
      const joints = new T.Group();
      const edges = new T.Group();
      const sheets = new T.Group();
      const addBeam = (group: typeof supports, x: number, y: number, z: number, w: number, h: number, d: number) => {
        const beam = box(w, h, d, metal);
        beam.position.set(x, y, z);
        group.add(beam);
      };
      for (const x of [-2.4, 2.4]) {
        addBeam(supports, x, -.22, 0, .12, .22, 3.8);
        for (const z of [-1.7, 1.7]) {
          addBeam(supports, x, -1.02, z, .12, 1.5, .12);
          addBeam(supports, x, -1.8, z, .32, .045, .32);
        }
      }
      for (const z of [-1.85, 0, 1.85]) addBeam(supports, 0, -.22, z, 4.9, .22, .12);
      for (const x of [-1.2, 0, 1.2]) {
        addBeam(joints, x, 0, 0, .025, .15, 3.7);
        for (const y of [-.085, .085]) addBeam(joints, x, y, 0, .14, .025, 3.7);
      }
      // U channels close the perimeter and hollow sheet ends.
      for (const x of [-2.4, 2.4]) {
        addBeam(edges, x, 0, 0, .025, .18, 3.75);
        for (const y of [-.09, .09]) addBeam(edges, x, y, 0, .13, .025, 3.75);
      }
      for (const z of [-1.85, 1.85]) {
        addBeam(edges, 0, 0, z, 4.85, .18, .025);
        for (const y of [-.09, .09]) addBeam(edges, 0, y, z, 4.85, .025, .12);
      }
      const wallGeometry = new T.BoxGeometry(.012, .13, 3.6);
      const walls = new T.InstancedMesh(wallGeometry, rib, 4 * 19);
      const matrix = new T.Matrix4();
      let instance = 0;
      for (let bay = 0; bay < 4; bay++) {
        const x = -1.8 + bay * 1.2;
        for (const y of [-.065, .065]) {
          const skin = box(1.18, .012, 3.6, glass);
          skin.position.set(x, y, 0);
          sheets.add(skin);
        }
        for (let channel = 0; channel < 19; channel++) {
          matrix.makeTranslation(x - .57 + channel * .063, 0, 0);
          walls.setMatrixAt(instance++, matrix);
        }
      }
      sheets.add(walls);
      const screwGeometry = new T.CylinderGeometry(.043, .043, .035, 6);
      const screws = new T.InstancedMesh(screwGeometry, metal, 15);
      instance = 0;
      for (const x of [-2.4, -1.2, 0, 1.2, 2.4]) for (const z of [-1.7, 0, 1.7]) {
        matrix.makeTranslation(x, .12, z);
        screws.setMatrixAt(instance++, matrix);
      }
      joints.add(screws);
      releases.push(() => wallGeometry.dispose(), () => screwGeometry.dispose());
      return [supports, joints, edges, sheets];
}
