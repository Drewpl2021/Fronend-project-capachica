import { Routes } from '@angular/router';
import {CategoryComponent} from "./category.component";
import {CategoryContainersComponent} from "./containers/category-containers-component";

export default [

    {
        path     : '',
        component: CategoryComponent,
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
