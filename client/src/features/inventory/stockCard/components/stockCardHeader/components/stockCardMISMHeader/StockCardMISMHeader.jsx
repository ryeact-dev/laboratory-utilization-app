import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/select";

export default function StockCardMISMHeader({ onCategoryChange, category }) {
  const STATUS_TYPE = [
    { label: "All", value: 0 },
    { label: "Submitted", value: 1 },
    { label: "Acknowledged", value: 2 },
  ];

  return (
    <Select onValueChange={onCategoryChange} value={category}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Select Stock Type" />
      </SelectTrigger>
      <SelectContent>
        {STATUS_TYPE.map((statusType, k) => {
          return (
            <SelectItem value={statusType.value} key={k}>
              {statusType.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
