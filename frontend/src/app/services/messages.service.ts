import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, orderBy, query } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private readonly firestore = inject(Firestore);

  getMessages$(): Observable<Message[]> {
    const messagesCollection = collection(this.firestore, 'messages');
    const messagesQuery = query(messagesCollection, orderBy('dayNumber', 'asc'));

    return collectionData(messagesQuery).pipe(
      map((messages) =>
        (messages as Message[]).filter(
          (message) =>
            typeof message.dayNumber === 'number'
            && typeof message.title === 'string'
            && typeof message.body === 'string'
        )
      )
    );
  }
}
