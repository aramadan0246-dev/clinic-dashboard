import * as React from "react";
import { C } from "./tokens";

export interface IEmptyRowProps {
  text: string;
}

export function EmptyRow({ text }: IEmptyRowProps): JSX.Element {
  return (
    <div style={{ padding: "22px 8px", textAlign: "center", color: C.inkFaint, fontSize: 13, fontFamily: "Inter, sans-serif" }}>
      {text}
    </div>
  );
}
