import { Routes } from '@angular/router';
import {ServicesComponent} from "./services.component";
import {ServicesContainersComponent} from "./containers/services-containers-component";

export default [

    {
        path     : '',
        component: ServicesComponent,
        children: [
            {
                path: '',
                component: ServicesContainersComponent,
                data: {
                    title: 'services',
                }
            },
        ],
    },
] as Routes;
