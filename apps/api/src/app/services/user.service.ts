import {
  SignInUser,
  SignUpUser,
  UserResponse,
  UserResponseModel,
  UserModel,
  User,
} from "#/app/models/user.model.js";
import { db, DB, eq } from "@repo/database";
import { auth } from "#/config/auth.config.js";
import { users } from "@repo/database";

class UserService {
  private readonly _db: DB;
  private readonly _auth: typeof auth;

  constructor() {
    this._db = db;
    this._auth = auth;
  }

  async signUp(data: SignUpUser): Promise<UserResponse> {
    const res = await this._auth.api.signUpEmail({
      body: data,
    });

    return UserResponseModel.parse(res.user);
  }
  async signIn(data: SignInUser): Promise<UserResponse> {
    const res = await this._auth.api.signInEmail({
      body: data,
    });

    return UserResponseModel.parse(res.user);
  }
  async getUserById(id: string): Promise<User | null> {
    const res = await this._db.query.users.findFirst({
      where: eq(users.id, id),
    });

    return res ? UserModel.parse(res) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const res = await this._db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return res ? UserModel.parse(res) : null;
  }
  async deleteUserById(id: string): Promise<User | null> {
    const [deleted] = await this._db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return deleted ? UserModel.parse(deleted) : null;
  }

  async deleteUserByEmail(email: string): Promise<User | null> {
    const [deleted] = await this._db
      .delete(users)
      .where(eq(users.email, email))
      .returning();

    return deleted ? UserModel.parse(deleted) : null;
  }
}

export const userService = new UserService();
