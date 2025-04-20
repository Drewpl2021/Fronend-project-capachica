import { Routes } from '@angular/router';
import {ContAsientosComponent} from "./areas.component";
import {AreasContainersComponent} from "./containers/areas-containers-component";

export default [

    {
        path     : '',
        component: ContAsientosComponent,
        children: [
            {
                path: '',
                component: AreasContainersComponent,
                data: {
                    title: 'account',
                }
            },
        ],
    },
] as Routes;
