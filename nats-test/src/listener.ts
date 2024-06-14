import { connect, StringCodec } from "nats";

const subscribeToMessages = async () => {
  console.clear();
  const nc = await connect({ servers: "127.0.0.1:4222" });

  // Create a codec
  const sc = StringCodec();

  // Create a simple subscriber and iterate over messages
  // matching the subscription
  const sub = nc.subscribe("ticket:created");

  // Subscribe to messages
  (async () => {
    for await (const m of sub) {
      console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
    }

    // Subscriber will close the connection after processing messages
    await nc.close();
  })();
};

subscribeToMessages();