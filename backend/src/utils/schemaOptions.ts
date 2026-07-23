export const toJSONOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  },
};

/**
 * mongoose's static types don't know our toJSON transform adds `id` and
 * drops `_id` — this is the deliberate serialization boundary where we
 * cast to the plain shape the transform actually produces at runtime.
 */
export function toPlainJSON(doc: { toJSON: () => unknown }): Record<string, any> {
  return doc.toJSON() as Record<string, any>;
}
