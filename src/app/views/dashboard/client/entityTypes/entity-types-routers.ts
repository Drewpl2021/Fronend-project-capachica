import { Routes } from '@angular/router';
import {EntityTypesComponent} from "./entity-types.component";
import {EntityTypesContainersComponent} from "./containers/entity-types-containers-component";

export default [

    {
        path     : '',
        component: EntityTypesComponent,
        children: [
            {
                path: '',
                component: EntityTypesContainersComponent,
                data: {
                    title: 'entityTypes',
                }
            },
        ],
    },
] as Routes;
