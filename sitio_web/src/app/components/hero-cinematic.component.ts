import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-cinematic',
  imports: [RouterLink],
  template: `
    <section #host class="cinema" aria-label="Materiales para construir">
      <div class="cinema-sticky">
        <div #surface class="cinema-surface" aria-hidden="true"></div>
        @if (!ready()) {
          <div class="cinema-fallback" aria-hidden="true"><span class="profile-h">H</span><span class="clear-sheet"></span></div>
        }
        <div class="cinema-copy">
          <p class="kicker reveal">POLICALUM / Trujillo</p>
          <h1 class="reveal">La forma<br>de construir<br><em>sin límites.</em></h1>
          <p class="lead reveal">Policarbonato, perfiles y cubiertas. Materiales para tu proyecto, con precio y stock publicados desde el almacén.</p>
          <div class="hero-actions reveal"><a class="btn btn-primary" routerLink="/catalogo">Explorar materiales ↗</a><a class="btn btn-line" routerLink="/cotizar">Cotizar proyecto</a></div>
        </div>
        <p class="cinema-note">Perfil H + plancha / representación conceptual procedural</p>
        <p class="cinema-scroll">Desplázate para explorar ↓</p>
      </div>
    </section>
  `,
})
export class HeroCinematicComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLElement>;
  @ViewChild('surface', { static: true }) surface!: ElementRef<HTMLElement>;
  readonly ready = signal(false);
  private disposed = false;
  private cleanup = () => {};

  ngAfterViewInit(): void {
    if (typeof matchMedia !== 'function' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    void this.initialize();
  }

  ngOnDestroy(): void {
    this.disposed = true;
    this.cleanup();
  }

  private async initialize(): Promise<void> {
    const releases: Array<() => void> = [];
    this.cleanup = () => releases.splice(0).reverse().forEach((release) => release());
    try {
      const [T, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('three'), import('gsap'), import('gsap/ScrollTrigger'),
      ]);
      if (this.disposed) return;
      gsap.registerPlugin(ScrollTrigger);
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
      scene.add(new T.HemisphereLight(0xccefff, 0x392064, 3));
      const key = new T.DirectionalLight(0xffffff, 5);
      key.position.set(3, 4, 5);
      scene.add(key);
      const rim = new T.PointLight(0x83dcff, 80);
      rim.position.set(-3, 0, 2);
      scene.add(rim);
      const assembly = new T.Group();
      assembly.position.x = innerWidth < 700 ? .35 : 1.8;
      assembly.rotation.set(.3, -.45, -.2);
      scene.add(assembly);
      const metal = new T.MeshStandardMaterial({ color: 0xc0ccd8, metalness: .85, roughness: .28 });
      const glass = new T.MeshPhysicalMaterial({ color: 0xa2e5fa, transparent: true, opacity: .3, roughness: .16, transmission: .5, thickness: .12, side: T.DoubleSide });
      releases.push(() => metal.dispose(), () => glass.dispose());
      const dimensions = [[.18, 1.2, 3.5], [1.1, .14, 3.5], [1.1, .14, 3.5], [2.6, .09, 3.25]];
      const pieces = dimensions.map(([x, y, z], i) => {
        const geometry = new T.BoxGeometry(x, y, z);
        releases.push(() => geometry.dispose());
        const mesh = new T.Mesh(geometry, i === 3 ? glass : metal);
        mesh.position.set(i === 3 ? 1.25 : 0, i === 1 ? .6 : i === 2 ? -.6 : 0, 0);
        assembly.add(mesh);
        return mesh;
      });
      const particlesGeometry = new T.BufferGeometry();
      const positions = new Float32Array(180 * 3);
      for (let i = 0; i < positions.length; i++) positions[i] = Math.sin(i * 127.1) * 7;
      particlesGeometry.setAttribute('position', new T.BufferAttribute(positions, 3));
      const particlesMaterial = new T.PointsMaterial({ color: 0xb6ecff, size: .018, transparent: true, opacity: .45 });
      const particles = new T.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);
      releases.push(() => particlesGeometry.dispose(), () => particlesMaterial.dispose());
      const resize = new ResizeObserver(() => {
        const { width, height } = surface.getBoundingClientRect();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.25 : 1.75));
        assembly.position.x = innerWidth < 700 ? .35 : 1.8;
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
      });
      resize.observe(surface);
      releases.push(() => resize.disconnect());
      const context = gsap.context(() => {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: host, start: 'top top+=90', end: 'bottom bottom', scrub: .8 } });
        timeline.to(assembly.rotation, { y: 1.2, x: .6, duration: 1 }, 0)
          .to(assembly.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 1 }, 0)
          .to(pieces[1].position, { y: 1.3, duration: .6 }, .4)
          .to(pieces[2].position, { y: -1.3, duration: .6 }, .4)
          .to(pieces[3].position, { x: 2.3, duration: .6 }, .4);
        gsap.from(host.querySelectorAll('.reveal'), { opacity: 0, y: 35, stagger: .12, duration: .9, clearProps: 'all', scrollTrigger: { trigger: host, start: 'top 85%', once: true } });
      }, host);
      releases.push(() => context.revert());
      let visible = false;
      let frame = 0;
      const render = () => {
        frame = 0;
        if (!visible || document.hidden || this.disposed) return;
        particles.rotation.y += .0004;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };
      const resume = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        if (visible && !document.hidden && !this.disposed) frame = requestAnimationFrame(render);
      };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
      observer.observe(host);
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
    } catch {
      this.cleanup();
      this.ready.set(false);
    }
  }
}
