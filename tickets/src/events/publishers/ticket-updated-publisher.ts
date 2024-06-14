import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@shared-ticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  stream = 'TICKET';
  readonly subject = Subjects.TicketUpdated;
}