import {Routes} from '@angular/router';
import {BuysComponent} from "./buys.component";


export default [
    {
        path: '',
        component: BuysComponent,
        children: [
            {path: 'purchases', loadChildren: () => import('./purchases/purchases-routers')},
            {path: 'entitiesCompanyP', loadChildren: () => import('./entitiesCompanyP/entitiesCompanyP-routers')},
        ],
    },
] as Routes;
