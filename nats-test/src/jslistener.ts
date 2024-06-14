import { connect } from 'nats';
import { TicketCreatedListener } from './events/ticket-created-listener';

const subscribeToMessages = async () => {
  console.clear();
  const nc = await connect({ servers: '127.0.0.1:4222' });
  const jsm = await nc.jetstreamManager();

  new TicketCreatedListener(jsm).listen();
};

subscribeToMessages();
