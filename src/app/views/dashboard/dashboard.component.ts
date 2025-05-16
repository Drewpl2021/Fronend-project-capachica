import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterOutlet} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {abcForms} from "../../../environments/generals";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {FuseConfirmationService} from "../../../@fuse/services/confirmation";
import {UnitMeasurent} from "./catalog/products/models/product";
import {UnitMeasurementService} from "../../providers/services/catalog/unit-measurement.service";
import {TypeDocument} from "./accounting/typeDocument/models/type-document";
import {TypeDocumentService} from "../../providers/services/accounting/type-document.service";
import {TypeAffectationService} from "../../providers/services/accounting/type-afectation.service";
import {TypeAffectation} from "./accounting/typeAfeectation/models/type-affectation";
import {AreaService} from "../../providers/services/accounting/area.service";
import {Areas} from "./accounting/areas/models/areas";
import {AccountingAccountClassService} from "../../providers/services/accounting/accounting-account-class.service";
import {accountingAccountClass} from "./accounting/accountingAccountClass/models/accounting-account-class";
import {Stores} from "./accounting/stores/models/stores";
import {StoresService} from "../../providers/services/accounting/stores.service";
import {AccoutingPlanService} from "../../providers/services/accounting/accounting-plan.service";
import {AccountingPlan} from "./accounting/accountingPlan/models/accounting-plan";
import {accountingDynamic} from "./accounting/accountingDinamic/models/accountingDynamic";
import {AccountingDynamicsService} from "../../providers/services/accounting/accounting-dinamic.service";


@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterOutlet, MatIconModule, MatButtonModule,FormsModule, CommonModule],
    templateUrl: './dashboard.component.html',
      styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
    public title: string = '';
    public units: UnitMeasurent[] = [];
    public type_document: TypeDocument[] = [];
    public type_affectation: TypeAffectation[] = [];
    public areas: Areas[] = [];
    public accountes: accountingAccountClass[] = [];
    public stores: Stores[] = [];
    public accountingPlan: AccountingPlan[] = [];
    public dynamics: accountingDynamic[] = [];
    public countdown: number = 2;
    public buttonDisabled: boolean = true;
    public name = '';
    public showArrow: boolean = false;
    public showIntro: boolean = true;
    public totalSteps: number = 10;
    public currentStep: number = 1;
    public configForm: UntypedFormGroup;
    public abcForms:any;
    private companyId: string = "default-company";

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _unitService: UnitMeasurementService,
        private _documentService: TypeDocumentService,
        private _affectationService: TypeAffectationService,
        private _areaService: AreaService,
        private _accountService: AccountingAccountClassService,
        private _storeService: StoresService,
        private _accountingPlanService: AccoutingPlanService,
        private _accountingDynamicService: AccountingDynamicsService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.title = 'Dashboard';
        this.abcForms = abcForms;

        this.startCountdown();
        this.checkFirstTime();

    }

    configConfirm(){
        this.configForm = this._formBuilder.group({
            title      : 'Eliminar nodo',
            message    : `
                ¿Estás seguro de que deseas eliminar este nodo permanentemente?
            `,
            icon       : this._formBuilder.group({
                show : true,
                name : 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            }),
            actions    : this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show : true,
                    label: 'Eliminar',
                    color: 'warn',
                }),
                cancel : this._formBuilder.group({
                    show : true,
                    label: 'Cancelar',
                }),
            }),
            dismissible: true,
        });
    }

    private uploadUnits() {
        this._unitService.getWithQuery$().subscribe((data) => {
            this.units = data?.content || [];
        });
    }
    private uploadTypeDocument() {
        this._documentService.getWithSearch$().subscribe((data) => {
            this.type_document = data?.content || [];
        });
    }
    private uploadTypeAfectation() {
        this._affectationService.getWithSearch$().subscribe((data) => {
            this.type_affectation = data?.content || [];
        });
    }
    private uploadAreas() {
        this._areaService.getTree$().subscribe((data) => {
            this.areas = data?.content || [];
        });
    }
    private uploadClassAcount() {
        this._accountService.getWithSearch$().subscribe((data) => {
            this.accountes = data?.content || [];
        });
    }
    private uploadStore() {
        this._storeService.getWithQuery$().subscribe((data) => {
            this.stores = data?.content || [];
        });
    }
    private uploadAccountingPlan() {
        this._accountingPlanService.getTree$().subscribe((data) => {
            this.accountingPlan = data?.content || [];
        });
    }
    private uploadDinamicAcounting() {
        this._accountingDynamicService.getWithQuery$().subscribe((data) => {
            this.dynamics = data?.content || [];
        });
        this.router.navigate(['/homeScreen/catalog/category/']); // Redirigir a la ruta especificada

    }
    dialog(){
        this.configConfirm();
        const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

        // Confirm delete node
        dialogRef.afterClosed().subscribe((result) =>
        {
            if ("confirmed" == result) {
                alert("no confirmado");
            }
            // this.deleteNode(node);
        });
    }
    nextStep(): void {
        if (this.currentStep === 2) {
            this.uploadUnits();
        }
        if (this.currentStep === 3) {
            this.uploadTypeDocument();
        }
        if (this.currentStep === 4) {
            this.uploadTypeAfectation();
        }
        if (this.currentStep === 5) {
            this.uploadAreas();
        }
        if (this.currentStep === 6) {
            this.uploadClassAcount();
        }
        if (this.currentStep === 7) {
            this.uploadStore();
        }
        if (this.currentStep === 8) {
            this.uploadAccountingPlan();
        }
        if (this.currentStep === 9) {
            this.uploadDinamicAcounting();
        }

        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.startCountdown();

        } else {
            this.showIntro = false;
            this.showArrow = true;
        }
    }
    startCountdown(): void {
        this.buttonDisabled = true;
        this.countdown = 2;
        const interval = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(interval);
                this.buttonDisabled = false;
            }
        }, 1000);
    }
    hideArrow(): void {
        this.showArrow = false;
        localStorage.setItem(`firstTime_${this.companyId}_arrow`, "true"); // 🔥 Guarda que la flecha fue ocultada
    }

    private checkFirstTime(): void {
        const storedData = localStorage.getItem(`firstTime_${this.companyId}`);
        const arrowHidden = localStorage.getItem(`firstTime_${this.companyId}_arrow`);

        if (storedData) {
            this.showIntro = false;
            this.showArrow = arrowHidden ? false : true; // 🔥 Si la flecha ya se ocultó antes, no mostrarla
        } else {
            this.showIntro = true;
            this.showArrow = false; // 🔥 La flecha no aparece hasta terminar la guía
            localStorage.setItem(`firstTime_${this.companyId}`, "true");
        }
    }


}
