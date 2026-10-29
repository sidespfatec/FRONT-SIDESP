import { Component, EventEmitter, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { NewsItem } from '../news.model';

@Component({
    selector: 'app-new-card-news',
    standalone: true,
    imports: [DialogModule, InputTextModule, ButtonModule, FormsModule],
    templateUrl: './new-card-news.component.html',
    styleUrl: './new-card-news.component.scss',
})
export class NewCardNewsComponent {
    viewModal: boolean = true;
    title = '';
    description = '';
    imagePreview: string | null = null;

    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<NewsItem>();

    onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => (this.imagePreview = reader.result as string);
        reader.readAsDataURL(file);
    }

    onSave(): void {
        this.save.emit({
            id: Date.now(),
            title: this.title.trim(),
            description: this.description.trim(),
            image: this.imagePreview ?? 'https://placehold.co/800x450?text=Noticia',
            date: new Date(),
        });
        this.close.emit();
    }
}