import { JsMsg } from "nats";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  stream = 'TICKET';
  readonly subject = Subjects.TicketCreated;
  consumerName = 'order-service-ticket-created-consumer';

  onMessage(data: TicketCreatedEvent['data'], msg: JsMsg) {
    console.log('Event data!', data);

    msg.ack();
  }
}