import {Routes} from '@angular/router';
import {ProductComponent} from "./product.component";


export default [
    {
        path: '',
        component: ProductComponent,
        children: [
            {path: 'product', loadChildren: () => import('./product/product-routers')},

        ],
    },
] as Routes;
