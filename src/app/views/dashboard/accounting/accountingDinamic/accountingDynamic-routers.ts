import { Routes } from '@angular/router';
import {AccountingDynamicComponent} from "./accountingDynamic.component";
import {AccountingDynamicContainersComponent} from "./containers/accountingDynamic-containers-component";

export default [

    {
        path     : '',
        component: AccountingDynamicComponent,
        children: [
            {
                path: '',
                component: AccountingDynamicContainersComponent,
                data: {
                    title: 'accountingDinamic',
                }
            },
        ],
    },
] as Routes;
