import { Routes } from '@angular/router';
import {SalesComponent} from "./sales.component";
import {SalesContainersComponent} from "./containers/sales-containers-component";
import {SalesNewComponent} from "./components/form/sales-new.component";
import {SalesEditComponent} from "./components/form/sales-edit.component";
import {SalesCancelComponent} from "./components/form/sales-cancel.component";

export default [
    {
        path     : '',
        component: SalesComponent,
        children: [
            {
                path: '',
                component: SalesContainersComponent,
                data: {
                    title: 'sales',
                }
            },
            {
                path: 'new-sales',
                component: SalesNewComponent,
                data: { title: 'New Sales' },
            },
            {
                path: 'edit-sales/:id',
                component: SalesEditComponent,
                data: { title: 'Edit Sales' },
            },
            {
                path: 'cancel-sales/:id',
                component: SalesCancelComponent,
                data: { title: 'Cancel Sales' },
            },
        ],
    },
] as Routes;
