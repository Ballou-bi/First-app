import prisma from "../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ✅ LIRE - GET
export async function GET() {
  try {
    const employees = await prisma.emploies.findMany();
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 },
    );
  }
}

// ✅ AJOUTER - POST
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, prenoms, email, poste } = body;

    // Validation complète de tous les champs
    if (!nom || typeof nom !== "string") {
      return NextResponse.json(
        { error: "Le nom est requis et doit être une chaîne de caractères" },
        { status: 400 },
      );
    }
    if (!prenoms || typeof prenoms !== "string") {
      return NextResponse.json(
        { error: "Le prénom est requis et doit être une chaîne de caractères" },
        { status: 400 },
      );
    }
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "L'email est requis et doit être une chaîne de caractères" },
        { status: 400 },
      );
    }
    if (!poste || typeof poste !== "string") {
      return NextResponse.json(
        { error: "Le poste est requis et doit être une chaîne de caractères" },
        { status: 400 },
      );
    }

    const newEmployee = await prisma.emploies.create({
      data: { nom, prenoms, email, poste },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error("Failed to create employee:", error);
    return NextResponse.json(
      { error: "Impossible de creer un emploiyés, verifier vos information " },
      { status: 500 },
    );
  }
}

// ✅ MODIFIER - PATCH
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    // ✅ CORRECTION : parseInt() car l'id vient du JSON en string parfois
    const parsedId = parseInt(id);

    if (!parsedId || isNaN(parsedId)) {
      return NextResponse.json(
        { error: "L'ID est requis et doit être un nombre valide" },
        { status: 400 },
      );
    }

    // ✅ AJOUT : vérifier que l'employé existe avant de modifier
    const existingEmployee = await prisma.emploies.findUnique({
      where: { id: parsedId },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employé introuvable" },
        { status: 404 },
      );
    }

    const updatedEmployee = await prisma.emploies.update({
      where: { id: parsedId },
      data,
    });

    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    console.error("Failed to update employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 },
    );
  }
}

// ✅ SUPPRIMER - DELETE
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    // ✅ CORRECTION : même logique que PATCH
    const parsedId = parseInt(id);

    if (!parsedId || isNaN(parsedId)) {
      return NextResponse.json(
        { error: "L'ID est requis et doit être un nombre valide" },
        { status: 400 },
      );
    }

    // ✅ AJOUT : vérifier que l'employé existe avant de supprimer
    const existingEmployee = await prisma.emploies.findUnique({
      where: { id: parsedId },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employé introuvable" },
        { status: 404 },
      );
    }

    const deletedEmployee = await prisma.emploies.delete({
      where: { id: parsedId },
    });

    return NextResponse.json(deletedEmployee, { status: 200 });
  } catch (error) {
    console.error("Failed to delete employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 },
    );
  }
}
