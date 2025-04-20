import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PaginationEvent} from "./models/PaginationEvent"; // Asegúrate de importar la interfaz

@Component({
    standalone: true,
    selector: 'pagination-controls',
    templateUrl: './pagination-controls.component.html',
    styleUrls: ['./pagination-controls.component.scss'],
    imports: [CommonModule]
})
export class PaginationControlsComponent implements OnInit, OnChanges {
    @Input() totalItems: number = 0;
    @Input() itemsPerPage: number = 10;
    @Input() currentPage: number = 0;
    @Output() paginationChange: EventEmitter<PaginationEvent> = new EventEmitter<PaginationEvent>();

    totalPages: number = 0;

    ngOnInit() {
        this.paginationChange.emit({page: this.currentPage, size: this.itemsPerPage});
    }

    ngOnChanges(): void {
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    }

    onPageChange(page: number): void {
        if (page >= 0 && page < this.totalPages) {
            this.paginationChange.emit({page, size: this.itemsPerPage});
        }
    }

    onPageSizeChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        this.itemsPerPage = +select.value;
        this.paginationChange.emit({page: 0, size: this.itemsPerPage});
    }

    isFirstPage(): boolean {
        return this.currentPage === 0;
    }

    isLastPage(): boolean {
        return this.currentPage === this.totalPages - 1;
    }
}
