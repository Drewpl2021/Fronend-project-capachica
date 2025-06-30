import {Routes} from '@angular/router';
import {SalesComponent} from "./sales.component";


export default [
    {
        path: '',
        component: SalesComponent,
        children: [
            {path: 'payment', loadChildren: () => import('./payment/payment-routers')},
        ],
    },
] as Routes;
