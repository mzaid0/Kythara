-- CreateTable
CREATE TABLE "public"."Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "sizes" TEXT[],
    "colors" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "soldCount" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION,
    "images" TEXT[],
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updtedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
