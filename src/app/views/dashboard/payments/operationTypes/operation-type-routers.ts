import { Routes } from '@angular/router';
import {OperationTypeComponent} from "./operation-type.component";
import {OperationTypeContainersComponent} from "./containers/operation-type-containers-component";

export default [

    {
        path     : '',
        component: OperationTypeComponent,
        children: [
            {
                path: '',
                component: OperationTypeContainersComponent,
                data: {
                    title: 'operation-type',
                }
            },
        ],
    },
] as Routes;
