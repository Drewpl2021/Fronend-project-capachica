import {Routes} from '@angular/router';
import {AccountantComponent} from "./accountant.component";


export default [
    {
        path: '',
        component: AccountantComponent,
        children: [

            {path: 'accountingAccountClass', loadChildren: () => import('./accountingAccountClass/accounting-account-class-routers')},
            {path: 'typeDocument', loadChildren: () => import('./typeDocument/type-document-routers')},
            {path: 'typeAfeectation', loadChildren: () => import('./typeAfeectation/type-afeectation-routers')},
            {path: 'areas', loadChildren: () => import('./areas/areas-routers')},
            {path: 'accoutingPlan', loadChildren: () => import('./accountingPlan/accounting-plan-routers')},
            {path: 'stores', loadChildren: () => import('./stores/stores-routers')},
            {path: 'accountingDynamics', loadChildren: () => import('./accountingDinamic/accountingDynamic-routers')},


        ],
    },
] as Routes;
