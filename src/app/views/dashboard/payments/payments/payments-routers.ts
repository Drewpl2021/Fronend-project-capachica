import { Routes } from '@angular/router';
import {PaymentsComponent} from "./payments.component";
import {PaymentsContainersComponent} from "./containers/payments-containers-component";

export default [

    {
        path     : '',
        component: PaymentsComponent,
        children: [
            {
                path: '',
                component: PaymentsContainersComponent,
                data: {
                    title: 'payments',
                }
            },
        ],
    },
] as Routes;
