import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {abcForms} from "../../../../environments/generals";

@Component({
  selector: 'app-sales',
  standalone: true,
    imports: [CommonModule, RouterOutlet],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent {
    public title: string = '';
    abcForms:any;
    constructor() {
    }
    ngOnInit() {
        this.title = 'Configuración'
        this.abcForms = abcForms;
    }

}
