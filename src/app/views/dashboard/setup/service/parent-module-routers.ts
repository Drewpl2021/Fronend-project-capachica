import { Routes } from '@angular/router';
import {ParentModuleComponent} from "./parent-module.component";
import {ParentModuleContainersComponent} from "./containers/parent-module-containers-component";

export default [

    {
        path     : '',
        component: ParentModuleComponent,
        children: [
            {
                path: '',
                component: ParentModuleContainersComponent,
                data: {
                    title: 'Módulo Padre'
                }
            },
        ],
    },
] as Routes;
