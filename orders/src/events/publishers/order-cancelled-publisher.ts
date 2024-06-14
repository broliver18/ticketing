import { Publisher, OrderCancelledEvent, Subjects} from '@shared-ticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  stream = 'ORDER';
  readonly subject = Subjects.OrderCancelled;
}