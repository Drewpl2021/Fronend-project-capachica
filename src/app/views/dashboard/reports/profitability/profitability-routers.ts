import { Routes } from '@angular/router';
import {ProfitabilityComponent} from "./profitability.component";
import {ProfitabilityContainersComponent} from "./containers/profitability-containers-component";

export default [

    {
        path     : '',
        component: ProfitabilityComponent,
        children: [
            {
                path: '',
                component: ProfitabilityContainersComponent,
                data: {
                    title: 'category',
                }
            },
        ],
    },
] as Routes;
