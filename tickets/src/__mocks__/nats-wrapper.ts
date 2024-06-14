import { PubAck, JetStreamPublishOptions, Payload } from 'nats';

export const natsWrapper = {
  jsm: {
    streams: {
      get: (stream: string): Promise<void> => {
        return new Promise<void>((resolve) => resolve());
      },
      add: (obj: any): Promise<void> => {
        return new Promise<void>((resolve) => resolve());
      },
    },
    jetstream(): any {
      return {
        publish: (
          subject: string,
          data?: Payload,
          options?: Partial<JetStreamPublishOptions>
        ): Promise<PubAck> => {
          console.log('Event published');
          return Promise.resolve({} as PubAck);
        },
      };
    },
  },
};
