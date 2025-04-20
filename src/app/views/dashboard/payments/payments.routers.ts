import {Routes} from '@angular/router';
import {PaymentsComponent} from "./payments.component";


export default [
    {
        path: '',
        component: PaymentsComponent,
        children: [
            {path: 'operationTypes', loadChildren: () => import('./operationTypes/operation-type-routers')},
            {path: 'paymentsTypes', loadChildren: () => import('./paymentsTypes/payments-type-routers')},
            {path: 'paymentsMethods', loadChildren: () => import('./paymentsMethods/payments-methods-routers')},
            {path: 'payments', loadChildren: () => import('./payments/payments-routers')},


        ],
    },
] as Routes;
