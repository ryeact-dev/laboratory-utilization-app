import { Button } from "@/common/ui/button";
import { Card, CardContent } from "@/common/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";
import { format } from "date-fns";
import SingleStockCardOptions from "../single-stack-card-options/SingleStockCardOptions";

export default function SingleStockCardTable({
  stockCardItems,
  category,
  state,
  openModal,
}) {
  return (
    <Card>
      <CardContent className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_HEADER_BADGE_CLASS}>PRS #</TableHead>
              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Date Requested
              </TableHead>
              <TableHead className={TABLE_HEADER_BADGE_CLASS}>MSIS #</TableHead>

              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Date Received
              </TableHead>

              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Date Issued
              </TableHead>

              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Issue to
              </TableHead>

              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Balance
              </TableHead>

              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockCardItems?.items?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="">{item.prs_number || "-"}</TableCell>

                <TableCell className="">
                  {item.prs_number ? (
                    <>
                      <p>
                        {item.date_requested
                          ? format(
                              new Date(item.date_requested),
                              "MMM dd, yyyy",
                            )
                          : "-"}
                      </p>
                      <p>Qty: {item.item_quantity}</p>
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell>{item.msis_number || "-"}</TableCell>

                <TableCell>
                  {Number(item.item_received) > 0 ? (
                    <>
                      <p>
                        {item.date_received
                          ? format(new Date(item.date_received), "MMM dd, yyyy")
                          : "-"}
                      </p>
                      <p>Qty: {item.item_received}</p>
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell className="flex flex-col">
                  {item.date_released ? (
                    <>
                      <p className="flex-1 opacity-80">
                        {format(new Date(item.date_released), "MMM dd, yyyy")}
                      </p>
                      <p className="flex-1">Qty: {item.item_released}</p>
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell> {item.released_to || "-"}</TableCell>

                <TableCell>{item.item_balance}</TableCell>

                <TableCell>
                  <SingleStockCardOptions
                    openModal={openModal}
                    stockCardItems={stockCardItems}
                    state={state}
                    category={category}
                    item={item}
                    index={index}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
