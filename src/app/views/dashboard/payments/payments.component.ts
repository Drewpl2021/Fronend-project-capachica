import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {abcForms} from "../../../../environments/generals";

@Component({
  selector: 'app-payments',
  standalone: true,
    imports: [CommonModule, RouterOutlet],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {
    public title: string = '';
    abcForms:any;
    constructor() {
    }
    ngOnInit() {
        this.title = 'Configuración'
        this.abcForms = abcForms;
    }

}
