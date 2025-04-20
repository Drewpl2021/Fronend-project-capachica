import { Routes } from '@angular/router';
import {CompanyComponent} from "./company.component";
import {CompanyContainersComponent} from "./containers/company-containers-component";

export default [

    {
        path     : '',
        component: CompanyComponent,
        children: [
            {
                path: '',
                component: CompanyContainersComponent,
                data: {
                    title: 'company',
                }
            },
        ],
    },
] as Routes;
