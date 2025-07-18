import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return [];

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();
    return channels;
  },
});

export const getById = query({
  args: { id: v.id("channels") },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const channel = await ctx.db.get(args.id);
    if (!channel) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => {
        return q.eq("workspaceId", channel.workspaceId).eq("userId", userId);
      })
      .unique();

    if (!member) {
      return null;
    }

    return channel;
  },
});

export const create = mutation({
  args: { name: v.string(), workspaceId: v.id("workspaces") },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw Error("Unauthorized");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") throw Error("Unauthorized");

    const parsedName = args.name.replace(/\s+/g, "-").toLowerCase();

    const channelId = await ctx.db.insert("channels", {
      name: parsedName,
      workspaceId: args.workspaceId,
    });

    return channelId;
  },
});

export const update = mutation({
  args: {
    id: v.id("channels"),
    name: v.string(),
  },
  async handler(ctx, args) {
    console.log("Reached here");
    const userId = await getAuthUserId(ctx);
    if (!userId) throw Error("Unauthorized");

    const channel = await ctx.db.get(args.id);

    if (!channel) throw new Error("Channel not found");
    console.log("Reached here1");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") throw Error("Unauthorized");
    console.log("Reached here2");

    await ctx.db.patch(args.id, {
      name: args.name,
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("channels"),
  },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw Error("Unauthorized");

    const channel = await ctx.db.get(args.id);

    if (!channel) throw new Error("Channel not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") throw Error("Unauthorized");

    const [messages] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_channel_id", (q) => q.eq("channelId", args.id))
        .collect(),
    ]);

    for (const message of messages) {
      ctx.db.delete(message._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
