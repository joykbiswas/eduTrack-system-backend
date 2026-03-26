/*
  Warnings:

  - Added the required column `subject` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "subject" TEXT NOT NULL;
