import { Routes } from '@angular/router';
import {PricesComponent} from "./prices.component";
import {PricesContainersComponent} from "./containers/prices-containers-component";

export default [

    {
        path     : '',
        component: PricesComponent,
        children: [
            {
                path: '',
                component: PricesContainersComponent,
                data: {
                    title: 'category',
                }
            },
        ],
    },
] as Routes;
