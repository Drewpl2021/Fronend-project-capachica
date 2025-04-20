import { Routes } from '@angular/router';
import {DocumentTypesComponent} from "./document-types.component";
import {DocumentTypesContainersComponent} from "./containers/document-types-containers-component";

export default [

    {
        path     : '',
        component: DocumentTypesComponent,
        children: [
            {
                path: '',
                component: DocumentTypesContainersComponent,
                data: {
                    title: 'document-types',
                }
            },
        ],
    },
] as Routes;
