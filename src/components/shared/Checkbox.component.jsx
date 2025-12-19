import { Checkbox } from "@/components/ui/checkbox";

/**
 * Displays a single task as a list item (read-only on Day 2).
 *
 * @param {object} props
 * @param {{ id: number, title: string, is_complete: boolean, inserted_at?: string }} props.task
 * @param {(id: number) => void} props.onToggleComplete
 * @param {(id: number) => void} props.onDelete
 */

const CustomCheckbox = ({ checked, onChange }) => {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
    />
  );
};

export default CustomCheckbox;
