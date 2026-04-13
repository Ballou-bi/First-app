import { prisma } from "../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// ✅ GET — récupère uniquement les employés de l'utilisateur connecté
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const employees = await prisma.emploies.findMany({
      where: { userId },
    });
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 },
    );
  }
}

// ✅ POST — crée un employé lié à l'utilisateur connecté
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nom, prenoms, email, poste } = body;

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
      data: {
        userId, // ✅ vient de Clerk, pas du body
        nom,
        prenoms,
        email,
        poste,
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 },
    );
  }
}

// ✅ PATCH — modifie uniquement un employé appartenant à l'utilisateur
export async function PATCH(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, nom, prenoms, email, poste } = body;

    const parsedId = parseInt(id);

    if (!parsedId || isNaN(parsedId)) {
      return NextResponse.json(
        { error: "L'ID est requis et doit être un nombre valide" },
        { status: 400 },
      );
    }

    // ✅ Vérifie que l'employé appartient bien à cet utilisateur
    const existingEmployee = await prisma.emploies.findFirst({
      where: { id: parsedId, userId },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employé introuvable" },
        { status: 404 },
      );
    }

    const updatedEmployee = await prisma.emploies.update({
      where: { id: parsedId },
      data: {
        // ✅ On ne passe que les champs du modèle, jamais userId
        ...(nom && { nom }),
        ...(prenoms && { prenoms }),
        ...(email && { email }),
        ...(poste && { poste }),
      },
    });

    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 },
    );
  }
}

// ✅ DELETE — supprime uniquement un employé appartenant à l'utilisateur
export async function DELETE(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;
    const parsedId = parseInt(id);

    if (!parsedId || isNaN(parsedId)) {
      return NextResponse.json(
        { error: "L'ID est requis et doit être un nombre valide" },
        { status: 400 },
      );
    }

    // ✅ Vérifie que l'employé appartient bien à cet utilisateur
    const existingEmployee = await prisma.emploies.findFirst({
      where: { id: parsedId, userId },
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
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 },
    );
  }
}
