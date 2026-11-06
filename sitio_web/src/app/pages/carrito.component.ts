import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvisoCompraService } from '../core/aviso-compra.service';
import { CarritoService } from '../core/carrito.service';
import { media, pen } from '../core/portal.api';

@Component({
  selector: 'app-carrito',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './carrito.component.html',
})
export class CarritoComponent {
  readonly carrito = inject(CarritoService);
  readonly compra = inject(AvisoCompraService);
  readonly pen = pen;
  readonly media = media;
}
