import db from "../lib/db/index";
import { IThread } from "../types/app";

class ThreadService {
  static async calculateTime(pastTime: Date): Promise<string> {
    const currentTime = new Date();
    const timeDifferent = Math.floor(
      (currentTime.getTime() - pastTime.getTime()) / 1000
    );

    const secondsInMinute = 60;
    const secondsInHour = secondsInMinute * 60;
    const secondsInDay = secondsInHour * 24;
    const secondsInMonth = secondsInDay * 30;

    if (timeDifferent < secondsInMinute) {
      return `${timeDifferent}s${timeDifferent !== 1 ? "" : ""}`;
    } else if (timeDifferent < secondsInHour) {
      const minutes = Math.floor(timeDifferent / secondsInMinute);
      return `${minutes}m${minutes !== 1 ? "" : ""}`;
    } else if (timeDifferent < secondsInDay) {
      const hours = Math.floor(timeDifferent / secondsInHour);
      return `${hours}h${hours !== 1 ? "" : ""}`;
    } else if (timeDifferent < secondsInMonth) {
      const days = Math.floor(timeDifferent / secondsInDay);
      return `${days}d${days !== 1 ? "" : ""}`;
    } else {
      const months = Math.floor(timeDifferent / secondsInMonth);
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    }
  }

  static async getThreads() {
    const threads = await db.thread.findMany({
      where: {
        threadId: null,
      },

      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullname: true,
            email: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        ThreadImage: {
          select: {
            image: true,
          },
        },
        _count: {
          select: {
            replies: true,
            like: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const formattedThreads = await Promise.all(
      threads.map(async (thread) => ({
        ...thread,
        postedAt: await this.calculateTime(thread.postedAt),
      }))
    );

    return formattedThreads;
  }

  static async createThread(payload: IThread) {
    const thread = await db.thread.create({
      data: {
        content: payload.content,
        userId: payload.userId,
        threadId: payload.threadId ? +payload.threadId : null,
      },
    });

    if (payload.images && payload.images.length > 0) {
      await db.threadImage.createMany({
        data: payload.images.map((image) => ({
          image: image.image,
          threadId: thread.id,
        })),
      });
    }

    return thread;
  }

  static async getThreadById(id: number) {
    const threadById = await db.thread.findFirst({
      where: {
        id,
        threadId: null,
      },
      include: {
        ThreadImage: {
          select: {
            image: true,
          },
        },
        author: {
          include: {
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
    });

    if (!threadById) {
      throw new Error("Couldn't find thread");
    }

    return threadById;
  }

  static async deleteThreadByUserId(threadId: number, userId: number) {
    const existsThread = await db.thread.findFirst({
      where: {
        id: threadId,
      },
    });

    if (!existsThread) {
      throw new Error("Thread not found");
    }

    if (existsThread.userId !== userId) {
      throw new Error("User is not authorized to delete this thread");
    }

    await db.thread.delete({
      where: {
        id: threadId,
      },
      include: {
        ThreadImage: true,
      },
    });

    return existsThread;
  }

  static async getReplies(threadId: number) {
    const threadReplies = await db.thread.findMany({
      where: {
        threadId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullname: true,
            email: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        ThreadImage: {
          select: {
            image: true,
          },
        },
        _count: {
          select: {
            replies: true,
            like: true,
          },
        },
      },
    });

    const formattedThreads = await Promise.all(
      threadReplies.map(async (thread) => ({
        ...thread,
        postedAt: await this.calculateTime(thread.postedAt),
      }))
    );

    return formattedThreads;
  }

  static async getThreadTokenById(userId: number) {
    const threadToken = await db.thread.findMany({
      where: {
        userId,
        threadId: null,
      },
      include: {
        ThreadImage: {
          select: {
            image: true,
          },
        },
        author: {
          select: {
            id: true,
            fullname: true,
            username: true,
            email: true,
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
      orderBy: {
        id: "desc",
      },
    });

    if (!threadToken) {
      throw new Error("Could not find thread token");
    }

    const formattedThreads = await Promise.all(
      threadToken.map(async (thread) => ({
        ...thread,
        postedAt: await this.calculateTime(thread.postedAt),
      }))
    );

    return formattedThreads;
  }
}

export default ThreadService;
