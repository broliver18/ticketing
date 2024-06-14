import { Publisher, OrderCreatedEvent, Subjects} from '@shared-ticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  stream = 'ORDER';
  readonly subject = Subjects.OrderCreated;
}