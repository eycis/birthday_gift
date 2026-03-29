import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Message } from './models/message.model';
import { MessagesService } from './services/messages.service';
import { NotificationsService, NotificationSetupStatus } from './services/notifications.service';
import { pickDailyMessage } from './utils/daily-messages';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly messagesService = inject(MessagesService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly destroyRef = inject(DestroyRef);

  dailyMessage: Message | null = null;
  loading = true;
  error: string | null = null;
  notificationState = '';

  ngOnInit(): void {
    this.notificationsService.initForegroundNotifications();

    this.messagesService
      .getMessages$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (messages) => {
          this.dailyMessage = pickDailyMessage(messages);
          this.loading = false;
          this.error = null;
        },
        error: () => {
          this.dailyMessage = null;
          this.loading = false;
          this.error = 'Nepodařilo se načíst zprávy.';
        }
      });
  }

  async enableNotifications(): Promise<void> {
    this.notificationState = 'Nastavuju upozorneni...';

    const result = await this.notificationsService.enableDailyNotifications();
    this.notificationState = this.statusMessage(result);
  }

  private statusMessage(status: NotificationSetupStatus): string {
    switch (status) {
      case 'enabled':
        return 'Upozorneni jsou zapnuta.';
      case 'unsupported':
        return 'Tohle zarizeni nepodporuje web push notifikace.';
      case 'denied':
        return 'Opravneni k upozornenim bylo zamitnuto.';
      case 'missing-vapid-key':
        return 'Chybi VAPID key ve Firebase konfiguraci.';
      default:
        return 'Nastaveni upozorneni se nepodarilo.';
    }
  }
}
