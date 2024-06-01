import db from "../lib/db";
import { registerValidator } from "../lib/validators/user";
import { IRegister } from "../types/app";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  static async getUsers() {
    return await db.user.findMany();
  }

  static async register(payload: IRegister) {
    const { value, error } = registerValidator.validate(payload);

    if (error) {
      throw new Error(error.details[0].message);
    }

    const isExist = await db.user.findFirst({
      where: {
        OR: [
          {
            username: value.username,
          },
          {
            email: value.email,
          },
        ],
      },
    });

    if (isExist) {
      throw new Error("Username or Email already exists");
    }

    const hashPassword = await bcrypt.hash(value.password, 10);

    value.password = hashPassword;

    const user = await db.user.create({
      data: {
        ...value,
      },
    });

    const profile = await db.profile.create({
      data: {
        userId: user.id,
      },
    });

    return { user, profile };
  }

  static async login(username: string, password: string) {
    const user = await db.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email: username,
          },
        ],
      },
    });

    if (!user) {
      throw new Error("User or Password is not valid");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Password is not valid");
    }

    const expiresIn = "1d";
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY!, {
      expiresIn: expiresIn,
    });

    return token;
  }

  static async getUsersSearch() {
    const users = await db.user.findMany({
      include: {
        following: {
          select: {
            followingId: true,
          },
        },
        follower: {
          select: {
            followerId: true,
          },
        },
        profile: {
          select: {
            avatar: true,
            bio: true,
          },
        },
      },
    });

    return users;
  }

  static async getOtherUsers(id: number) {
    const usersOthres = await db.$queryRaw`
    SELECT "User".id, "User".username, "User".fullname, "Profile"."avatar" FROM "User" LEFT JOIN "Profile" ON "User".id = "Profile"."userId" WHERE "User".id != ${id} ORDER BY random() limit 3
    `;

    return usersOthres;
  }

  static async getProfileUserByUsername(username: string) {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        email: true,
        profile: true,
        threads: {
          where: {
            threadId: null,
          },
          select: {
            id: true,
            content: true,
            postedAt: true,
            author: {
              select: {
                id: true,
                username: true,
                fullname: true,
                profile: {
                  select: {
                    avatar: true,
                  },
                },
              },
            },
            _count: {
              select: {
                replies: true,
                like: true,
              },
            },
          },
        },
        follower: true,
        following: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  static async sendEmail(username: string) {
    const user = await db.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email: username,
          },
        ],
      },
    });

    if (!user) {
      throw new Error("User invalid");
    }

    const expiresIn = "2h";
    const token = jwt.sign(
      { username: user.username },
      process.env.SECRET_KEY!,
      {
        expiresIn: expiresIn,
      }
    );

    return token;
  }

  static async updatePassword(password: string, userId: string) {
    console.log(password);
    console.log(userId);
  }
}

export default UserService;
