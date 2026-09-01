-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('PRESENTE', 'AUSENTE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VIEWER');

--CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'SINPE');

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

--createTable
create table public."Sesion" (
  "id" text not null default gen_random_uuid (),
  "fecha" timestamp with time zone not null default now(),
  "semana" integer not null,
  "año" integer not null,
  "abierta" boolean not null default true,
  "creadaAt" timestamp with time zone not null default now(),
  "cerradaAt" timestamp with time zone null,
  constraint Sesion_pkey primary key (id)
);

create table public."Pago" (
  "id" text not null default gen_random_uuid (),
  "personaId" text not null,
  "mes" integer not null,
  "año" integer not null,
  "semana1" double precision not null default 0,
  "semana2" double precision not null default 0,
  "semana3" double precision not null default 0,
  "semana4" double precision not null default 0,
  "total" double precision not null default 0,
  "notas" text null,
  "creadoAt" timestamp without time zone not null,
  "actualizadoAt" timestamp without time zone not null,
  "recibo" text null,
  "semana1MetodoPago" "MetodoPago" not null default 'EFECTIVO'::"MetodoPago",
  "semana2MetodoPago" "MetodoPago" not null default 'EFECTIVO'::"MetodoPago",
  "semana3MetodoPago" "MetodoPago" not null default 'EFECTIVO'::"MetodoPago",
  "semana4MetodoPago" "MetodoPago" not null default 'EFECTIVO'::"MetodoPago",
  constraint Pago_pkey primary key (id),
  constraint Pago_personaId_mes_año_key unique ("personaId", "mes", "año"),
  constraint Pago_personaId_fkey foreign KEY ("personaId") references "Persona" (id),
  constraint Pago_mes_check check (
    (
      (mes >= 1)
      and (mes <= 12)
    )
  )
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
-- CreateIndex
create unique INDEX IF not exists "Persona_codigoQR_key" on public."Persona" using btree ("codigoQR");

