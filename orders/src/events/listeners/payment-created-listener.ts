import { JsMsg } from 'nats';
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  NotFoundError,
  OrderStatus,
} from '@shared-ticketing/common';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  stream = 'PAYMENT';
  readonly subject = Subjects.PaymentCreated;
  consumerName = 'order-service-payment-created-consumer';

  async onMessage(data: PaymentCreatedEvent['data'], msg: JsMsg) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new NotFoundError();
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
