import { CreateUser, UserModel } from "#app/models/user.model.js";
import { db, DB } from "@repo/database/drizzle/drizzle.client";
import { auth } from "#config/auth.config.js";

class UserService {
  private readonly _db: DB;
  private readonly _auth: typeof auth;

  constructor() {
    this._db = db;
    this._auth = auth;
  }

  async signUp(data: CreateUser) {
    const newUser = await this._auth.api.signUpEmail({
      body: data,
    });

    return UserModel.parse(newUser);
  }
}

export default UserService;
