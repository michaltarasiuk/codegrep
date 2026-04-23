export type Animation = ScrollBehavior | SpringAnimation;

export interface SpringAnimation {
  /**
   * A value from 0 to 1, on how much to damp the animation.
   * 0 means no damping, 1 means full damping.
   *
   * @default 0.7
   */
  damping?: number;

  /**
   * The stiffness of how fast/slow the animation gets up to speed.
   *
   * @default 0.05
   */
  stiffness?: number;

  /**
   * The inertial mass associated with the animation.
   * Higher numbers make the animation slower.
   *
   * @default 1.25
   */
  mass?: number;
}

export const DEFAULT_SPRING_ANIMATION = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25,
} satisfies SpringAnimation;

export function mergeAnimations(
  ...animations: (Animation | boolean | undefined)[]
) {
  let merged = { ...DEFAULT_SPRING_ANIMATION };
  let instant = false;
  for (const animation of animations) {
    if (animation === "instant") {
      instant = true;
    } else if (typeof animation === "object") {
      instant = false;

      merged.damping = animation.damping ?? merged.damping;
      merged.stiffness = animation.stiffness ?? merged.stiffness;
      merged.mass = animation.mass ?? merged.mass;
    }
  }
  return instant ? "instant" : merged;
}
