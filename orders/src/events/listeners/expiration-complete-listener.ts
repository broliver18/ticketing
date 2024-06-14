import { JsMsg } from 'nats';
import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus,
} from '@shared-ticketing/common';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  stream = 'EXPIRATION';
  readonly subject = Subjects.ExpirationComplete;
  consumerName = 'order-service-expiration-completed-consumer';

  async onMessage(data: ExpirationCompleteEvent['data'], msg: JsMsg) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    await new OrderCancelledPublisher(this.jsm).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
