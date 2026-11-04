import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { toDataURL } from 'qrcode';
import * as Api from '../../../core/api/openapi.types';
import { ConfiguracionApiService } from '../../configuracion/data-access/configuracion.api';
import { MarcaService } from '../../../shared/services/marca.service';
import { PenPipe } from '../../../shared/pipes/format.pipes';

export interface TicketVentaData {
  id: string;
  ticketRegistro?: string;
  serieCorrelativo?: string;
  tipoComprobante?: string;
  estado?: string;
  estadoSunat?: string;
  createdAt?: string;
  sedeNombre?: string;
  clienteNombre?: string;
  clienteDocumento?: string;
  usuarioNombre?: string;
  subtotalNeto?: number;
  totalIgv?: number;
  total?: number;
  lineas: Array<{ descripcion: string; cantidad: number; precioUnitario: number; subtotal: number }>;
  pagos: Array<{ metodo: string; monto: number; referencia?: string }>;
}

export function ticketDesdeVenta(detalle: Api.VentaDetalleResponseDTO): TicketVentaData | null {
  if (!detalle.id) return null;
  return {
    id: detalle.id,
    ticketRegistro: detalle.ticketRegistro,
    serieCorrelativo: detalle.serieCorrelativo,
    tipoComprobante: detalle.tipoComprobante,
    estado: detalle.estado,
    estadoSunat: detalle.estadoSunat,
    createdAt: detalle.createdAt,
    sedeNombre: detalle.sedeNombre,
    clienteNombre: detalle.clienteNombre,
    clienteDocumento: detalle.clienteDocumento,
    usuarioNombre: detalle.usuarioNombre,
    subtotalNeto: detalle.subtotalNeto,
    totalIgv: detalle.totalIgv,
    total: detalle.total,
    lineas: (detalle.lineas ?? []).map((linea) => ({
      descripcion: linea.productoNombre || linea.servicioNombre || linea.fraccionNombre || 'Ítem',
      cantidad: linea.cantidad ?? 0,
      precioUnitario: linea.precioUnitarioConIgv ?? 0,
      subtotal: linea.subtotal ?? 0,
    })),
    pagos: (detalle.pagos ?? []).map((pago) => ({
      metodo: pago.metodoPago ?? 'Pago',
      monto: pago.monto ?? 0,
      referencia: pago.referencia,
    })),
  };
}

@Component({
  selector: 'app-venta-ticket',
  standalone: true,
  imports: [CommonModule, PenPipe],
  templateUrl: './venta-ticket.component.html',
  styleUrl: './venta-ticket.component.css',
})
export class VentaTicketComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) venta!: TicketVentaData;
  empresa: Api.EmpresaResponseDTO | null = null;
  empresaCargando = true;
  empresaError = '';
  qrImagen = '';
  qrCargando = false;
  qrError = '';
  copiarMensaje = '';
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly configuracion: ConfiguracionApiService, readonly marca: MarcaService) {
    this.configuracion.GetApiV1ConfiguracionEmpresa().pipe(takeUntil(this.destroy$)).subscribe({
      next: (empresa) => { this.empresa = empresa; this.empresaError = ''; this.empresaCargando = false; },
      error: (error: unknown) => {
        console.error('No se pudo cargar la configuración de empresa para el ticket.', error);
        this.empresa = null;
        this.empresaError = 'No se pudo cargar la configuración de empresa.';
        this.empresaCargando = false;
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['venta'] && this.venta?.id) this.generarQr();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fecha(value?: string): string {
    if (!value) return 'Fecha no disponible';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 'Fecha no disponible' : parsed.toLocaleString('es-PE');
  }

  imprimir(): void {
    window.print();
  }

  async copiarCodigo(): Promise<void> {
    const codigo = this.venta.ticketRegistro || this.venta.id;
    this.copiarMensaje = '';
    try {
      await navigator.clipboard.writeText(codigo);
      this.copiarMensaje = 'Código copiado.';
    } catch (error) {
      console.error('No se pudo copiar el código del ticket.', error);
      this.copiarMensaje = 'No se pudo copiar. Selecciona y copia el código manualmente.';
    }
  }

  private generarQr(): void {
    this.qrImagen = '';
    this.qrError = '';
    this.qrCargando = true;
    const destino = new URL('/modules/ventas', window.location.origin);
    destino.searchParams.set('ventaId', this.venta.id);
    toDataURL(destino.toString(), { width: 180, margin: 1, errorCorrectionLevel: 'M' })
      .then((imagen) => { this.qrImagen = imagen; this.qrCargando = false; })
      .catch((error: unknown) => {
        console.error('No se pudo generar el QR del ticket.', error);
        this.qrError = 'No se pudo generar el código QR. El código de venta sigue disponible.';
        this.qrCargando = false;
      });
  }
}
