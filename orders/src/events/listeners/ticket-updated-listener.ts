import { JsMsg } from 'nats';
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
} from '@shared-ticketing/common';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  stream = 'TICKET';
  readonly subject = Subjects.TicketUpdated;
  consumerName = 'order-service-ticket-updated-consumer';

  async onMessage(data: TicketUpdatedEvent['data'], msg: JsMsg) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
