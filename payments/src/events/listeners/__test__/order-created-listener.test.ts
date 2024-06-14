import mongoose from 'mongoose';
import { JsMsg } from 'nats';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedEvent, OrderStatus } from '@shared-ticketing/common';
import { OrderCreatedListener } from '../order-created-listener';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.jsm);

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'adfsafa',
    userId: 'adsfafa',
    status: OrderStatus.Created,
    ticket: {
      id: 'dfsafds',
      price: 10,
    },
  };

  // @ts-ignore
  const msg: JsMsg = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
