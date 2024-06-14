import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  function signin(id?: string): string[];
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY =
  'sk_test_51POUZ92LeGUZRv6zNvBVu401dllqylahqtFqp8oDPt9R4JEzrA6fOGWZvW27sQCgyEL7OMCTgIa4PCHFH5UXpFyJ00KPiyQpWr';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  // Create a JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build a session object. { jwt: MY_JWT }
  const session = { jwt: token };
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Tale JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // Return a string that takes the cookie with the encoded data
  return [`session=${base64}`];
};
