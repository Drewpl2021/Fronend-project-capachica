import { Routes } from '@angular/router';
import {AsociacionesComponent} from "./asociaciones.component";
import {AsociacionesContainersComponent} from "./containers/asociaciones-containers-component";

export default [

    {
        path     : '',
        component: AsociacionesComponent,
        children: [
            {
                path: '',
                component: AsociacionesContainersComponent,
                data: {
                    title: 'asociation',
                }
            },
        ],
    },
] as Routes;
