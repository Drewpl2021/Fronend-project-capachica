import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeviewModule } from '@treeview/ngx-treeview';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        TreeviewModule.forRoot(),
    ],
    exports: [
        TreeviewModule,
    ],
})
export class SharedModule {

}
