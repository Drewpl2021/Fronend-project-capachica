import { Routes } from '@angular/router';
import {WarehouseComponent} from "./warehouse.component";
import {WarehouseContainersComponent} from "./containers/warehouse-containers-component";
import {WarehouseNewComponent} from "./components/form/warehouse-new.component";
import {WarehouseEditComponent} from "./components/form/warehouse-edit.component";

export default [

    {
        path     : '',
        component: WarehouseComponent,
        children: [
            {
                path: '',
                component: WarehouseContainersComponent,
                data: {
                    title: 'category',
                }
            },
            {
                path: 'nueva-categoria',
                component: WarehouseNewComponent,
                data: { title: 'Nueva Categoría' },
            },
            {
                path: 'editar-categoria/:id',
                component: WarehouseEditComponent,
                data: { title: 'Editar Venta' },
            },
        ],
    },
] as Routes;
