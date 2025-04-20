import {Routes} from '@angular/router';
import {ModuleComponent} from "./module.component";
import {ModuleContainersComponent} from "./containers/module-containers-component";

export default [

    {
        path: '',
        component: ModuleComponent,
        children: [
            {
                path: '',
                component: ModuleContainersComponent,
                data: {
                    title: 'Modulos'
                }
            },
        ],
    },
] as Routes;
