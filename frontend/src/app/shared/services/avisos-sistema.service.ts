import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MarcaService } from './marca.service';

export interface AvisoLocal {
  id: number;
  titulo: string;
  cuerpo: string;
  url: string;
  celular: boolean;
}

/** Aviso del sistema: esquina en computadora y televisor, barra de estado en el celular. */
@Injectable({ providedIn: 'root' })
export class AvisosSistema {
  readonly locales = signal<AvisoLocal[]>([]);
  private secuencia = 0;
  private registroPendiente: Promise<ServiceWorkerRegistration | null> | null = null;

  constructor(private readonly http: HttpClient, private readonly marca: MarcaService) {}

  preparar(): void {
    void this.registro();
    if (this.permiso() === 'granted') void this.suscribir();
  }

  estaActivo(): boolean {
    return this.permiso() === 'granted' && !!localStorage.getItem('policalum-push');
  }

  permiso(): NotificationPermission | 'no' {
    if (typeof Notification === 'undefined') return 'no';
    return Notification.permission;
  }

  /** Pide permiso y deja este aparato suscrito para recibir avisos con la pantalla apagada. */
  async pedir(): Promise<'ok' | 'denegado' | 'inseguro' | 'no'> {
    if (typeof Notification === 'undefined' || !('serviceWorker' in navigator)) return 'no';
    if (!window.isSecureContext) return 'inseguro';
    if (Notification.permission === 'denied') return 'denegado';
    if (Notification.permission === 'default') {
      const permiso = await Notification.requestPermission();
      if (permiso !== 'granted') return 'denegado';
    }
    await this.suscribir();
    return 'ok';
  }

  async mostrar(titulo: string, cuerpo: string, url: string): Promise<void> {
    const celular = this.esCelular();
    const nativo = await this.nativo(titulo, cuerpo, url);
    if (nativo) return;
    const aviso: AvisoLocal = { id: ++this.secuencia, titulo, cuerpo, url, celular };
    this.locales.update((lista) => [...lista, aviso].slice(-4));
    window.setTimeout(() => this.cerrar(aviso.id), 8000);
  }

  cerrar(id: number): void {
    this.locales.update((lista) => lista.filter((aviso) => aviso.id !== id));
  }

  /** Computadora y televisor: esquina del sistema. Celular: barra de estado. */
  private esCelular(): boolean {
    return window.matchMedia('(max-width: 900px)').matches && window.matchMedia('(pointer: coarse)').matches;
  }

  private async nativo(titulo: string, cuerpo: string, url: string): Promise<boolean> {
    if (this.permiso() !== 'granted' || typeof Notification === 'undefined') return false;
    const icono = '/POLICALUM.png';
    try {
      const registro = await this.registro();
      if (registro) {
        await registro.showNotification(titulo, {
          body: cuerpo,
          tag: `policalum-${Date.now()}`,
          icon: icono,
          badge: icono,
          data: { url },
          silent: false,
        });
        return true;
      }
      const aviso = new Notification(titulo, { body: cuerpo, tag: `policalum-${Date.now()}`, icon: icono });
      aviso.onclick = () => {
        window.focus();
        aviso.close();
        location.assign(url);
      };
      return true;
    } catch {
      return false;
    }
  }

  async apagar(): Promise<void> {
    const registro = await this.registro();
    const actual = await registro?.pushManager.getSubscription();
    const endpoint = actual?.endpoint || localStorage.getItem('policalum-push') || '';
    await actual?.unsubscribe();
    if (endpoint) {
      await firstValueFrom(this.http.delete(`${environment.apiUrl}/api/v1/notificaciones/push`, { params: { endpoint }, responseType: 'text' }));
    }
    localStorage.removeItem('policalum-push');
  }

  private registro(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return Promise.resolve(null);
    this.registroPendiente ??= navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(() => null);
    return this.registroPendiente;
  }

  private async suscribir(): Promise<void> {
    if (!('PushManager' in window)) return;
    try {
      const registro = await this.registro();
      if (!registro) return;
      let actual = await registro.pushManager.getSubscription();
      if (!actual) {
        const clave = await firstValueFrom(this.http.get<{ publica: string }>(`${environment.apiUrl}/api/v1/notificaciones/push/clave`));
        actual = await registro.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: clavePush(clave.publica),
        });
      }
      const json = actual.toJSON();
      await firstValueFrom(this.http.post(`${environment.apiUrl}/api/v1/notificaciones/push`, {
        endpoint: actual.endpoint,
        keys: { p256dh: json.keys?.['p256dh'], auth: json.keys?.['auth'] },
        dispositivo: navigator.userAgent,
      }, { responseType: 'text' }));
      localStorage.setItem('policalum-push', actual.endpoint);
    } catch {
      // Este navegador muestra el aviso en la esquina mientras el ERP está abierto.
    }
  }
}

function clavePush(base64: string): ArrayBuffer {
  const limpia = base64.replace(/-/g, '+').replace(/_/g, '/');
  const crudo = atob(limpia);
  const bytes = new Uint8Array(crudo.length);
  for (let i = 0; i < crudo.length; i += 1) bytes[i] = crudo.charCodeAt(i);
  return bytes.buffer;
}
