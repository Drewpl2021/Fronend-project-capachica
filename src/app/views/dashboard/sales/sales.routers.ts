import {Routes} from '@angular/router';
import {SalesComponent} from "./sales.component";


export default [
    {
        path: '',
        component: SalesComponent,
        children: [
            {path: 'sales', loadChildren: () => import('./sales/sales-routers')},
            {path: 'prices', loadChildren: () => import('./prices/prices-routers')},
            {path: 'priceDetails', loadChildren: () => import('./priceDetails/price-details-routers')},
            {path: 'entitiesCompanyC', loadChildren: () => import('./entitiesCompanyC/entitiesCompanyC-routers')},
            {path: 'barCode', loadChildren: () => import('./barCode/barCode-routers')},
        ],
    },
] as Routes;
