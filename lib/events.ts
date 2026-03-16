/** Custom window event name fired when a todo is added (e.g. after AddTodoButton submit). */
export const TODO_ADDED_EVENT = "todo-added";

/** Custom window event name fired when local todo data changes (add/complete/delete). Used to trigger debounced auto-sync. */
export const TODO_CHANGED_EVENT = "todo-changed";

/** Custom window event name fired when a todo is updated (e.g. after EditTodoDrawer submit). */
export const TODO_UPDATED_EVENT = "todo-updated";

/** Custom window event name fired when todos are synced (e.g. after SyncButton completes). */
export const TODO_SYNCED_EVENT = "todo-synced";

/** Custom window event name fired when labels are updated (e.g. after AddLabelButton submit). */
export const LABELS_UPDATED_EVENT = "labels-updated";
