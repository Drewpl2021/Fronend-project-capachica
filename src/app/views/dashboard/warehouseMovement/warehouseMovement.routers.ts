import {Routes} from '@angular/router';
import {WarehouseMovementComponent} from "./warehouseMovement.component";


export default [
    {
        path: '',
        component: WarehouseMovementComponent,
        children: [
            {path: 'warehouseMovement', loadChildren: () => import('./warehouseMovement/warehouse-routers')},
            {path: 'inventories', loadChildren: () => import('./inventories/inventories-routers')},
            {path: 'kardex', loadChildren: () => import('./kardex/category-routers')},
        ],
    },
] as Routes;
