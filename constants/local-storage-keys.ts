/** localStorage key for pending sync data (upserts + delete IDs) before they are sent to the server. */
export const PENDING_KEY = "todosh_pending_sync";

/** localStorage key for the set of todo IDs the server last reported (used for merge/diff). */
export const SERVER_KNOWN_IDS_KEY = "todosh_server_known_ids";
