import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root' // Esto permite que el servicio esté disponible en toda la aplicación
})
export class EventService {
    private eventSubject = new Subject<any>(); // Puedes tiparlo según necesidad
    event$ = this.eventSubject.asObservable(); // Exponemos el observable

    emitEvent(data: any) {
        this.eventSubject.next(data);
    }
}
