import {Routes} from '@angular/router';
import {ReportsComponent} from "./reports.component";


export default [
    {
        path: '',
        component: ReportsComponent,
        children: [
            {path: 'warranties', loadChildren: () => import('./warranties/warranties-routers')},
            {path: 'profitability', loadChildren: () => import('./profitability/profitability-routers')},

        ],
    },
] as Routes;
