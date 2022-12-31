import * as couchdb from 'couchdb';

export const connectToDatabase = (url, auth) => {
  const client = new couchdb.Client({
    url: url,
    auth: auth
  });
  const db = client.db('user-profiles');
  return db;
}
