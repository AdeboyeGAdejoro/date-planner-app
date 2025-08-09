-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "dateType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "people" INTEGER NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);
