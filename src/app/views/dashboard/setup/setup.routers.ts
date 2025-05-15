import { Routes } from '@angular/router';
import {SetupComponent} from "./setup.component";


export default [
    {
        path     : '',
        component: SetupComponent,
        children: [


            {path: 'role', loadChildren: () => import('./role/role-routers')},
            {path: 'users', loadChildren: () => import('./user/users-routers')},
            {path: 'user', loadChildren: () => import('./user/users-routers')},
            {path: 'user-company', loadChildren: () => import('./userCompany/users-company-routers')},
            {path: 'parent-module', loadChildren: () => import('./parentModule/parent-module-routers')},
            {path: 'module', loadChildren: () => import('./module/module-routers')},
            {path: 'company', loadChildren: () => import('./company/company-routers')},
            {path: 'municipalidad', loadChildren: () => import('./municipalidad/municipalidad-routers')},
            {path: 'listCompany', loadChildren: () => import('./listCompany/company-routers')},
            {path: 'municipalidad', loadChildren: () => import('./municipalidad/municipalidad-routers')},
            {path: 'sections', loadChildren: () => import('./sections/sections-routers')},
            {path: 'service', loadChildren: () => import('./service/parent-module-routers')},
            {path: 'asociaciones', loadChildren: () => import('./asociaciones/asociaciones-routers')},


        ],
    },
] as Routes;
