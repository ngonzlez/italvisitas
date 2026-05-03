-- CreateTable: Specialty
CREATE TABLE "Specialty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- CreateTable: Zone
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Zone_name_key" ON "Zone"("name");

-- Populate Specialty from distinct Doctor.specialty values
INSERT INTO "Specialty" ("id", "name")
SELECT gen_random_uuid()::text, specialty
FROM (SELECT DISTINCT specialty FROM "Doctor" WHERE specialty IS NOT NULL AND specialty <> '') s;

-- Populate Zone from distinct Place.zone values
INSERT INTO "Zone" ("id", "name")
SELECT gen_random_uuid()::text, zone
FROM (SELECT DISTINCT zone FROM "Place" WHERE zone IS NOT NULL AND zone <> '') z;

-- Add specialtyId to Doctor (nullable first for data migration)
ALTER TABLE "Doctor" ADD COLUMN "specialtyId" TEXT;
UPDATE "Doctor" d SET "specialtyId" = s.id FROM "Specialty" s WHERE s.name = d.specialty;
-- Handle any doctors with no specialty match (set to first specialty or a placeholder)
UPDATE "Doctor" SET "specialtyId" = (SELECT id FROM "Specialty" LIMIT 1)
WHERE "specialtyId" IS NULL;
ALTER TABLE "Doctor" ALTER COLUMN "specialtyId" SET NOT NULL;
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_specialtyId_fkey"
    FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add zoneId to Place (nullable first for data migration)
ALTER TABLE "Place" ADD COLUMN "zoneId" TEXT;
UPDATE "Place" p SET "zoneId" = z.id FROM "Zone" z WHERE z.name = p.zone;
-- Handle any places with no zone match
UPDATE "Place" SET "zoneId" = (SELECT id FROM "Zone" LIMIT 1)
WHERE "zoneId" IS NULL;
ALTER TABLE "Place" ALTER COLUMN "zoneId" SET NOT NULL;
ALTER TABLE "Place" ADD CONSTRAINT "Place_zoneId_fkey"
    FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable: _DoctorToPlace (implicit many-to-many)
CREATE TABLE "_DoctorToPlace" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE UNIQUE INDEX "_DoctorToPlace_AB_unique" ON "_DoctorToPlace"("A", "B");
CREATE INDEX "_DoctorToPlace_B_index" ON "_DoctorToPlace"("B");

-- Migrate existing Doctor.placeId data into join table
INSERT INTO "_DoctorToPlace" ("A", "B")
SELECT id, "placeId" FROM "Doctor" WHERE "placeId" IS NOT NULL;

-- Add FK constraints on join table
ALTER TABLE "_DoctorToPlace" ADD CONSTRAINT "_DoctorToPlace_A_fkey"
    FOREIGN KEY ("A") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_DoctorToPlace" ADD CONSTRAINT "_DoctorToPlace_B_fkey"
    FOREIGN KEY ("B") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Drop old columns
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_placeId_fkey";
ALTER TABLE "Doctor" DROP COLUMN "placeId";
ALTER TABLE "Doctor" DROP COLUMN "specialty";
ALTER TABLE "Place" DROP COLUMN "zone";
