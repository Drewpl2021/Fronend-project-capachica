import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterOutlet} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {abcForms} from "../../../environments/generals";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {FuseConfirmationService} from "../../../@fuse/services/confirmation";



@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterOutlet, MatIconModule, MatButtonModule,FormsModule, CommonModule],
    templateUrl: './dashboard.component.html',
      styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
    public title: string = '';
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

        private router: Router,
    ) {}

    ngOnInit() {
        this.title = 'Dashboard';
        this.abcForms = abcForms;

        this.startCountdown();
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


}
