import { Routes } from '@angular/router';
import {EntitiesComponent} from "./entities.component";
import {EntitiesContainersComponent} from "./containers/entities-containers-component";

export default [

    {
        path     : '',
        component: EntitiesComponent,
        children: [
            {
                path: '',
                component: EntitiesContainersComponent,
                data: {
                    title: 'entities',
                }
            },
        ],
    },
] as Routes;
