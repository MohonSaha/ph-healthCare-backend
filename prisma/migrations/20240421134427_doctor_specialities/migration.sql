-- CreateTable
CREATE TABLE "specialities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "specialities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctorspecialities" (
    "specialitiesId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "doctorspecialities_pkey" PRIMARY KEY ("specialitiesId","doctorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "specialities_id_key" ON "specialities"("id");

-- AddForeignKey
ALTER TABLE "doctorspecialities" ADD CONSTRAINT "doctorspecialities_specialitiesId_fkey" FOREIGN KEY ("specialitiesId") REFERENCES "specialities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctorspecialities" ADD CONSTRAINT "doctorspecialities_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
