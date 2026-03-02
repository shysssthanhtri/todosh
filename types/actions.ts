export type ActionResult<Data = undefined> =
  | {
      success: true;
      data: Data;
    }
  | {
      success: false;
      error: string;
    };
