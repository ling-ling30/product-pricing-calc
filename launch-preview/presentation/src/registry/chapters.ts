import type { ChapterDef } from "./types";
import Problem from "../chapters/01-problem/Problem";
import { narrations as problemNarrations } from "../chapters/01-problem/narrations";
import Engine from "../chapters/02-engine/Engine";
import { narrations as engineNarrations } from "../chapters/02-engine/narrations";
import Reveal from "../chapters/03-reveal/Reveal";
import { narrations as revealNarrations } from "../chapters/03-reveal/narrations";

/**
 * Order = order of presentation.
 *
 * Each chapter MUST provide a `narrations: Narration[]` array. Its length
 * is the chapter's step count — there is no `totalSteps` to maintain
 * separately. This guarantees the audio synthesis pipeline, the runtime
 * stepper, and the chapter `.tsx` switch on `step` cannot drift apart.
 *
 * Visual styling (color, fonts) comes entirely from the active theme —
 * chapters never hard-code palette / font names. See THEMES.md.
 */
export const CHAPTERS: ChapterDef[] = [
  {
    id: "problem",
    title: "01 · The Problem",
    narrations: problemNarrations,
    Component: Problem,
  },
  {
    id: "engine",
    title: "02 · The Engine",
    narrations: engineNarrations,
    Component: Engine,
  },
  {
    id: "reveal",
    title: "03 · The Reveal",
    narrations: revealNarrations,
    Component: Reveal,
  },
];
