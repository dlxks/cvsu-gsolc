import prisma from "@/lib/prisma"

export type GetAnnouncementsParams = {
  staffId?: string,
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortDir?: "asc" | "desc"
}

export async function getAnnouncements(params: GetAnnouncementsParams) {
  const {
    staffId,
    page = 1,
    pageSize = 10,
    search = "",
    sortBy = "createdAt",
    sortDir = "desc"
  } = params

  const take = Math.max(1, Math.min(100, pageSize))
  const skip = Math.max(0, (Math.max(1, page) - 1) * take)

  const where: any = {}

  if (search?.trim()) {
    const q = search.trim()
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } }
    ]
  }

  const total = await prisma.announcement.count({ where })

  const items = await prisma.announcement.findMany({
    where,
    orderBy: { [sortBy]: sortDir },
    skip,
    take,
    include: {
      creator: true
    }
  })

  return {
    items,
    total,
    page,
    pageSize: take,
    pages: Math.ceil(total / take) || 1
  }
}