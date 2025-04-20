import { Routes } from '@angular/router';
import {ProductDynamicsComponent} from "./product-dynamics.component";
import {ProductDynamicsContainersComponent} from "./containers/product-dynamics-containers-component";

export default [

    {
        path     : '',
        component: ProductDynamicsComponent,
        children: [
            {
                path: '',
                component: ProductDynamicsContainersComponent,
                data: {
                    title: 'productDynamics',
                }
            },
        ],
    },

] as Routes;
