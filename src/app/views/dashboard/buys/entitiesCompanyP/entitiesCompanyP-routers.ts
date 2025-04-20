import { Routes } from '@angular/router';
import {EntitiesCompanyPComponent} from "./entitiesCompanyP.component";
import {EntitiesCompanyPContainersComponent} from "./containers/entitiesCompanyP-containers-component";

export default [

    {
        path     : '',
        component: EntitiesCompanyPComponent,
        children: [
            {
                path: '',
                component: EntitiesCompanyPContainersComponent,
                data: {
                    title: 'entities',
                }
            },
        ],
    },
] as Routes;
