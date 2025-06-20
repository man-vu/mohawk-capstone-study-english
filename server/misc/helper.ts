import bcrypt from "bcrypt";
import type { Request } from "express";
import type { Express } from "express";

export const checkPassword = (raw: string, hash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(raw, hash, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

/**
 * Generate password hash and salt from raw password passed as first parameter and return them
 * @param {*} password
 */
export const hashPasswordAsync = async (password: string) => {
  const saltRounds = 10;

  const passwordSalt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, passwordSalt);

  return { passwordHash, passwordSalt };
};

export function cleanObject<T extends Record<string, any>>(obj: T[]) {
  for (let i = 0; i < obj.length; i++) {
    for (const propName in obj[i]) {
      if (obj[i][propName] === null || obj[i][propName] === undefined) {
        delete obj[i][propName];
      }
    }
  }

  return obj;
}

export function imageFilter(req: Request, file: any, cb: (err: Error | null, res?: boolean) => void) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
}

export function getAvatarUrl(firstName: string) {
  const baseUrl = "default/"
  const firstCharacter = firstName.trim().charAt(0)

  return `${baseUrl}${firstCharacter}.svg`
}

export default {
  checkPassword,
  hashPasswordAsync,
  cleanObject,
  imageFilter,
  getAvatarUrl,
};
