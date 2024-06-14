import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { app } from './app';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined')
  }

  try {
    await natsWrapper.connect(process.env.NATS_URL);

    process.on('SIGINT', () => natsWrapper.close());
    process.on('SIGTERM', () => natsWrapper.close());

    new OrderCreatedListener(natsWrapper.jsm).listen();
    new OrderCancelledListener(natsWrapper.jsm).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

start();
