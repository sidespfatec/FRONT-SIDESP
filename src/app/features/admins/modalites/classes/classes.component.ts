import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FooterComponent } from '../../../../component/footer/footer.component';
import { BannerComponent } from '../../../../component/banner/banner.component';
import { NavbarDesktopAdminComponent } from '../../../../component/navbar-desktop-admin/navbar-desktop-admin.component';

export interface ClassGroup {
    id: string;
    name: string;
    teacher: string;
    location: string;
    start: string;
    end: string;
    days: number[];
    enrolled: number;
    capacity: number;
    waiting: number;
}

interface ScheduleCell {
    classGroup: ClassGroup | null;
}

interface ScheduleRow {
    hour: string;
    cells: ScheduleCell[];
}

@Component({
    selector: 'app-classes',
    standalone: true,
    imports: [CommonModule, BannerComponent, FooterComponent, NavbarDesktopAdminComponent, ButtonModule],
    templateUrl: './classes.component.html',
    styleUrl: './classes.component.scss'
})
export class ClassesComponent implements OnInit {

    readonly weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
    readonly dayNames = ['segunda', 'terça', 'quarta', 'quinta', 'sexta'];

    modalityName = 'Futsal Sub-15';
    modalityIcon = 'pi pi-flag';
    modalityIconBg = '#EAF1FB';
    modalityIconColor = '#2563A8';

    classes: ClassGroup[] = [
        {
            id: '1', name: 'Turma A, manhã', teacher: 'Carlos Souza', location: 'Quadra 1',
            start: '08:00', end: '09:00', days: [0, 2], enrolled: 20, capacity: 20, waiting: 8
        },
        {
            id: '2', name: 'Turma B, tarde', teacher: 'Ana Martins', location: 'Quadra 2',
            start: '14:00', end: '15:00', days: [1, 3], enrolled: 15, capacity: 20, waiting: 0
        },
        {
            id: '3', name: 'Turma C, noite', teacher: 'Carlos Souza', location: 'Quadra 1',
            start: '19:00', end: '20:00', days: [4], enrolled: 10, capacity: 20, waiting: 0
        }
    ];

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
    }

    get totalCapacity(): number {
        return this.classes.reduce((soma, t) => soma + t.capacity, 0);
    }

    get totalEnrolled(): number {
        return this.classes.reduce((soma, t) => soma + t.enrolled, 0);
    }

    get totalWaiting(): number {
        return this.classes.reduce((soma, t) => soma + t.waiting, 0);
    }

    get waitingClass(): ClassGroup | undefined {
        return this.classes.find(t => t.waiting > 0);
    }

    get schedule(): ScheduleRow[] {
        const horas = [...new Set(this.classes.map(t => t.start))].sort();
        return horas.map(hora => ({
            hour: hora,
            cells: this.weekDays.map((_, dia) => ({
                classGroup: this.classes.find(t => t.start === hora && t.days.includes(dia)) ?? null
            }))
        }));
    }

    freeSeats(classGroup: ClassGroup): number {
        return classGroup.capacity - classGroup.enrolled;
    }

    isFull(classGroup: ClassGroup): boolean {
        return classGroup.enrolled >= classGroup.capacity;
    }

    shortLabel(classGroup: ClassGroup): string {
        return classGroup.name.split(',')[0];
    }

    whenLabel(classGroup: ClassGroup): string {
        const dias = classGroup.days.map(d => this.dayNames[d]);
        const lista = dias.length > 1
            ? dias.slice(0, -1).join(', ') + ' e ' + dias[dias.length - 1]
            : dias[0];
        const inicio = classGroup.start.replace(':00', 'h').replace(':', 'h');
        const fim = classGroup.end.replace(':00', 'h').replace(':', 'h');
        return `${lista.charAt(0).toUpperCase()}${lista.slice(1)}, das ${inicio} às ${fim}`;
    }

    goBack(): void {
        this.router.navigate(['/manage-modalites']);
    }

    openClass(classGroup: ClassGroup): void {
    }

    newClass(): void {
    }

    takeAttendance(classGroup: ClassGroup): void {
    }

    viewStudents(classGroup: ClassGroup): void {
    }
}
