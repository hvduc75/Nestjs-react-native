import * as admin from 'firebase-admin';
import { firebaseConfig } from './firebase-adminsdk';

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
});

export default admin;
