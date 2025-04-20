import { Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";

export default [
    {
        path     : '',
        component: DashboardComponent,
        children: [
            {path: 'buys', loadChildren: () => import('app/views/dashboard/buys/buys.routers')},
            {path: 'sales', loadChildren: () => import('app/views/dashboard/sales/sales.routers')},
            {path: 'setup', loadChildren: () => import('app/views/dashboard/setup/setup.routers')},
            {path: 'client', loadChildren: () => import('app/views/dashboard/client/client.routers')},
            {path: 'reports', loadChildren: () => import('app/views/dashboard/reports/reports.routers')},
            {path: 'catalog', loadChildren: () => import('app/views/dashboard/catalog/catalog.routers')},
            {path: 'payments', loadChildren: () => import('app/views/dashboard/payments/payments.routers')},
            {path: 'accountant', loadChildren: () => import('app/views/dashboard/accountant/accountant.routers')},
            {path: 'accounting', loadChildren: () => import('app/views/dashboard/accounting/accounting.routers')},
            {path: 'warehouseMovement', loadChildren: () => import('app/views/dashboard/warehouseMovement/warehouseMovement.routers')},

        ],
    },
] as Routes;
