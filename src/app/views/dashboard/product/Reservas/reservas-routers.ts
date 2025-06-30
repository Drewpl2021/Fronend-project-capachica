import { Routes } from '@angular/router';
import {ReservasComponent} from "./reservas.component";
import {ReservasContainersComponent} from "./containers/reservas-containers-component";

export default [

    {
        path     : '',
        component: ReservasComponent,
        children: [
            {
                path: '',
                component: ReservasContainersComponent,
                data: {
                    title: 'category',
                }
            },
        ],
    },
] as Routes;
