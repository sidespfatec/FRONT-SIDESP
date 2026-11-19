import { Component, EventEmitter, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { NewsItem } from '../news.model';

@Component({
    selector: 'app-new-card-news',
    standalone: true,
    imports: [DialogModule, InputTextModule, ButtonModule, SelectButtonModule, DatePickerModule, FormsModule],
    templateUrl: './new-card-news.component.html',
    styleUrl: './new-card-news.component.scss',
})
export class NewCardNewsComponent {
    viewModal: boolean = true;
    title = '';
    description = '';
    imagePreview: string | null = null;

    //Fixa = fica no ar para sempre. Com prazo = tem data para sair.
    periodo: 'FIXA' | 'PRAZO' = 'FIXA';

    //usado quando é FIXA. Vazio = publicar agora.
    publicarEm: Date | null = null;

    //usado quando é PRAZO. O calendário em range devolve [inicio, fim].
    intervalo: Date[] | null = null;

    agora = new Date();

    opcoesPeriodo = [
        { label: 'Fixa', value: 'FIXA' as const },
        { label: 'Com prazo', value: 'PRAZO' as const },
    ];

    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<NewsItem>();

    onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => (this.imagePreview = reader.result as string);
        reader.readAsDataURL(file);
    }

    //o range preenche a posição 0 no primeiro clique e a 1 no segundo
    get temIntervaloCompleto(): boolean {
        return !!this.intervalo && !!this.intervalo[0] && !!this.intervalo[1];
    }

    get podeSalvar(): boolean {
        if (!this.title.trim()) return false;
        if (this.periodo === 'PRAZO' && !this.temIntervaloCompleto) return false;
        return true;
    }

    onSave(): void {
        if (!this.podeSalvar) return;

        const comPrazo = this.periodo === 'PRAZO' && this.intervalo;

        this.save.emit({
            id: Date.now(),
            title: this.title.trim(),
            description: this.description.trim(),
            image: this.imagePreview ?? 'https://placehold.co/800x450?text=Noticia',
            date: comPrazo ? this.intervalo![0] : (this.publicarEm ?? new Date()),
            fim: comPrazo ? this.intervalo![1] : null,
        });

        this.close.emit();
    }
}
