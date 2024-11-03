// app/domains/page.tsx

import { prisma } from "@/lib/prisma";
import CustomDomainManager from "./custom-domain-manager";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DomainsPage() {
  // Retrieve the user's session
  const session = await auth();

  if (!session?.user) {
    // Redirect to the login page if not authenticated
    redirect("/signin");
  }

  // Fetch domains for the authenticated user
  const domains = await prisma.domain.findMany({
    where: { ownerId: session.user.id },
  });

  // **Add Domain Server Action**
  async function addDomain(name: string) {
    "use server";

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    // Check if the domain name already exists for this user
    const existingDomain = await prisma.domain.findFirst({
      where: {
        name,
        ownerId: userId,
      },
    });

    if (existingDomain) {
      throw new Error("You already have a domain with this name.");
    }

    // Create the new domain
    try {
      const newDomain = await prisma.domain.create({
        data: {
          name,
          ownerId: userId,
        },
      });

      return newDomain;
    } catch {
      throw new Error("An unexpected error occurred while adding the domain.");
    }
  }

  // **Delete Domain Server Action**
  async function deleteDomain(id: string) {
    "use server";

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    // Ensure the domain exists and belongs to the user
    const domain = await prisma.domain.findUnique({
      where: { id },
    });

    if (!domain) {
      throw new Error("Domain not found.");
    }

    if (domain.ownerId !== userId) {
      throw new Error("You are not authorized to delete this domain.");
    }

    // Delete the domain
    try {
      await prisma.domain.delete({
        where: { id },
      });
    } catch {
      throw new Error(
        "An unexpected error occurred while deleting the domain."
      );
    }
  }

  // **Add the editDomain server action here**

  // **Edit Domain Server Action**
  async function editDomain(id: string, newName: string) {
    "use server";

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    // Ensure the domain exists and belongs to the user
    const domain = await prisma.domain.findUnique({
      where: { id },
    });

    if (!domain) {
      throw new Error("Domain not found.");
    }

    if (domain.ownerId !== userId) {
      throw new Error("You are not authorized to edit this domain.");
    }

    // Check if the new domain name already exists for this user
    if (newName !== domain.name) {
      const existingDomain = await prisma.domain.findFirst({
        where: {
          name: newName,
          ownerId: userId,
        },
      });

      if (existingDomain) {
        throw new Error("You already have a domain with this name.");
      }
    }

    // Update the domain
    try {
      const updatedDomain = await prisma.domain.update({
        where: { id },
        data: { name: newName },
      });

      return updatedDomain;
    } catch {
      throw new Error(
        "An unexpected error occurred while updating the domain."
      );
    }
  }

  // Pass data and actions to the client component
  return (
    <CustomDomainManager
      initialDomains={domains}
      addDomain={addDomain}
      deleteDomain={deleteDomain}
      editDomain={editDomain} // Pass it here
    />
  );
}
