import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@shared-ticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  stream = 'PAYMENT';
  readonly subject = Subjects.PaymentCreated;
}
