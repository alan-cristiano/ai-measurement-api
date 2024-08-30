-- CreateTable
CREATE TABLE "Measure" (
    "measure_uuid" TEXT NOT NULL PRIMARY KEY,
    "customer_code" TEXT NOT NULL,
    "measure_value" INTEGER NOT NULL,
    "measure_datetime" DATETIME NOT NULL,
    "measure_type" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false
);
