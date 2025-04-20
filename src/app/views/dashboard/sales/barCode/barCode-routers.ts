
import { Routes } from '@angular/router';
import {BarCodeComponent} from "./barCode.component";
import {BarCodeContainersComponent} from "./containers/barCode-containers-component";

export default [

    {
        path     : '',
        component: BarCodeComponent,
        children: [
            {
                path: '',
                component: BarCodeContainersComponent,
                data: {
                    title: 'product',
                }
            },
        ],
    },
] as Routes;
