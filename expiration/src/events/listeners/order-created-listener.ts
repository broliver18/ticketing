import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@shared-ticketing/common';
import { JsMsg } from 'nats';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  stream = 'ORDER';
  readonly subject = Subjects.OrderCreated;
  consumerName = 'expiration-service';

  async onMessage(data: OrderCreatedEvent['data'], msg: JsMsg) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process the job:', delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
