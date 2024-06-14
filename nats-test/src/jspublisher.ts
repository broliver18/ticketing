// import { connect, StringCodec } from "nats";

// const publishMessages = async () => {
//   try {
//     console.clear();
//     const sc = StringCodec();
//     const nc = await connect({ servers: '127.0.0.1:4222' });
//     const stream = 'TICKET';
//     const subj = 'TICKET.*';
//     const jsm = await nc.jetstreamManager();
//     await jsm.streams.add({ name: stream, subjects: [subj] });

//     const js = nc.jetstream();

//     for (let i = 0; i < 1; i++) {
//       const data = JSON.stringify({
//         id: i,
//         title: "concert1",
//         price: 100,
//       });
//       let p = await js.publish('TICKET.created', sc.encode(data));
//       console.log(
//         `publish, sequence: ${p.seq} and isDuplicate: ${p.duplicate}`
//       );
//     }

//     setTimeout(async () => {
//       await nc.close();
//     }, 2000);
//   } catch (err) {
//     console.error("Error:", err);
//   }
// };

// publishMessages();

import { connect } from 'nats';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

const publishMessages = async () => {
  console.clear();
  const nc = await connect({ servers: '127.0.0.1:4222' });
  const jsm = await nc.jetstreamManager();

  const publisher = new TicketCreatedPublisher(jsm);

  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }
};

publishMessages();
