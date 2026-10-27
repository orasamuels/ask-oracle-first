import { CATEGORIES } from "@/lib/test-setup";
import { OptionGroup } from "./OptionGroup";

type Category = (typeof CATEGORIES)[number];

export function CategorySelector({ value, onChange }: { value?: Category | undefined; onChange: (c: Category) => void }) {
  return (
    <OptionGroup
      label="Category"
      columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      options={CATEGORIES.map((c) => ({ value: c, label: c }))}
      value={value}
      onChange={onChange}
    />
  );
}
