
import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ChangeDetectionStrategy
} from '@angular/core';

import { ColumnDef } from '../../models/ui.models';
import { FechaPipe, NumeroPipe, PenPipe } from '../../pipes/format.pipes';
import { displayText, readPath } from '../../utils/feedback';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { LoaderComponent } from '../loader/loader.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    CommonModule,
    PenPipe,
    FechaPipe,
    NumeroPipe,
    EmptyStateComponent,
    LoaderComponent,
    PaginationComponent
  ],
  template: `
    <section
      class="table-wrap"
      [class.is-refreshing]="loading && rows.length"
      [class.has-error]="!!error"
    >

      <!-- MENSAJE DE ERROR -->
      <div *ngIf="error" class="alert alert-error table-error">
        <div class="table-error-content">
          <strong>No se pudieron cargar los datos</strong>
          <p>{{ error }}</p>

          <p *ngIf="status" class="text-xs">
            Código {{ status }}
          </p>
        </div>

        <button
          type="button"
          class="btn btn-ghost btn-sm"
          (click)="retry.emit()"
        >
          Reintentar
        </button>
      </div>

      <!-- ====================================== -->
      <!-- VISTA ESCRITORIO / TABLET -->
      <!-- ====================================== -->

      <div
        class="table-scroll desktop-table"
        *ngIf="(!loading || rows.length) && (!error || rows.length)"
      >
        <table class="table">
          <thead>
            <tr>
              <th
                *ngFor="let column of columns; trackBy: trackColumn"
                [style.width]="column.width"
                [ngClass]="{
                  sortable: !!column.sortable,
                  'align-end': column.align === 'end',
                  'align-center': column.align === 'center'
                }"
                (click)="sort(column)"
                [attr.aria-sort]="aria(column)"
                [class.sortable]="!!column.sortable"
              >
                <span>{{ column.label }}</span>

                <span
                  *ngIf="column.sortable"
                  class="sort-mark"
                  aria-hidden="true"
                >
                  {{ mark(column) }}
                </span>
              </th>

              <th *ngIf="actions" class="col-actions">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              *ngFor="let row of rows; let index = index; trackBy: track"
              (click)="rowClick.emit(row)"
              [class.clickable-row]="rowClickable"
            >
              <td
                *ngFor="let column of columns; trackBy: trackColumn"
                [ngClass]="{
                  'align-end': column.align === 'end',
                  'align-center': column.align === 'center'
                }"
              >
                <ng-container
                  [ngTemplateOutlet]="cellTemplate"
                  [ngTemplateOutletContext]="{
                    $implicit: row,
                    column: column
                  }"
                ></ng-container>
              </td>

              <td
                *ngIf="actions"
                class="col-actions"
                (click)="$event.stopPropagation()"
              >
                <ng-container
                  *ngTemplateOutlet="actions; context: { $implicit: row }"
                ></ng-container>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ====================================== -->
      <!-- VISTA MÓVIL: TARJETAS ACORDEÓN -->
      <!-- ====================================== -->

      <div
        class="mobile-table"
        *ngIf="(!loading || rows.length) && (!error || rows.length)"
      >
        <article
          class="mobile-record"
          *ngFor="let row of rows; let index = index; trackBy: track"
          [class.is-expanded]="isExpanded(row, index)"
        >

          <!-- CABECERA DE LA TARJETA -->
          <button
            type="button"
            class="mobile-record-header"
            (click)="toggleExpanded(row, index)"
            [attr.aria-expanded]="isExpanded(row, index)"
            [attr.aria-controls]="'mobile-details-' + index"
          >
            <div class="mobile-record-heading">

              <span class="mobile-record-index">
                {{ index + 1 + (page * size) }}
              </span>

              <div class="mobile-record-main">
                <strong class="mobile-record-title">
                  {{ mobileTitle(row) }}
                </strong>

                <span
                  class="mobile-record-subtitle"
                  *ngIf="mobileSubtitle(row)"
                >
                  {{ mobileSubtitle(row) }}
                </span>
              </div>

            </div>

            <span
              class="mobile-record-chevron"
              [class.rotated]="isExpanded(row, index)"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </span>
          </button>

          <!-- CONTENIDO DESPLEGABLE -->
          <div
            class="mobile-record-details"
            *ngIf="isExpanded(row, index)"
            [id]="'mobile-details-' + index"
          >

            <div class="mobile-record-fields">

              <div
                class="mobile-record-field"
                *ngFor="let column of columns; trackBy: trackColumn"
              >
                <span class="mobile-field-label">
                  {{ column.label }}
                </span>

                <div
                  class="mobile-field-value"
                  [ngClass]="{
                    'align-end': column.align === 'end',
                    'align-center': column.align === 'center'
                  }"
                >
                  <ng-container
                    [ngTemplateOutlet]="cellTemplate"
                    [ngTemplateOutletContext]="{
                      $implicit: row,
                      column: column
                    }"
                  ></ng-container>
                </div>
              </div>

            </div>

            <!-- ACCIONES -->
            <div
              class="mobile-record-actions"
              *ngIf="actions"
              (click)="$event.stopPropagation()"
            >
              <span class="mobile-actions-label">
                Acciones disponibles
              </span>

              <ng-container
                *ngTemplateOutlet="actions; context: { $implicit: row }"
              ></ng-container>
            </div>

            <!-- VER REGISTRO -->
            <button
              *ngIf="rowClickable"
              type="button"
              class="mobile-record-view"
              (click)="rowClick.emit(row)"
            >
              Ver registro
            </button>

          </div>

        </article>
      </div>

      <!-- ====================================== -->
      <!-- PLANTILLA COMPARTIDA DE CELDAS -->
      <!-- ====================================== -->

      <ng-template #cellTemplate let-row let-column="column">

        <ng-container [ngSwitch]="column.kind || 'text'">

          <!-- DINERO -->
          <span *ngSwitchCase="'money'">
            {{ cell(row, column.key) | pen }}
          </span>

          <!-- FECHA -->
          <span *ngSwitchCase="'date'">
            {{ cell(row, column.key) | fecha }}
          </span>

          <!-- NÚMERO -->
          <span *ngSwitchCase="'number'">
            {{ cell(row, column.key) | numero }}
          </span>

          <!-- BOOLEANO -->
          <span
            *ngSwitchCase="'bool'"
            class="badge"
            [class.badge-success]="truthy(row, column.key)"
            [class.badge-neutral]="!truthy(row, column.key)"
          >
            {{ truthy(row, column.key) ? 'Sí' : 'No' }}
          </span>

          <!-- ETIQUETA -->
          <span
            *ngSwitchCase="'badge'"
            class="badge"
            [ngClass]="badgeClass(row, column)"
          >
            {{ text(row, column.key) }}
          </span>

          <!-- TEXTO -->
          <span *ngSwitchDefault>
            {{ text(row, column.key) }}
          </span>

        </ng-container>

      </ng-template>

      <!-- CARGANDO -->
      <app-loader
        *ngIf="loading && !rows.length && !error"
      ></app-loader>

      <!-- SIN REGISTROS -->
      <app-empty-state
        *ngIf="!loading && !error && !rows.length"
        [title]="emptyTitle"
        [message]="emptyMessage"
        [actionLabel]="emptyAction"
        (action)="empty.emit()"
      ></app-empty-state>

      <!-- PAGINACIÓN -->
      <app-pagination
        *ngIf="!error || rows.length"
        [page]="page"
        [size]="size"
        [totalElements]="totalElements"
        [totalPages]="totalPages"
        (pageChange)="pageChange.emit($event)"
        (sizeChange)="sizeChange.emit($event)"
      ></app-pagination>

    </section>
  `
})
export class DataTableComponent {

  @Input() columns: ColumnDef[] = [];
  @Input() rows: unknown[] = [];

  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() status: number | null = null;

  @Input() page = 0;
  @Input() size = 20;

  @Input() totalElements = 0;
  @Input() totalPages = 0;

  @Input() sortField = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';

  @Input() emptyTitle = 'Sin registros';
  @Input() emptyMessage = 'Cuando existan datos, aparecerán en esta tabla.';
  @Input() emptyAction = '';

  /**
   * Permite habilitar o deshabilitar el clic sobre las filas.
   */
  @Input() rowClickable = false;

  /**
   * Campo principal mostrado en la cabecera móvil.
   * Si no se especifica, se utiliza la primera columna.
   */
  @Input() mobileTitleKey = '';

  /**
   * Campo secundario mostrado en la cabecera móvil.
   * Si no se especifica, se utiliza la segunda columna.
   */
  @Input() mobileSubtitleKey = '';

  @Output() sortChange = new EventEmitter<{
    key: string;
    direction: 'asc' | 'desc'
  }>();

  @Output() pageChange = new EventEmitter<number>();
  @Output() sizeChange = new EventEmitter<number>();
  @Output() rowClick = new EventEmitter<unknown>();
  @Output() retry = new EventEmitter<void>();
  @Output() empty = new EventEmitter<void>();

  @ContentChild('rowActions')
  actions?: TemplateRef<{ $implicit: unknown }>;

  /**
   * Identificador del registro actualmente expandido.
   */
  expandedKey: string | null = null;

  /**
   * Obtiene el valor de una propiedad, incluso si es anidada.
   */
  cell(row: unknown, key: string): unknown {
    return readPath(row, key);
  }

  /**
   * Convierte un valor a texto legible.
   */
  text(row: unknown, key: string): string {
    return displayText(this.cell(row, key));
  }

  /**
   * Evalúa valores booleanos.
   */
  truthy(row: unknown, key: string): boolean {
    return Boolean(this.cell(row, key));
  }

  /**
   * Determina la clase visual de una etiqueta.
   */
  badgeClass(row: unknown, column: ColumnDef): string {
    const raw = String(this.cell(row, column.key) ?? '');
    return `badge-${column.badge?.[raw] ?? 'neutral'}`;
  }

  /**
   * Ordenamiento de columnas.
   */
  sort(column: ColumnDef): void {
    if (!column.sortable) return;

    const key = column.sortKey ?? column.key;

    const direction =
      this.sortField === key && this.sortDirection === 'asc'
        ? 'desc'
        : 'asc';

    this.sortChange.emit({ key, direction });
  }

  /**
   * Estado accesible del ordenamiento.
   */
  aria(column: ColumnDef): string | null {
    const key = column.sortKey ?? column.key;

    if (!column.sortable || this.sortField !== key) {
      return column.sortable ? 'none' : null;
    }

    return this.sortDirection === 'asc'
      ? 'ascending'
      : 'descending';
  }

  /**
   * Indicador visual del ordenamiento.
   */
  mark(column: ColumnDef): string {
    const key = column.sortKey ?? column.key;

    if (this.sortField !== key) return '↕';

    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  /**
   * Expande o contrae una tarjeta móvil.
   * Solo permite una tarjeta abierta a la vez.
   */
  toggleExpanded(row: unknown, index: number): void {
    const key = this.track(index, row);

    this.expandedKey =
      this.expandedKey === key ? null : key;
  }

  /**
   * Comprueba si una tarjeta está expandida.
   */
  isExpanded(row: unknown, index: number): boolean {
    return this.expandedKey === this.track(index, row);
  }

  /**
   * Obtiene el título principal de la tarjeta móvil.
   */
  mobileTitle(row: unknown): string {
    const key =
      this.mobileTitleKey ||
      this.columns[0]?.key;

    return key ? this.text(row, key) : 'Registro';
  }

  /**
   * Obtiene el subtítulo de la tarjeta móvil.
   */
  mobileSubtitle(row: unknown): string {
    const key =
      this.mobileSubtitleKey ||
      this.columns[1]?.key;

    return key ? this.text(row, key) : '';
  }

  /**
   * Identificador estable para los registros.
   */
  track(index: number, row: unknown): string {
    if (
      row &&
      typeof row === 'object' &&
      'id' in row &&
      (row as { id?: string | number }).id != null
    ) {
      return String((row as { id: string | number }).id);
    }

    return String(index);
  }

  /**
   * Identificador para las columnas.
   */
  trackColumn(index: number, column: ColumnDef): string {
    return column.key || String(index);
  }
}
