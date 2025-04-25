import {Routes} from '@angular/router';
import {SectionsComponent} from "./sections.component";
import {ModuleContainersComponent} from "./containers/module-containers-component";
import {SectionDetailViewComponent} from "./components/view/section-detail-view.component";
import {SectionDetailEndViewComponent} from "./components/view/section-detail-end-view.component";

export default [

    {
        path: '',
        component: SectionsComponent,
        children: [
            {
                path: '',
                component: ModuleContainersComponent,
                data: {
                    title: 'Modulos'
                }
            },
            {
                path: 'view-sections/:id',
                component: SectionDetailViewComponent,
                data: { title: 'view sections' },
            },
            {
                path: 'view-sections-detail/:id',
                component: SectionDetailEndViewComponent,
                data: { title: 'view sections detail' },
            },
        ],
    },
] as Routes;
