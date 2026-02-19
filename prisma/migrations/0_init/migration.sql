-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "todo" (
    "todo_id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "completed" BOOLEAN DEFAULT false,

    CONSTRAINT "todo_pkey" PRIMARY KEY ("todo_id")
);

