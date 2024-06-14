import { JsMsg } from 'nats';
import {
  Subjects,
  Listener,
  TicketCreatedEvent,
} from '@shared-ticketing/common';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  stream = 'TICKET';
  readonly subject = Subjects.TicketCreated;
  consumerName = 'order-service-ticket-created-consumer';

  async onMessage(data: TicketCreatedEvent['data'], msg: JsMsg) {
    const { id, title, price } = data;
    const ticketExist = await Ticket.findById(id);
    if (!ticketExist) {
      const ticket = Ticket.build({
        id,
        title,
        price,
      });
      await ticket.save();
    }
    msg.ack();
  }
}
