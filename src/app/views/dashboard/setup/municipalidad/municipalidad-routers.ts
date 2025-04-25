import {Routes} from '@angular/router';
import {MunicipalidadComponent} from "./municipalidad.component";
import {ModuleContainersComponent} from "./containers/module-containers-component";

export default [

    {
        path: '',
        component: MunicipalidadComponent,
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
