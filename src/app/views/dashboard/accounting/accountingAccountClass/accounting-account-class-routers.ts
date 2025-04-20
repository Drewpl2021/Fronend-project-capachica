import { Routes } from '@angular/router';
import {ContAsientosComponent} from "./accounting-account-class.component";
import {AccountingAccountClassContainersComponent} from "./containers/accounting-account-class-containers-component";
export default [
    {
        path     : '',
        component: ContAsientosComponent,
        children: [
            {
                path: '',
                component: AccountingAccountClassContainersComponent,
                data: {
                    title: 'account',
                }
            },
        ],
    },
] as Routes;
