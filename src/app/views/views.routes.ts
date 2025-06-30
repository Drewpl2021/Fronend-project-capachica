// @ts-ignore
import { Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";

export default [
    {
        path     : '',
        component: DashboardComponent,
        children: [
            {path: 'sales', loadChildren: () => import('app/views/dashboard/sales/sales.routers')},
            {path: 'setup', loadChildren: () => import('app/views/dashboard/setup/setup.routers')},
            {path: 'product', loadChildren: () => import('app/views/dashboard/product/product.routers')},

        ],
    },
] as Routes;
