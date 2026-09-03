import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { StepperModule } from 'primeng/stepper';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputMaskModule } from 'primeng/inputmask';
import { SimpleBannerComponent } from '../../../../component/simple-banner/simple-banner.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-registration',
    standalone: true,

    imports: [
        CommonModule, ButtonModule, InputTextModule,
        FormsModule, PasswordModule, StepperModule,
        SelectButtonModule, SimpleBannerComponent, InputMaskModule, RouterLink],

    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

    activeStep: number = 1;
}