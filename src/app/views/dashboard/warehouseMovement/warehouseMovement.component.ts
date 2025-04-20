import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {abcForms} from "../../../../environments/generals";

@Component({
  selector: 'app-warehouse-movement',
  standalone: true,
    imports: [CommonModule, RouterOutlet],
  templateUrl: './warehouseMovement.component.html',
  styleUrl: './warehouseMovement.component.scss'
})
export class WarehouseMovementComponent {
    public title: string = '';
    abcForms:any;
    constructor() {
    }
    ngOnInit() {
        this.title = 'Configuración'
        this.abcForms = abcForms;
    }

}
