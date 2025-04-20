import { Routes } from '@angular/router';
import {ContAsientosComponent} from "./type-document.component";
import {TypeDocumentContainersComponent} from "./containers/type-document-containers-component";

export default [

    {
        path     : '',
        component: ContAsientosComponent,
        children: [
            {
                path: '',
                component: TypeDocumentContainersComponent,
                data: {
                    title: 'typeDocument',
                }
            },
        ],
    },
] as Routes;
