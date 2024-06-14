import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@shared-ticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  stream = 'TICKET';
  readonly subject = Subjects.TicketCreated;
}
