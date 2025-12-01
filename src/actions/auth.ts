// src/actions/auth.ts
"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/session";

export type FormState = {
  errors?: {
    fullName?: string[];
    email?: string[];
    password?: string[];
    phoneNumber?: string[];
    graduationYear?: string[];
    regionSlug?: string[];
  };
  message?: string;
};

const RegisterSchema = z.object({
  fullName: z.string().min(3, "Nama minimal 3 huruf"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  phoneNumber: z.string().min(10, "Nomor WA minimal 10 digit"),
  graduationYear: z.string().transform((val) => parseInt(val)),
  regionSlug: z.string().min(1, "Pilih wilayah"),
});

// PERBAIKAN DISINI: Ubah 'prevState: FormState' menjadi 'prevState: FormState | null'
export async function registerUser(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const validatedFields = RegisterSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    phoneNumber: formData.get("phoneNumber"),
    graduationYear: formData.get("graduationYear"),
    regionSlug: formData.get("regionSlug"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, fullName, phoneNumber, graduationYear, regionSlug } =
    validatedFields.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { profile: { phoneNumber } }] },
    });

    if (existingUser) {
      return { message: "Email atau Nomor WA sudah terdaftar." };
    }

    const region = await prisma.region.findUnique({
      where: { slug: regionSlug },
    });

    if (!region) {
      return { message: "Wilayah tidak valid." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        profile: {
          create: {
            fullName,
            phoneNumber,
            graduationYear,
            currentRegionId: region.id,
          },
        },
      },
    });

    await createSession(newUser.id.toString(), newUser.role);
  } catch (error) {
    console.error("Registration Error:", error);
    return { message: "Terjadi kesalahan sistem." };
  }

  redirect("/dashboard");
}

const LoginSchema = z.object({
  email: z.string().email("Format email salah"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function loginUser(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  // 1. Validasi Input
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // 2. Cari User di Database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { message: "Email atau password salah." };
    }

    // 3. Cek Password (Bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return { message: "Email atau password salah." };
    }

    // 4. Buat Sesi Baru
    await createSession(user.id.toString(), user.role);
  } catch (error) {
    console.error("Login Error:", error);
    return { message: "Gagal masuk. Silakan coba lagi." };
  }

  // 5. Redirect ke Dashboard
  redirect("/dashboard");
}

export async function logoutUser() {
  await deleteSession();
  redirect("/login");
}
