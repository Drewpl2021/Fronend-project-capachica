import { Routes } from '@angular/router';
import {EntitiesCompanyCComponent} from "./entitiesCompanyC.component";
import {EntitiesCompanyCContainersComponent} from "./containers/entitiesCompanyC-containers-component";

export default [

    {
        path     : '',
        component: EntitiesCompanyCComponent,
        children: [
            {
                path: '',
                component: EntitiesCompanyCContainersComponent,
                data: {
                    title: 'entities',
                }
            },
        ],
    },
] as Routes;
