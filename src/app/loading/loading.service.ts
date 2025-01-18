import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSignal = signal<boolean>(false);

  loading = this.loadingSignal.asReadonly();

  public show() {
    this.loadingSignal.set(true);
  }

  public hide() {
    this.loadingSignal.set(false);
  }
}
