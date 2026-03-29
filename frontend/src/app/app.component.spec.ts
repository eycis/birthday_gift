import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { MessagesService } from './services/messages.service';
import { NotificationsService } from './services/notifications.service';

describe('AppComponent', () => {
  const messagesServiceMock: Pick<MessagesService, 'getMessages$'> = {
    getMessages$: () =>
      of([
        {
          dayNumber: 1,
          title: 'Zprava pro tebe',
          body: 'Test zprava.'
        }
      ])
  };

  const notificationsServiceMock: Pick<NotificationsService, 'initForegroundNotifications'> = {
    initForegroundNotifications: async () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: MessagesService, useValue: messagesServiceMock },
        { provide: NotificationsService, useValue: notificationsServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render daily message body', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.message')?.textContent).toContain('Test zprava.');
  });
});
