/**
 * Motion overrides several React event handler signatures with its own pan /
 * gesture types — most notably `onDrag*` and `onAnimation*`. Component prop
 * types that flow through to a `motion.<element>` need to drop these handlers
 * to avoid TypeScript clashes. They're rarely useful on the affected
 * components anyway.
 */
export type WithoutMotionConflicts<T> = Omit<
  T,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragExit'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
>
