-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "workingHours" TEXT,
    "tags" TEXT[],
    "imageUrl" TEXT,
    "state" TEXT NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);
