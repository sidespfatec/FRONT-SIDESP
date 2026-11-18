import { Component, EventEmitter, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import {
    IMAGEM_TAMANHO_MAX, IMAGEM_TIPOS, NoticiaParaEnviar, TITULO_MAX, paraDataHoraLocal
} from '../news.model';

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
    tituloMax = TITULO_MAX;

    //a prévia é para a tela; o arquivo é o que vai para a API
    imagePreview: string | null = null;
    imagemArquivo: File | null = null;
    erroImagem = '';

    //o back olha a dataPublicacao: futura = EM ESPERA, passada = PUBLICADA
    quando: 'AGORA' | 'AGENDAR' = 'AGORA';
    dataAgendada: Date | null = null;
    agora = new Date();

    opcoesQuando = [
        { label: 'Publicar agora', value: 'AGORA' as const },
        { label: 'Agendar', value: 'AGENDAR' as const },
    ];

    @Output() close = new EventEmitter<void>();

    //component para a chamada do filho para o pai. Ele chama o NewsItem dentro do news.model
    @Output() save = new EventEmitter<NoticiaParaEnviar>();


    //selecionar um arquivo de dentro da maquina da pessoa.

    onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        this.erroImagem = '';

        //as mesmas regras do NoticiaStorageService, para o erro aparecer
        //aqui em vez de voltar 400 do servidor
        if (!IMAGEM_TIPOS.includes(file.type)) {
            this.erroImagem = 'A imagem precisa ser JPG, PNG ou WEBP.';
            return;
        }

        if (file.size > IMAGEM_TAMANHO_MAX) {
            this.erroImagem = 'A imagem passa de 10 MB.';
            return;
        }

        this.imagemArquivo = file;

        const reader = new FileReader();
        reader.onload = () => (this.imagePreview = reader.result as string);
        reader.readAsDataURL(file);
    }

    //a imagem é obrigatória no back: @RequestPart("imagem") sem required=false
    get podeSalvar(): boolean {
        if (!this.title.trim() || !this.description.trim()) return false;
        if (!this.imagemArquivo) return false;
        if (this.quando === 'AGENDAR' && !this.dataAgendada) return false;
        return true;
    }


    //Função de Salvar

    onSave(): void {
        if (!this.podeSalvar || !this.imagemArquivo) return;

        const data = this.quando === 'AGENDAR' && this.dataAgendada
            ? this.dataAgendada
            : new Date();

        this.save.emit({
            dados: {
                titulo: this.title.trim(), //trim serve para tirar espaços
                conteudo: this.description.trim(),
                dataPublicacao: paraDataHoraLocal(data),
            },
            imagem: this.imagemArquivo,
            previa: this.imagePreview ?? '',
        });
    }
}
