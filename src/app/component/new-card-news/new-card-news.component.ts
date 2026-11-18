import { Component, EventEmitter, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { NewNews, NewsDuration, paraIsoCurto } from '../news.model';

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

    duration: NewsDuration = 'FIXA';
    expiresAt: Date | null = null;

    duracoes = [
        { label: 'Fixa', value: 'FIXA' as NewsDuration },
        { label: 'Até uma data', value: 'TEMPORARIA' as NewsDuration },
    ];

    //a data de validade não pode ser no passado
    hoje = new Date();

    @Output() close = new EventEmitter<void>();

    //component para a chamada do filho para o pai. Ele chama o NewsItem dentro do news.model
    @Output() save = new EventEmitter<NewNews>();


    //selecionar um arquivo de dentro da maquina da pessoa.

    onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => (this.imagePreview = reader.result as string);
        reader.readAsDataURL(file);
    }

    //temporária sem data escolhida não pode salvar
    get podeSalvar(): boolean {
        if (!this.title.trim()) return false;
        if (this.duration === 'TEMPORARIA' && !this.expiresAt) return false;
        return true;
    }


    //Função de Salvar

    onSave(): void {

        //Pega os NewNews do news.model e atribui os valores

        this.save.emit({
            title: this.title.trim(), //trim serve para tirar espaços
            description: this.description.trim(),
            image: this.imagePreview ?? 'https://placehold.co/800x450?text=Noticia',
            date: new Date().toISOString(),
            duration: this.duration,
            expiresAt: this.duration === 'TEMPORARIA' && this.expiresAt
                ? paraIsoCurto(this.expiresAt)
                : undefined,
        });
        this.close.emit();
    }
}
