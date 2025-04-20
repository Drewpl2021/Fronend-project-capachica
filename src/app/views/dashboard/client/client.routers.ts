import {Routes} from '@angular/router';
import {ClientComponent} from "./client.component";


export default [
    {
        path: '',
        component: ClientComponent,
        children: [
            {path: 'documentTypes', loadChildren: () => import('./documentTypes/document-types-routers')},
            {path: 'entityTypes', loadChildren: () => import('./entityTypes/entity-types-routers')},
            {path: 'services', loadChildren: () => import('./services/services-routers')},
            {path: 'entities', loadChildren: () => import('./entities/entities-routers')},
        ],
    },
] as Routes;
