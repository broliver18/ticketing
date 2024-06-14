import { Events, connect, NatsConnection, JetStreamManager } from 'nats';

class NatsWrapper {
  private _client?: NatsConnection;
  private _jsm?: JetStreamManager;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }
    return this._client;
  }

  get jsm() {
    if (!this._jsm) {
      throw new Error('Cannot access NATS JetStreamManager before connecting');
    }
    return this._jsm;
  }

  async connect(url: string) {
    try {
      this._client = await connect({ servers: url });
      this._jsm = await this.client.jetstreamManager();
    } catch (err) {
      console.log(`Error connecting to ${url}`);
    }

    (async () => {
      console.info(`Connected to ${this.client.getServer()}`);
      for await (const s of this.client.status()) {
        if (s.type === Events.Disconnect) {
          console.log('Connection status: closing');
        }
        console.info(`${s.type}: ${s.data}`);
      }
    })().then();
  }

  close() {
    if (this.client) {
      this.client.close();
    }
  }
}

export const natsWrapper = new NatsWrapper();
