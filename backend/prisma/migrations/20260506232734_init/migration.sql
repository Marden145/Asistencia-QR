-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('PRESENTE', 'AUSENTE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VIEWER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
create table public."Persona" (
  "id" text not null,
  "nombre" text not null,
  "apellido" text not null,
  "codigoQR" text not null,
  "activo" boolean not null default true,
  "createdAt" timestamp without time zone not null default CURRENT_TIMESTAMP,
  "fechaNacimiento" timestamp with time zone not null,
  constraint Persona_pkey primary key (id)
);





-- CreateTable
create table public."Asistencia" (
  "id" text not null,
  "personaId" text not null,
  "fecha" timestamp without time zone not null default CURRENT_TIMESTAMP,
  "semana" integer not null,
  "año" integer not null,
  "estado" "Estado" not null,
  "dia" integer null,
  constraint Asistencia_pkey primary key (id),
  constraint asistencia_persona_dia_semana_anio_estado_unique unique ("personaId", "dia", "semana", "año", "estado"),
  constraint Asistencia_personaId_fkey foreign KEY ("personaId") references "Persona" (id) on update CASCADE on delete RESTRICT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
-- CreateIndex
create unique INDEX IF not exists "Persona_codigoQR_key" on public."Persona" using btree ("codigoQR");

