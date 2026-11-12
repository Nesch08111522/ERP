import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CmsStore } from '../core/cms.store';
import { GaleriaMaterialesComponent } from './galeria-materiales.component';

describe('Galería de materiales', () => {
  afterEach(() => { TestBed.resetTestingModule(); vi.useRealTimers(); vi.restoreAllMocks(); });

  function crear(paquete: unknown = null) {
    TestBed.configureTestingModule({ providers: [{ provide: CmsStore, useValue: { paquete: signal(paquete) } }] });
    const fixture = TestBed.createComponent(GaleriaMaterialesComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('shows six distinct real posters without loading videos in the default grid', () => {
    const fixture = crear();
    const images = [...fixture.nativeElement.querySelectorAll('.reel-item img')] as HTMLImageElement[];
    expect(images).toHaveLength(6);
    expect(new Set(images.map(image => image.getAttribute('src'))).size).toBe(6);
    expect(fixture.nativeElement.querySelector('video')).toBeNull();
    expect(fixture.componentInstance.piezas.every(piece => piece.imagenUrl.endsWith('-poster.jpg'))).toBe(true);
  });

  it('uses the bundled poster when CMS publishes a bundled video without an image', () => {
    const fixture = crear({ materiales: [{ id:'cms-location', nombre:'Ubicación', videoUrl:'/videos/ubicanos.mp4' }] });
    expect(fixture.componentInstance.piezas[0].imagenUrl).toBe('/videos/ubicanos-poster.jpg');
  });

  it('does not substitute an unrelated illustration for an external CMS video', () => {
    const fixture = crear({ materiales: [{ id:'new', nombre:'Nuevo video', videoUrl:'https://example.test/video.mp4' }] });
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(fixture.nativeElement.querySelector('video')?.getAttribute('preload')).toBe('metadata');
  });

  it('opens an image-only item as a modal too', () => {
    vi.useFakeTimers();
    const fixture = crear({ materiales: [{ id:'photo', nombre:'Material', imagenUrl:'/foto.jpg' }] });
    fixture.componentInstance.abrir(0);
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    // jsdom does not implement the browser's native dialog API.
    const show = vi.fn(() => dialog.setAttribute('open', ''));
    Object.defineProperty(dialog, 'showModal', { value: show });
    vi.advanceTimersByTime(40);
    expect(show).toHaveBeenCalledOnce();
    fixture.destroy();
  });
});
