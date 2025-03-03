import { TableHead, TableHeader, TableRow } from "@/common/ui/table";
import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";

export default function StockCardTableHeader({ isStorage }) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className={TABLE_HEADER_BADGE_CLASS}>
          Item/Description
        </TableHead>
        <TableHead className={`${TABLE_HEADER_BADGE_CLASS} text-center`}>
          Unit
        </TableHead>

        {isStorage && (
          <TableHead className={`${TABLE_HEADER_BADGE_CLASS} text-center`}>
            Approved Budget
          </TableHead>
        )}

        <TableHead className={`${TABLE_HEADER_BADGE_CLASS} text-center`}>
          Ending Balance
        </TableHead>

        {isStorage && (
          <>
            <TableHead className={`${TABLE_HEADER_BADGE_CLASS} text-center`}>
              Variance
            </TableHead>
            <TableHead className={`${TABLE_HEADER_BADGE_CLASS} text-center`}>
              {" "}
              Remarks
            </TableHead>
          </>
        )}

        <TableHead className={`${TABLE_HEADER_BADGE_CLASS} text-center`}>
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
