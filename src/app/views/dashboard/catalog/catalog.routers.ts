import {Routes} from '@angular/router';
import {CatalogComponent} from "./catalog.component";


export default [
    {
        path: '',
        component: CatalogComponent,
        children: [
            {path: 'unit-measurement', loadChildren: () => import('./unit-measurement/unit-measurement-routers')},
            {path: 'category', loadChildren: () => import('./category/category-routers')},
            {path: 'products', loadChildren: () => import('./products/product-routers')},
            {path: 'productDynamic', loadChildren: () => import('./productsDynamic/product-dynamics-routers')},

        ],
    },
] as Routes;
