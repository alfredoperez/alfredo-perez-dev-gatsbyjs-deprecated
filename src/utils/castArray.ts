/**
 * Makes sure the target passed gets transformed to an array
 * @param target - object or array
 */
export const castArray = (target: unknown) => (Array.isArray(target) ? target : [target])
