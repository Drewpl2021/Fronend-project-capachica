import { Routes } from '@angular/router';
import {PurchasesComponent} from "./purchases.component";
import {PurchasesContainersComponent} from "./containers/purchases-containers-component";
import {PurchasesNewComponent} from "./components/form/purchases-new.component";
import {PurchasesEditComponent} from "./components/form/purchases-edit.component";

export default [

    {
        path     : '',
        component: PurchasesComponent,
        children: [
            {
                path: '',
                component: PurchasesContainersComponent,
                data: {
                    title: 'Purchases',
                }
            },
            {
                path: 'new-puchases',
                component: PurchasesNewComponent,
                data: { title: 'New Purchases' },
            },
            {
                path: 'edit-purchases/:id',
                component: PurchasesEditComponent,
                data: { title: 'Edit Purchases' },
            },
        ],
    },
] as Routes;
