import { Component, DestroyRef, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FichaProductoComponent } from '../components/ficha-producto.component';
import { CategoriaPublica, ProductoPublico } from '../core/models';
import { PortalApi, mensajeError } from '../core/portal.api';

const COLORES: ReadonlyArray<readonly [string, string]> = [
  ['transparente', 'Transparente'],
  ['cristal', 'Cristal'],
  ['bronce', 'Bronce'],
  ['ahumado', 'Ahumado'],
  ['humo', 'Humo'],
  ['opalino', 'Opalino'],
  ['ópalo', 'Ópalo'],
  ['opal', 'Opal'],
  ['lechoso', 'Lechoso'],
  ['blanco', 'Blanco'],
  ['azul', 'Azul'],
  ['verde', 'Verde'],
  ['rojo', 'Rojo'],
  ['gris', 'Gris'],
  ['negro', 'Negro'],
  ['amarillo', 'Amarillo'],
  ['naranja', 'Naranja'],
];

function textoDe(producto: ProductoPublico): string {
  return `${producto.nombre} ${producto.descripcion ?? ''}`.toLocaleLowerCase('es');
}

function tipoDe(producto: ProductoPublico): string {
  const nombre = producto.nombre.toLocaleLowerCase('es');
  if (nombre.includes('alveolar')) return 'Alveolar';
  if (nombre.includes('sólido') || nombre.includes('solido')) return 'Sólido';
  if (nombre.includes('perfil')) return 'Perfil';
  return 'Accesorio';
}

function materialDe(producto: ProductoPublico): string {
  const nombre = producto.nombre.toLocaleLowerCase('es');
  const texto = `${nombre} ${textoDe(producto)}`;
  if (nombre.includes('neopreno') || texto.includes('neopreno')) return 'Neopreno';
  if (nombre.includes('silicona') || texto.includes('silicona')) return 'Silicona';
  if (nombre.includes('aluminio') || nombre.includes('perfil')) return 'Aluminio';
  if (nombre.includes('policarbonato') || texto.includes('policarbonato')) return 'Policarbonato';
  return '';
}

function presentacionDe(producto: ProductoPublico): string {
  const unidad = (producto.unidad ?? '').toUpperCase();
  if (unidad.startsWith('PLANCHA')) return 'Plancha';
  if (unidad.startsWith('BARRA')) return 'Barra';
  if (unidad === 'UNID' || unidad === 'UNIDAD' || unidad === 'UND') return 'Unidad';
  if (!unidad) return '';
  return unidad.charAt(0) + unidad.slice(1).toLowerCase();
}

function colorDe(producto: ProductoPublico): string {
  const texto = textoDe(producto);
  return COLORES.find(([clave]) => texto.includes(clave))?.[1] ?? '';
}

function unicos(valores: string[]): string[] {
  return [...new Set(valores.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
}

function esUltima(producto: ProductoPublico): boolean {
  const stock = Number(producto.stock ?? 0);
  return producto.disponible && stock > 0 && stock <= 8;
}

@Component({
  selector: 'app-catalogo',
  imports: [FichaProductoComponent, RouterLink],
  templateUrl: './catalogo.component.html',
})
export class CatalogoComponent implements OnInit {
  private readonly api = inject(PortalApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly categorias = signal<CategoriaPublica[]>([]);
  readonly productos = signal<ProductoPublico[]>([]);
  readonly pagina = signal(0);
  readonly paginas = signal(0);
  readonly total = signal(0);
  readonly categoriaId = signal('');
  readonly vista = signal('');
  readonly q = signal('');
  readonly orden = signal<'reciente' | 'precio' | 'nombre'>('reciente');
  readonly soloStock = signal(false);
  readonly soloDestacado = signal(false);
  readonly soloCorte = signal(false);
  readonly soloUltimas = signal(false);
  readonly tipo = signal('');
  readonly material = signal('');
  readonly presentacion = signal('');
  readonly color = signal('');
  readonly espesor = signal('');
  readonly vistaLista = signal(localStorage.getItem('policalum-vista') === 'lista');
  readonly cargando = signal(true);
  readonly descargandoCatalogo = signal(false);
  readonly errorCatalogo = signal('');
  readonly error = signal('');
  readonly enCache = signal(false);
  readonly titulo = computed(() => {
    if (this.q()) return 'Resultados';
    if (this.vista() === 'destacados') return 'Destacados';
    if (this.vista() === 'ofertas') return 'Ofertas';
    const id = this.categoriaId();
    if (!id) return 'Todos los productos';
    return this.categorias().find((categoria) => categoria.id === id)?.nombre ?? 'Colección';
  });
  readonly espesores = computed(() => {
    const hallados = new Set<string>();
    for (const producto of this.productos()) {
      const coincide = `${producto.nombre} ${producto.descripcion ?? ''}`.match(/(\d+(?:[.,]\d+)?)\s*mm/i);
      if (coincide) hallados.add(coincide[1].replace(',', '.'));
    }
    return [...hallados].sort((a, b) => Number(a) - Number(b));
  });
  readonly tipos = computed(() => unicos(this.productos().map(tipoDe)));
  readonly materiales = computed(() => unicos(this.productos().map(materialDe)));
  readonly presentaciones = computed(() => unicos(this.productos().map(presentacionDe)));
  readonly colores = computed(() => unicos(this.productos().map(colorDe)));
  readonly hayDestacados = computed(() => this.productos().some((producto) => producto.destacado));
  readonly hayCortes = computed(() => this.productos().some((producto) => producto.esFraccionable));
  readonly hayUltimas = computed(() => this.productos().some(esUltima));
  readonly hayFiltro = computed(() =>
    this.vista() === 'ofertas' || this.soloStock() || this.soloDestacado() || this.soloCorte() || this.soloUltimas()
    || Boolean(this.tipo() || this.material() || this.presentacion() || this.color() || this.espesor()));
  readonly visibles = computed(() => {
    let lista = [...this.productos()];
    if (this.vista() === 'ofertas') lista = lista.filter((producto) => producto.oferta);
    if (this.soloDestacado()) lista = lista.filter((producto) => producto.destacado);
    if (this.soloCorte()) lista = lista.filter((producto) => producto.esFraccionable);
    if (this.soloStock()) lista = lista.filter((producto) => producto.disponible);
    if (this.soloUltimas()) lista = lista.filter(esUltima);
    if (this.tipo()) lista = lista.filter((producto) => tipoDe(producto) === this.tipo());
    if (this.material()) lista = lista.filter((producto) => materialDe(producto) === this.material());
    if (this.presentacion()) lista = lista.filter((producto) => presentacionDe(producto) === this.presentacion());
    if (this.color()) lista = lista.filter((producto) => colorDe(producto) === this.color());
    const mm = this.espesor();
    if (mm) lista = lista.filter((producto) => new RegExp(`(?:^|\\D)${mm.replace('.', '\\.')}\\s*mm`, 'i').test(`${producto.nombre} ${producto.descripcion ?? ''}`));
    if (this.orden() === 'precio') lista.sort((a, b) => a.precioPublico - b.precioPublico);
    if (this.orden() === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    return lista;
  });

  ngOnInit(): void {
    this.api.categorias().subscribe({ next: (lista) => this.categorias.set(lista), error: () => undefined });
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.categoriaId.set(params.get('categoria') ?? '');
      this.vista.set(params.get('vista') ?? '');
      this.q.set(params.get('q') ?? '');
      this.pagina.set(Number(params.get('page') ?? '0') || 0);
      this.cargar();
    });
  }

  cambiarVista(lista: boolean): void {
    this.vistaLista.set(lista);
    localStorage.setItem('policalum-vista', lista ? 'lista' : 'cuadros');
  }

  ordenar(valor: string): void {
    if (valor === 'precio' || valor === 'nombre' || valor === 'reciente') this.orden.set(valor);
  }

  verOfertas(activo: boolean): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { vista: activo ? 'ofertas' : null },
      queryParamsHandling: 'merge',
    });
  }

  limpiar(): void {
    this.soloStock.set(false);
    this.soloDestacado.set(false);
    this.soloCorte.set(false);
    this.soloUltimas.set(false);
    this.tipo.set('');
    this.material.set('');
    this.presentacion.set('');
    this.color.set('');
    this.espesor.set('');
    if (this.vista() === 'ofertas') this.verOfertas(false);
  }

  @HostListener('document:visibilitychange')
  alVolver(): void {
    if (document.visibilityState === 'visible') this.cargar(true);
  }

  mover(delta: number): void {
    const siguiente = this.pagina() + delta;
    if (siguiente < 0 || siguiente >= this.paginas()) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: siguiente || null },
      queryParamsHandling: 'merge',
    });
  }

  reintentar(): void {
    this.cargar();
  }

  descargarCatalogo(): void {
    if (this.descargandoCatalogo()) return;
    this.descargandoCatalogo.set(true);
    this.errorCatalogo.set('');
    this.api.catalogoPdf().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (pdf) => {
        const url = URL.createObjectURL(pdf);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = 'catalogo-policalum.pdf';
        enlace.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        this.descargandoCatalogo.set(false);
      },
      error: (error: unknown) => {
        this.errorCatalogo.set(mensajeError(error));
        this.descargandoCatalogo.set(false);
      },
    });
  }

  private cargar(silencioso = false): void {
    if (!silencioso) {
      this.cargando.set(true);
      this.error.set('');
    }
    if (this.vista() === 'destacados' && !this.q() && !this.categoriaId()) {
      this.api.destacados().subscribe({
        next: (lista) => {
          this.enCache.set(false);
          this.productos.set(lista);
          this.paginas.set(1);
          this.total.set(lista.length);
          this.cargando.set(false);
        },
        error: (error: unknown) => {
          this.cargando.set(false);
          if (!silencioso || !this.productos().length) this.error.set(mensajeError(error));
        },
      });
      return;
    }
    this.api.productos({
      categoriaId: this.categoriaId() || undefined,
      q: this.q().trim() || undefined,
      page: this.pagina(),
      size: 48,
    }).subscribe({
      next: (pagina) => {
        this.enCache.set(Boolean(pagina.enCache));
        this.productos.set(pagina.content ?? []);
        this.paginas.set(pagina.totalPages ?? 0);
        this.total.set(pagina.totalElements ?? 0);
        this.cargando.set(false);
        if (pagina.enCache) this.error.set('Sin conexión con el servidor. Sigues viendo el último catálogo guardado en este navegador.');
      },
      error: (error: unknown) => {
        this.cargando.set(false);
        if (!silencioso || !this.productos().length) this.error.set(mensajeError(error));
      },
    });
  }
}
