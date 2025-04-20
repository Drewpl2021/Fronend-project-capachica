import { Routes } from '@angular/router';
import {UsersContainerComponent} from "./containers/users-company-containers-component";
import {UsersCompanyComponent} from "./users-company.component";

export default [

    {
        path     : '',
        component: UsersCompanyComponent,
        children: [
            {
                path: '',
                component: UsersContainerComponent,
                data: {
                    title: 'Users Company',
                }
            },
        ],
    },
] as Routes;
