import { JetStreamManager, PubAck } from 'nats';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract stream: string;
  abstract subject: T['subject'];

  constructor(protected jsm: JetStreamManager) {}

  streamConfig() {
    return {
      name: this.stream,
      subjects: [this.stream + '.*'],
    };
  }

  async publish(data: T['data']): Promise<PubAck> {
    try {
      const streamExist = await this.jsm.streams.info(this.stream);
      if (!streamExist) {
        await this.jsm.streams.add(this.streamConfig());
      }
    } catch (err) {
      await this.jsm.streams.add(this.streamConfig());
    }
    const js = this.jsm.jetstream();
    console.log(`Publish data ${this.subject}, body: ${JSON.stringify(data)}`);
    return await js.publish(this.subject, JSON.stringify(data));
  }
}
