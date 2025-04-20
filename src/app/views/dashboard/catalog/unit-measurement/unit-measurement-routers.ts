import { Routes } from '@angular/router';
import {UnitMeasurementComponent} from "./unit-measurement.component";
import {UnitMeasurementContainersComponent} from "./containers/unit-measurement-containers-component";

export default [

    {
        path     : '',
        component: UnitMeasurementComponent,
        children: [
            {
                path: '',
                component: UnitMeasurementContainersComponent,
                data: {
                    title: 'unit-measurement'
                }
            },
        ],
    },
] as Routes;
