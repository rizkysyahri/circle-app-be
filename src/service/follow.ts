import db from "../lib/db/index";

class FollowService {
  static async getFollowingId(followerId: number) {
    const following = await db.follow.findMany({
      where: {
        followerId: followerId,
      },
    });

    if (!following) {
      throw new Error("Could'nt find a following");
    }

    return following;
  }

  static async getFollowerId(followingId: number) {
    const followers = await db.follow.findMany({
      where: {
        followingId: followingId,
      },
    });

    if (!followers) {
      throw new Error("Could'nt find a following");
    }

    return followers;
  }

  static async follow(followerId: number, followingId: number) {
    console.log(followingId);

    const existingFollow = await db.follow.findFirst({
      where: {
        followerId,
        followingId,
      },
    });

    if (existingFollow) {
      await db.follow.deleteMany({
        where: {
          followerId,
          followingId,
        },
      });

      return "Unfollowing successfully";
    }

    const follow = await db.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    return "following successfully";
  }

  static async getFollowersUsers(userId: number) {
    const followers = await db.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
          include: {
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
    });

    return followers.map((follow) => follow.follower);
  }

  static async getFollowingsUsers(userId: number) {
    const followings = await db.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          include: {
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
    });

    return followings.map((follow) => follow.following);
  }

  static async geCurrentFollowingId(followingId: number, userId: number) {
    return await db.follow.findFirst({
      where: {
        followingId,
        followerId: userId,
      },
    });
  }

  static async checkFollowStatus(id_user: number, loggedIn: number) {
    return await db.follow.findFirst({
      where: {
        followingId: id_user,
        followerId: loggedIn,
      },
    });
  }
}

export default FollowService;
