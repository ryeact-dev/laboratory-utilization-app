import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/select";

const STORAGE_TYPE = ["Storage", "Consumable", "Reusable"];

export default function StockCardLabHeader({ onCategoryChange }) {
  return (
    <Select onValueChange={onCategoryChange} defaultValue="Storage">
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Select Stock Type" />
      </SelectTrigger>
      <SelectContent>
        {/* {wasAcknowledged && <option value="">Select All Laboratories</option>} */}
        {STORAGE_TYPE.map((storageType, k) => {
          return (
            <SelectItem value={storageType} key={k}>
              {storageType}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
