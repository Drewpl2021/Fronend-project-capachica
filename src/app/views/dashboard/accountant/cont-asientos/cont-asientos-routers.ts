import { Routes } from '@angular/router';
import {ContAsientosComponent} from "./cont-asientos.component";
import {CategoryContainersComponent} from "./containers/category-containers-component";

export default [
    {
        path     : '',
        component: ContAsientosComponent,
        children: [
            {
                path: '',
                component: CategoryContainersComponent,
                data: {
                    title: 'category',
                }
            },
        ],
    },
] as Routes;
