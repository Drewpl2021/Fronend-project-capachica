import { Routes } from '@angular/router';
import {PaymentsTypeComponent} from "./payments-type.component";
import {PaymentsTypeContainersComponent} from "./containers/payments-type-containers-component";

export default [

    {
        path     : '',
        component: PaymentsTypeComponent,
        children: [
            {
                path: '',
                component: PaymentsTypeContainersComponent,
                data: {
                    title: 'payment-type',
                }
            },
        ],
    },
] as Routes;
