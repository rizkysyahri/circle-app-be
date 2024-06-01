-- DropForeignKey
ALTER TABLE "ThreadImage" DROP CONSTRAINT "ThreadImage_threadId_fkey";

-- AddForeignKey
ALTER TABLE "ThreadImage" ADD CONSTRAINT "ThreadImage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
