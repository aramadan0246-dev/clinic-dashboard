import * as React from "react";
import { Field, inputStyle, PrimaryBtn } from "../shared";
import { NewsCategory } from "../../data/models";

export interface IAddNewsFormProps {
  onSubmit: (data: { title: string; category: NewsCategory; excerpt: string; body: string }) => void;
  onClose: () => void;
}

export function AddNewsForm({ onSubmit, onClose }: IAddNewsFormProps): JSX.Element {
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<NewsCategory>("Policy");
  const [excerpt, setExcerpt] = React.useState("");
  const [body, setBody] = React.useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Field label="Title"><input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Parking garage closed for repairs" /></Field>
      <Field label="Category">
        <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value as NewsCategory)}>
          <option>Policy</option><option>Supplies</option><option>Staff</option><option>Facilities</option>
        </select>
      </Field>
      <Field label="Short summary"><input style={inputStyle} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="One line for the feed preview" /></Field>
      <Field label="Full announcement">
        <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Full details staff will see when expanded" />
      </Field>
      <PrimaryBtn
        onClick={() => {
          if (!title.trim()) return;
          onSubmit({ title, category, excerpt: excerpt || title, body: body || excerpt || title });
          onClose();
        }}
      >
        Publish announcement
      </PrimaryBtn>
    </div>
  );
}
