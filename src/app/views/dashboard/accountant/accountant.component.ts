import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {abcForms} from "../../../../environments/generals";

@Component({
  selector: 'app-cont-asientos',
  standalone: true,
    imports: [CommonModule, RouterOutlet],
  templateUrl: './accountant.component.html',
  styleUrl: './accountant.component.scss'
})
export class AccountantComponent {
    public title: string = '';
    abcForms: any;
    constructor() {
    }
    ngOnInit() {
        this.title = 'Configuración'
        this.abcForms = abcForms;
    }
}
