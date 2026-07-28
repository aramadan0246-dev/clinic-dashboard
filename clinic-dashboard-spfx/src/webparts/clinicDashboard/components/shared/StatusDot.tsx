import * as React from "react";
import { C } from "./tokens";

export interface IStatusDotProps {
  status: string;
}

const STATUS_COLOR: Record<string, string> = {
  Available: C.green,
  Busy: C.amber,
  OffDuty: C.inkFaint,
  Completed: C.green,
  InProgress: C.amber,
  Upcoming: C.teal,
  Cancelled: C.inkFaint,
  Open: C.green,
  Closed: C.inkFaint,
};

export function StatusDot({ status }: IStatusDotProps): JSX.Element {
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        background: STATUS_COLOR[status] || C.inkFaint,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}
