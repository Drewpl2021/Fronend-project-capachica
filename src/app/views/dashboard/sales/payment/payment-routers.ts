import { Routes } from '@angular/router';
import {PaymentComponent} from "./payment.component";
import {PaymentContainersComponent} from "./containers/payment-containers-component";

export default [

    {
        path     : '',
        component: PaymentComponent,
        children: [
            {
                path: '',
                component: PaymentContainersComponent,
                data: {
                    title: 'category',
                }
            },
        ],
    },
] as Routes;
