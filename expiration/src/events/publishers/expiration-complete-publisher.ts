import { Subjects, Publisher, ExpirationCompleteEvent } from "@shared-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  stream = 'EXPIRATION';
  readonly subject = Subjects.ExpirationComplete;
}