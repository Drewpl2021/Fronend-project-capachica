import { Routes } from '@angular/router';
import {ContAsientosComponent} from "./type-afeectation.component";
import {TypeAffectationContainersComponent} from "./containers/type-affectation-containers-component";

export default [

    {
        path     : '',
        component: ContAsientosComponent,
        children: [
            {
                path: '',
                component: TypeAffectationContainersComponent,
                data: {
                    title: 'type_afeectation',
                }
            },
        ],
    },
] as Routes;
