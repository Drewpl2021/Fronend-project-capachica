import { Routes } from '@angular/router';
import {WarrantiesComponent} from "./warranties.component";
import {WarrantiesContainersComponent} from "./containers/warranties-containers-component";

export default [

    {
        path     : '',
        component: WarrantiesComponent,
        children: [
            {
                path: '',
                component: WarrantiesContainersComponent,
                data: {
                    title: 'warrinties',
                }
            },
        ],
    },
] as Routes;
