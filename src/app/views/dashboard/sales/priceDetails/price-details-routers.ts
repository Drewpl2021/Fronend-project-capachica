import { Routes } from '@angular/router';
import {PriceDetailsComponent} from "./price-details.component";
import {PriceDetailsContainersComponent} from "./containers/price-details-containers-component";

export default [

    {
        path     : '',
        component: PriceDetailsComponent,
        children: [
            {
                path: '',
                component: PriceDetailsContainersComponent,
                data: {
                    title: 'category',
                }
            },
        ],
    },
] as Routes;
