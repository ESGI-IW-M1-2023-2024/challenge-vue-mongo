import { connect } from 'mongoose';
import { myEnv } from '../conf';

const CONNECTION_STRING = `mongodb+srv://${myEnv.mongoDb.user}:${myEnv.mongoDb.pwd}@${myEnv.mongoDb.cluster}/${myEnv.mongoDb.database}`;

export async function DbConnect() {
  try {
    const _db = await connect(CONNECTION_STRING);
    console.log(`🟢 connected to Atlas Cluster: ${myEnv.mongoDb.cluster}`);
    return _db;
  } catch (e: any) {
    console.warn(e);
    return e;
  }
}
