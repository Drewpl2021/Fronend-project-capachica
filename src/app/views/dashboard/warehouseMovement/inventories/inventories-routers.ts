import { Routes } from '@angular/router';
import {InventoriesComponent} from "./inventories.component";
import {InventoriesContainersComponent} from "./containers/inventories-containers-component";

export default [

    {
        path     : '',
        component: InventoriesComponent,
        children: [
            {
                path: '',
                component: InventoriesContainersComponent,
                data: {
                    title: 'category',
                }
            },
        ],
    },
] as Routes;
