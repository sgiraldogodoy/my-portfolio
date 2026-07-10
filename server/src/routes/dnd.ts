import { Router } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { dbReady } from "../db/connect.js";
import { Character } from "../models/Character.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const dndRouter = Router();

dndRouter.use(requireAuth);

dndRouter.use((_req, res, next) => {
  if (!dbReady()) {
    return res.status(503).json({ error: "Database unavailable, try again shortly." });
  }
  next();
});

const abilityKey = z.enum(["str", "dex", "con", "int", "wis", "cha"]);

const abilityScores = z.object({
  str: z.number().int().min(1).max(30),
  dex: z.number().int().min(1).max(30),
  con: z.number().int().min(1).max(30),
  int: z.number().int().min(1).max(30),
  wis: z.number().int().min(1).max(30),
  cha: z.number().int().min(1).max(30),
});

// Mirrors the client's CharacterBuild. Rules legality (skill counts, point-buy
// budget…) is enforced by the builder; here we only guarantee shape and size.
const buildSchema = z.object({
  name: z.string().trim().min(1).max(100),
  classId: z.string().max(30),
  raceId: z.string().max(30),
  subraceId: z.string().max(30).optional(),
  backgroundId: z.string().max(30),
  level: z.number().int().min(1).max(20),
  alignment: z.string().max(30),
  abilityMethod: z.enum(["standard", "pointbuy", "roll"]),
  baseAbilities: abilityScores,
  bonusChoices: z.array(abilityKey).max(6),
  classSkills: z.array(z.string().max(30)).max(18),
  raceSkills: z.array(z.string().max(30)).max(18),
  notes: z.string().max(5000),
});

type CharacterDoc = InstanceType<typeof Character>;

function serialize(doc: CharacterDoc) {
  return { id: doc.id, build: doc.build, updatedAt: doc.updatedAt };
}

async function findOwnCharacter(req: AuthedRequest): Promise<CharacterDoc | null> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return null;
  return Character.findOne({ _id: id, userId: req.userId });
}

dndRouter.get("/characters", async (req: AuthedRequest, res, next) => {
  try {
    const docs = await Character.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json({ characters: docs.map(serialize) });
  } catch (err) {
    next(err);
  }
});

dndRouter.post("/characters", async (req: AuthedRequest, res, next) => {
  try {
    const build = buildSchema.parse(req.body.build);
    const doc = await Character.create({ userId: req.userId, name: build.name, build });
    res.json({ character: serialize(doc) });
  } catch (err) {
    next(err);
  }
});

dndRouter.post("/characters/:id", async (req: AuthedRequest, res, next) => {
  try {
    const build = buildSchema.parse(req.body.build);
    const doc = await findOwnCharacter(req);
    if (!doc) return res.status(404).json({ error: "Character not found" });
    doc.name = build.name;
    doc.set("build", build);
    await doc.save();
    res.json({ character: serialize(doc) });
  } catch (err) {
    next(err);
  }
});

dndRouter.post("/characters/:id/delete", async (req: AuthedRequest, res, next) => {
  try {
    const doc = await findOwnCharacter(req);
    if (!doc) return res.status(404).json({ error: "Character not found" });
    await doc.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
