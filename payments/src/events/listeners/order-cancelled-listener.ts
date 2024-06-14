import { JsMsg } from 'nats';
import {
  OrderCancelledEvent,
  Subjects,
  Listener,
  OrderStatus,
} from '@shared-ticketing/common';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  stream = 'ORDER';
  readonly subject = Subjects.OrderCancelled;
  consumerName = 'payment-service';

  async onMessage(data: OrderCancelledEvent['data'], msg: JsMsg) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
