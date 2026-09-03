import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from '../../../../component/footer/footer.component';
import { BannerComponent } from '../../../../component/banner/banner.component';

interface ClassGroup {
    id: string;
    name: string;
    teacher: string;
    schedule: string;
    location: string;
    enrolled: number;
    capacity: number;
}

@Component({
    selector: 'app-classes',
    standalone: true,
    imports: [CommonModule, BannerComponent, FooterComponent],
    templateUrl: './classes.component.html',
    styleUrl: './classes.component.scss'
})
export class ClassesComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router) { }

    modalityName = 'Futsal Sub-15';
    modalityIcon = 'pi pi-circle-fill';
    modalityIconBg = '#EAF1FB';
    modalityIconColor = '#2563A8';

    classes: ClassGroup[] = [
        { id: '1', name: 'Turma A — Manhã', teacher: 'Carlos Souza', schedule: 'Seg/Qua · 08:00 – 09:00', location: 'Quadra 1', enrolled: 18, capacity: 20 },
        { id: '2', name: 'Turma B — Tarde', teacher: 'Ana Martins', schedule: 'Ter/Qui · 14:00 – 15:00', location: 'Quadra 2', enrolled: 15, capacity: 20 },
        { id: '3', name: 'Turma C — Noite', teacher: 'Carlos Souza', schedule: 'Sex · 19:00 – 20:00', location: 'Quadra 1', enrolled: 12, capacity: 20 }
    ];

    ngOnInit(): void {
        // TODO: buscar modalidade e turmas via id da rota (this.route.snapshot.paramMap.get('id'))
    }

    goBack(): void {
        this.router.navigate(['/manage-modalites']);
    }

    openClass(classGroup: ClassGroup): void {

    }
}