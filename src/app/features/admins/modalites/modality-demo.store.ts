import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

export interface Modality {
    id: string;
    name: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    classesCount: number;
    studentsCount: number;
    active: boolean;
    minAge?: number;
    maxAge?: number;
    monthlyAbsenceLimit?: number;
    hubId?: string;
    hubName?: string;
}

export interface HubOption {
    id: string;
    name: string;
}

export interface NewModality {
    name: string;
    minAge: number;
    maxAge: number;
    monthlyAbsenceLimit: number;
    hubId: string;
    icon: string;
}

const ORIGINAL_MODALITIES: Modality[] = [
    { id: '1', name: 'Futsal Sub-15', icon: 'pi pi-circle-fill', iconBg: '#EAF1FB', iconColor: '#2563A8', classesCount: 3, studentsCount: 45, active: true },
    { id: '2', name: 'Natação Adulto', icon: 'pi pi-circle-fill', iconBg: '#E1F5EE', iconColor: '#0F7A4E', classesCount: 2, studentsCount: 43, active: true },
    { id: '3', name: 'Vôlei', icon: 'pi pi-circle-fill', iconBg: '#FAEEDA', iconColor: '#8A5A00', classesCount: 2, studentsCount: 31, active: true },
    { id: '4', name: 'Ginástica', icon: 'pi pi-circle-fill', iconBg: '#F1EFEC', iconColor: '#6B6558', classesCount: 2, studentsCount: 30, active: false },
    { id: '5', name: 'Tênis', icon: 'pi pi-circle-fill', iconBg: '#FAEEDA', iconColor: '#8A5A00', classesCount: 2, studentsCount: 31, active: true },
    { id: '6', name: 'Basquete', icon: 'pi pi-circle-fill', iconBg: '#FAEEDA', iconColor: '#8A5A00', classesCount: 2, studentsCount: 31, active: false },
    { id: '7', name: 'Xadrez', icon: 'pi pi-circle-fill', iconBg: '#FAEEDA', iconColor: '#8A5A00', classesCount: 2, studentsCount: 31, active: true }
];

@Injectable({ providedIn: 'root' })
export class ModalityDemoStore {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly storageKey = 'sidesp_issue21_demo_safe_v1';

    readonly hubs: HubOption[] = [
        { id: '1', name: 'Sede (Centro)' },
        { id: '2', name: 'Polo Pedregulho' },
        { id: '3', name: 'Polo Campo do Galvão' }
    ];

    list(): Modality[] {
        if (!isPlatformBrowser(this.platformId)) {
            return ORIGINAL_MODALITIES.map(item => ({ ...item }));
        }
        try {
            const json = localStorage.getItem(this.storageKey);
            if (json !== null) {
                const items: unknown = JSON.parse(json);
                if (Array.isArray(items)) return items as Modality[];
            }
        } catch {
            return ORIGINAL_MODALITIES.map(item => ({ ...item }));
        }
        return ORIGINAL_MODALITIES.map(item => ({ ...item }));
    }

    create(input: NewModality): void {
        const name = input.name.trim();
        if (!name) throw new Error('Informe o nome da modalidade.');
        if (![input.minAge, input.maxAge, input.monthlyAbsenceLimit].every(Number.isInteger)) {
            throw new Error('As idades e o limite de faltas devem ser números inteiros.');
        }
        if (input.minAge < 0 || input.maxAge > 120 || input.maxAge < input.minAge) {
            throw new Error('Confira a faixa etária informada.');
        }
        if (input.monthlyAbsenceLimit < 0 || input.monthlyAbsenceLimit > 31) {
            throw new Error('Informe um limite de 0 a 31 faltas mensais.');
        }
        const hub = this.hubs.find(item => item.id === input.hubId);
        if (!hub) throw new Error('Escolha um polo válido.');
        const items = this.list();
        if (items.some(item => item.name.toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR'))) {
            throw new Error('Já existe uma modalidade com esse nome.');
        }
        items.push({
            ...input,
            id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name,
            hubName: hub.name,
            iconBg: '#EAF1FB',
            iconColor: '#2563A8',
            classesCount: 0,
            studentsCount: 0,
            active: true
        });
        this.persist(items);
    }

    setActive(id: string, active: boolean): void {
        const items = this.list();
        const target = items.find(item => item.id === id);
        if (!target) throw new Error('Modalidade não encontrada.');
        target.active = active;
        this.persist(items);
    }

    remove(id: string): void {
        const items = this.list();
        const target = items.find(item => item.id === id);
        if (!target) throw new Error('Modalidade não encontrada.');
        if (target.classesCount > 0) {
            throw new Error('Não é possível excluir uma modalidade que possui turmas.');
        }
        this.persist(items.filter(item => item.id !== id));
    }

    private persist(items: Modality[]): void {
        if (!isPlatformBrowser(this.platformId)) {
            throw new Error('O cadastro de demonstração só funciona no navegador.');
        }
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(items));
        } catch {
            throw new Error('Não foi possível salvar os dados neste navegador.');
        }
    }
}