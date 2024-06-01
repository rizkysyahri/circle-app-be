import db from "../lib/db/index";

class LikeService {
  static async createLike(payload: { threadId: number; userId: number }) {
    const existsThread = await db.thread.findFirst({
      where: {
        id: payload.threadId,
      },
    });

    if (!existsThread) {
      throw new Error("Thread not found");
    }

    const existedLike = await db.like.findFirst({
      where: {
        threadId: payload.threadId,
        userId: payload.userId,
      },
    });

    if (existedLike) {
      return await db.like.deleteMany({
        where: {
          threadId: payload.threadId,
          userId: payload.userId,
        },
      });
    }

    return await db.like.create({
      data: {
        ...payload,
      },
    });
  }

  static async getLike(threadId: number) {
    return await db.like.findMany({
      where: {
        threadId,
      },
      include: {
        user: {
          select: {
            username: true,
            fullname: true,
            id: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  static async getCurrentLike(threadId: number, userId: number) {
    return await db.like.findFirst({
      where: {
        threadId,
        userId,
      },
    });
  }
}

export default LikeService;
