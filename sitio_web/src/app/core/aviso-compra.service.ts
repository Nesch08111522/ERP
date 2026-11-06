import { Injectable, inject, signal } from '@angular/core';
import { CarritoService, enlaceWhatsapp } from './carrito.service';
import { EmpresaStore } from './empresa.store';
import { PortalApi, mensajeError, pen } from './portal.api';

/** Abre WhatsApp con el carrito y deja el mismo pedido como aviso en el ERP. */
@Injectable({ providedIn: 'root' })
export class AvisoCompraService {
  private readonly api = inject(PortalApi);
  private readonly carrito = inject(CarritoService);
  private readonly marca = inject(EmpresaStore);
  private firma = '';

  readonly aviso = signal('');
  readonly enviando = signal(false);

  enlace(total: number): string | null {
    const numero = this.marca.empresa().whatsapp;
    if (!numero) return null;
    const lineas = this.carrito.snapshot();
    if (!lineas.length) {
      return `https://wa.me/${numero}?text=${encodeURIComponent('Hola POLICALUM, quiero hablar con un asesor.')}`;
    }
    return enlaceWhatsapp(numero, lineas, total, pen);
  }

  comprar(total: number): void {
    const lineas = this.carrito.snapshot();
    const enlace = this.enlace(total);
    if (enlace) window.open(enlace, '_blank', 'noopener,noreferrer');
    if (!lineas.length) return;
    const firma = lineas.map((linea) => `${linea.productoId}:${linea.fraccionId ?? ''}:${linea.cantidad}`).join('|');
    if (firma === this.firma) {
      this.aviso.set('Ventas ya tiene esta lista. Te abrimos WhatsApp de nuevo.');
      return;
    }
    this.enviando.set(true);
    this.aviso.set('');
    this.api.pedidoWhatsapp({
      website: '',
      lineas: lineas.map((linea) => ({
        productoId: linea.productoId,
        fraccionId: linea.fraccionId || null,
        cantidad: linea.cantidad,
      })),
    }).subscribe({
      next: () => {
        this.firma = firma;
        this.enviando.set(false);
        this.aviso.set(enlace
          ? 'Ventas ya recibió tu pedido. Confírmalo en WhatsApp.'
          : 'Ventas ya recibió tu pedido en el ERP.');
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.aviso.set(mensajeError(error));
      },
    });
  }
}
