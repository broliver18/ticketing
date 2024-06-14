import { JsMsg } from "nats";
import { Listener, OrderCreatedEvent, Subjects } from "@shared-ticketing/common";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  stream = 'ORDER';
  readonly subject = Subjects.OrderCreated;
  consumerName = 'ticket-service'

  async onMessage(data: OrderCreatedEvent['data'], msg: JsMsg) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id })

    // Save the ticket
    await ticket.save();

    // Create instance of TicketUpdatedPublisher
    await new TicketUpdatedPublisher(this.jsm).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    })

    // Ack the message
    msg.ack();
  }
}