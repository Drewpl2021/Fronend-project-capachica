import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {abcForms} from "../../../../environments/generals";

@Component({
  selector: 'app-catalog',
  standalone: true,
    imports: [CommonModule, RouterOutlet],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {
    public title: string = '';
    abcForms:any;
    constructor() {
    }
    ngOnInit() {
        this.title = 'Configuración'
        this.abcForms = abcForms;
    }

}
