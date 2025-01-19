import { Injectable, signal } from '@angular/core';
import { Message, MessageSeverity } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  #message = signal<Message | null>(null);

  message = this.#message.asReadonly();

  showMessage(text: string, severity: MessageSeverity): void {
    this.#message.set({ text, severity });
  }

  clearMesssage(): void {
    this.#message.set(null);
  }
}
