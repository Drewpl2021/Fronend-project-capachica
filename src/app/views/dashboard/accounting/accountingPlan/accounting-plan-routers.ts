import { Routes } from '@angular/router';
import {ContAsientosComponent} from "./accounting-plan.component";
import {AccountingPlanComponent} from "./containers/accounting-plan-component";

export default [

    {
        path     : '',
        component: ContAsientosComponent,
        children: [
            {
                path: '',
                component: AccountingPlanComponent,
                data: {
                    title: 'accounting',
                }
            },
        ],
    },
] as Routes;
