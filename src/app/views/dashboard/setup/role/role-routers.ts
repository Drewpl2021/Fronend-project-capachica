import {Routes} from '@angular/router';
import {RoleComponent} from "./role.component";
import {RoleContainersComponent} from "./containers/role-containers-component";

export default [

    {
        path: '',
        component: RoleComponent,
        children: [
            {
                path: '',
                component: RoleContainersComponent,
                data: {
                    title: 'Roles'
                }
            },
        ],
    },
] as Routes;
