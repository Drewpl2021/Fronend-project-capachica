import { Routes } from '@angular/router';
import {ProductComponent} from "./product.component";
import {ProductContainersComponent} from "./containers/product-containers-component";

export default [

    {
        path     : '',
        component: ProductComponent,
        children: [
            {
                path: '',
                component: ProductContainersComponent,
                data: {
                    title: 'category',
                }
            },
        ],
    },
] as Routes;
