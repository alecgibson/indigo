import {ISaltHashPair} from "../Models/ISaltHashPair";
import * as crypto from "crypto";

export class PasswordHasher {
  private static SALT_LENGTH = 16;

  public static hash(password: string): ISaltHashPair {
    let salt = PasswordHasher.randomSalt();
    return {
      salt: salt,
      hash: PasswordHasher.hashWithSalt(password, salt),
    };
  }

  public static hashWithSalt(password, salt): string {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
  }

  private static randomSalt(): string {
    return crypto.randomBytes(PasswordHasher.SALT_LENGTH).toString('base64');
  }
}
