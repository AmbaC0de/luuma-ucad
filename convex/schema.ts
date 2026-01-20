import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    role: v.optional(
      v.union(v.literal("STUDENT"), v.literal("ADMIN"), v.literal("STAFF")),
    ),
    matricule: v.optional(v.string()),
    facultyId: v.optional(v.id("faculties")),
    departmentId: v.optional(v.id("departments")),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    phone: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    level: v.optional(v.string()),
  }).index("email", ["email"]),

  faculties: defineTable({
    name: v.string(),
    code: v.string(),
  }),

  departments: defineTable({
    name: v.string(),
    code: v.string(),
    facultyId: v.id("faculties"),
  }).index("by_facultyId", ["facultyId"]),

  institutes: defineTable({
    name: v.string(),
    code: v.optional(v.string()),
    facultyId: v.id("faculties"),
  }).index("by_facultyId", ["facultyId"]),

  news: defineTable({
    title: v.string(),
    overview: v.string(),
    content: v.string(),
    scope: v.union(
      v.literal("UNIVERSITY"),
      v.literal("FACULTY"),
      v.literal("DEPARTMENT"),
    ),
    facultyId: v.optional(v.id("faculties")),
    departmentId: v.optional(v.id("departments")),
    isPinned: v.boolean(),
    status: v.union(
      v.literal("DRAFT"),
      v.literal("PUBLISHED"),
      v.literal("ARCHIVED"),
    ),
    storageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.nullable(v.string())),
    publishedAt: v.number(),
    expiresAt: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
  })
    .index("by_status_publishedAt", ["status", "publishedAt"])
    .index("by_scope", ["scope"])
    .index("by_facultyId", ["facultyId"])
    .index("by_departmentId", ["departmentId"]),

  productCategories: defineTable({
    name: v.string(),
    createdAt: v.optional(v.number()),
  }),

  products: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    category: v.id("productCategories"),
    images: v.optional(v.array(v.string())),
    storageIds: v.optional(v.array(v.id("_storage"))),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
  }).index("by_category", ["category"]),

  documents: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("COURSE"),
      v.literal("TD"),
      v.literal("TP"),
      v.literal("EXAM"),
    ),
    scope: v.union(
      v.literal("UNIVERSITY"),
      v.literal("FACULTY"),
      v.literal("DEPARTMENT"),
      v.literal("INSTITUTE"),
    ),
    facultyId: v.optional(v.id("faculties")),
    departmentId: v.optional(v.id("departments")),
    instituteId: v.optional(v.id("institutes")),
    storageId: v.id("_storage"),
    fileUrl: v.string(),
    mimeType: v.string(),
    size: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
  })
    .index("by_scope", ["scope"])
    .index("by_facultyId", ["facultyId"])
    .index("by_departmentId", ["departmentId"])
    .index("by_instituteId", ["instituteId"]),

  sponsors: defineTable({
    title: v.string(),
    content: v.string(),
    sponsor: v.string(),
    storageId: v.id("_storage"),
    imageUrl: v.string(),
    expiresAt: v.number(),
    status: v.union(v.literal("active"), v.literal("archived")),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
  }).index("by_status_expiresAt", ["status", "expiresAt"]),

  sponsorDurations: defineTable({
    label: v.string(),
    value: v.number(), // in days
  }),
});
