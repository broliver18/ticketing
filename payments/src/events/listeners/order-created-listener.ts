import { JsMsg } from 'nats';
import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@shared-ticketing/common';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  stream = 'ORDER';
  readonly subject = Subjects.OrderCreated;
  consumerName = 'payment-service';

  async onMessage(data: OrderCreatedEvent['data'], msg: JsMsg) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
