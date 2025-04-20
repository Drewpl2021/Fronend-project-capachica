import { Component, OnInit } from '@angular/core';
import {abcForms} from "../../../../../environments/generals";
import {RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import { TreeviewModule } from '@treeview/ngx-treeview';

@Component({
    standalone: true,
    selector: 'app-areas',
    imports: [CommonModule, RouterOutlet, TreeviewModule],
    template: `
      <div class="card shadow-gm-card m-1 w-full flex-none">
          <h1 class="fa-3x icon-gm-float">
              <i class="{{ abcForms.btnUser.icon }}"></i>
          </h1>
          <div class="card-body">
              <router-outlet></router-outlet>
          </div>
      </div>
  `,
})
export class ContAsientosComponent implements OnInit {
  abcForms:any;
  public title: string='';
  constructor() { }

  ngOnInit() {
    this.title = 'Clase de Cuentas Contables';
    this.abcForms = abcForms;
  }

}
