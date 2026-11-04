import { effect, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { MarcaService } from '../shared/services/marca.service';

@Injectable()
export class ErpTitleStrategy extends TitleStrategy {
  private pageTitle = '';

  constructor(private readonly title: Title, private readonly marca: MarcaService) {
    super();
    effect(() => {
      this.marca.nombre();
      this.publicarTitulo();
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.pageTitle = this.buildTitle(snapshot) ?? '';
    this.publicarTitulo();
  }

  private publicarTitulo(): void {
    const marca = this.marca.nombre();
    this.title.setTitle(this.pageTitle ? `${this.pageTitle} · ${marca} ERP` : `${marca} ERP`);
  }
}
