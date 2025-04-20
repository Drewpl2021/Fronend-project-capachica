import {CommonModule, JsonPipe, NgIf} from '@angular/common';
import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {FuseFullscreenComponent} from '@fuse/components/fullscreen';
import {FuseLoadingBarComponent} from '@fuse/components/loading-bar';
import {FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent,} from '@fuse/components/navigation';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {User} from 'app/core/user/user.types';
//import {LanguagesComponent} from 'app/layout/common/languages/languages.component';
import {MessagesComponent} from 'app/layout/common/messages/messages.component';
import {NotificationsComponent} from 'app/layout/common/notifications/notifications.component';
import {QuickChatComponent} from 'app/layout/common/quick-chat/quick-chat.component';
import {SearchComponent} from 'app/layout/common/search/search.component';
import {ShortcutsComponent} from 'app/layout/common/shortcuts/shortcuts.component';
import {UserComponent} from 'app/layout/common/user/user.component';
import {Subject, Subscription} from 'rxjs';
import {MenuAcceso} from './menu_accesos';
import {jwtDecode} from 'jwt-decode';
import {ModuleService} from "../../../../providers/services/setup/module.service";
import {SerialFlowsService} from "../../../../providers/services/catalog/serial-flows.service";
import {SerialFlows} from "../../../../views/dashboard/sales/sales/models/sales";
import {Company} from "../../../../views/dashboard/setup/listCompany/models/company";
import {CompanyUserAdminService} from "../../../../providers/services/setup/company-user-admin.service";
import {
    CompanyListComponent
} from "../../../../views/dashboard/setup/listCompany/components/list/company-list.component";
import {CompanyUserService} from "../../../../providers/services/setup/company-user.service";
import {EventService} from "../../../../providers/utils/event-service";

@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        FuseLoadingBarComponent,
        FuseVerticalNavigationComponent,
        NotificationsComponent,
        UserComponent,
        NgIf,
        MatIconModule,
        MatButtonModule,
        FuseFullscreenComponent,
        SearchComponent,
        ShortcutsComponent,
        MessagesComponent,
        RouterOutlet,
        QuickChatComponent,
        JsonPipe,
        CommonModule,
        CompanyListComponent,
    ],
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: FuseNavigationItem[];
    menu: MenuAcceso[];
    tokenValue: any;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private;
    companies: Company[] = [];
    public validLogoUrl: string = '';
    private eventSubscription: Subscription;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _moduleService: ModuleService,
        private _companyUserAdminService: CompanyUserAdminService,
        private _companyUserService: CompanyUserService,
        private _eventService: EventService
    ) {

    }

    ngOnInit(): void {
        this.eventSubscription = this._eventService.event$.subscribe((data) => {
            if (data) {
                this.uploadData();
            }
        });
        this.showmenu();
        this.tokenValue = jwtDecode(localStorage.getItem("accessToken"));
        this.uploadData();
        this.uploadImage();

        this.user = {
            id: 'cfaad35d-07a3-4447-a6c3-d8c3d54fd5df',
            name: 'Brian Hughes',
            email: 'hughes.brian@company.com',
            avatar: 'assets/images/avatars/brian-hughes.jpg',
            status: 'online',
        };
    }

    private uploadData() {
        this._companyUserAdminService.getAllsAccesTocken$().subscribe((data) => {
            this.companies = data?.content ? data.content : [data];
           // setTimeout(() => this.uploadData(), 1000);
        });

    }
    private uploadImage() {

        this._companyUserService.getAllToken$().subscribe((data) => {
            this.companies = Array.isArray(data) ? data : [data];


            if (this.companies.length > 0 && this.companies[0]?.company?.logo) {
                this.validateAndSetLogoUrl(this.companies[0].company.logo);
            } else {
                console.warn('No se encontró la URL del logo.');
                this.validLogoUrl = ''; // Evita mostrar imágenes rotas
            }
        });
    }

    public validateAndSetLogoUrl(url: string): void {
        if (url && url.startsWith('http')) {
            this.validLogoUrl = url;
        } else {
            this.validLogoUrl = ''; // No mostrar imagen si no es una URL válida
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------


    /**
     * On destroy
     */
    showmenu(): void {
        this._moduleService.getMenu$().subscribe(response => {
            this.navigation = response;
            //console.log(this.navigation)
        });
    }


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this.eventSubscription.unsubscribe(); // Evita fugas de memoria

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
