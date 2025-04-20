import { Routes } from '@angular/router';
import {StoresComponent} from "./stores.component";
import {StoresContainersComponent} from "./containers/stores-containers-component";

export default [

    {
        path     : '',
        component: StoresComponent,
        children: [
            {
                path: '',
                component: StoresContainersComponent,
                data: {
                    title: 'stores',
                }
            },
        ],
    },
] as Routes;
