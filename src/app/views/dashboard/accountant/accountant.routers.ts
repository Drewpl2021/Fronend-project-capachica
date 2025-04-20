import {Routes} from '@angular/router';
import {AccountantComponent} from "./accountant.component";

export default [
    {
        path: '',
        component: AccountantComponent,
        children: [
            {path: 'cont-asientos', loadChildren: () => import('./cont-asientos/cont-asientos-routers')},
        ],
    },
] as Routes;
