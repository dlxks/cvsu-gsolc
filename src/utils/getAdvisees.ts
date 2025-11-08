"use server"

import prisma from "@/lib/prisma";

export type AdviseeFilterValue =
  | string
  | boolean
  | null
  | { gte?: Date; lte?: Date }
  | Array<string | boolean | null>;

export type AdviseeFilters = Partial<Record<string, AdviseeFilterValue>>;

export type GetAdviseeParams = {
  adviserId?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: AdviseeFilters;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export async function getAdvisees(params: GetAdviseeParams) {
  const {
    adviserId,
    page = 1,
    pageSize = 10,
    search = "",
    filters = {},
    sortBy = "createdAt",
    sortDir = "desc",
  } = params;

  if (!adviserId) {
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      pages: 0,
    };
  }

  const take = Math.min(Math.max(pageSize, 1), 100);
  const skip = Math.max(0, (page - 1) * take);

  const where: any = { adviserId };

  // 🔍 Search by student info
  if (search?.trim()) {
    const q = search.trim();
    where.OR = [
      { student: { firstName: { contains: q, mode: "insensitive" } } },
      { student: { lastName: { contains: q, mode: "insensitive" } } },
      { student: { email: { contains: q, mode: "insensitive" } } },
    ];
  }

  // ⚙️ Apply filters
  for (const [key, value] of Object.entries(filters || {})) {
    if (value === undefined) continue;
    if (key === "createdAt" && typeof value === "object" && value !== null) {
      const range: any = {};
      if ("gte" in value && value.gte) range.gte = value.gte;
      if ("lte" in value && value.lte) range.lte = value.lte;
      if (Object.keys(range).length) where.createdAt = range;
      continue;
    }
    if (value === null) where[key] = null;
    else if (Array.isArray(value)) where[key] = { in: value };
    else where[key] = value;
  }

  const total = await prisma.advisee.count({ where });

  const items = await prisma.advisee.findMany({
    where,
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
        },
      },
      adviser: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      members: {
        include: {
          member: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      },
    },
    orderBy: {
      [sortBy]: sortDir,
    },
    skip,
    take,
  });

  const pages = Math.max(1, Math.ceil(total / take) || 1);

  return {
    items,
    total,
    page,
    pageSize: take,
    pages,
  };
}
