import { Routes } from '@angular/router';
import {PaymentsMethodsComponent} from "./payments-methods.component";
import {PaymentsMethodsContainersComponent} from "./containers/payments-methods-containers-component";

export default [

    {
        path     : '',
        component: PaymentsMethodsComponent,
        children: [
            {
                path: '',
                component: PaymentsMethodsContainersComponent,
                data: {
                    title: 'payments-methods',
                }
            },
        ],
    },
] as Routes;
