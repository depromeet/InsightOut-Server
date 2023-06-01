import { Injectable } from '@nestjs/common';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
  async verifyIdToken(idToken: string) {
    const decodedToken = await getAuth().verifyIdToken(idToken);

    return decodedToken;
  }

  async withdraw(uid: string) {
    await getAuth().deleteUser(uid);
  }
}
