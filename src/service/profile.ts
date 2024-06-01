import db from "../lib/db/index";
import { IProfile } from "../types/app";

class ProfileService {
  static async updateProfile(userId: number, payload: IProfile) {
    const profileData: Partial<IProfile> = {};

    if (payload.username !== null && payload.username !== undefined) {
      if (typeof payload.username === "string") {
        await db.user.update({
          where: {
            id: userId,
          },
          data: {
            username: payload.username,
          },
        });
      } else {
        throw new Error("Invalid username format");
      }
    }

    if (payload.fullname !== null && payload.fullname !== undefined) {
      if (typeof payload.fullname === "string") {
        await db.user.update({
          where: {
            id: userId,
          },
          data: {
            fullname: payload.fullname,
          },
        });
      } else {
        throw new Error("Invalid fullname format");
      }
    }

    if (payload.bio !== null && payload.bio !== undefined) {
      if (typeof payload.bio === "string") {
        profileData.bio = payload.bio;
      } else {
        throw new Error("Invalid bio format");
      }
    }
    if (payload.avatar !== null && payload.avatar !== undefined) {
      profileData.avatar = payload.avatar;
    }
    if (payload.cover !== null && payload.cover !== undefined) {
      profileData.cover = payload.cover;
    }

    return await db.profile.update({
      where: {
        userId: userId,
      },
      data: profileData,
    });
  }

  static async getProfile(userId: number) {
    return await db.profile.findFirst({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            username: true,
            email: true,
            threads: {
              select: {
                id: true,
                content: true,
                postedAt: true,
                ThreadImage: {
                  select: {
                    image: true,
                  },
                },
              },
            },

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
          },
        },
      },
    });
  }
}

export default ProfileService;
