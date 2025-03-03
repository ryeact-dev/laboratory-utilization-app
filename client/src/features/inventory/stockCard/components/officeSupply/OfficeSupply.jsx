import { useGetPaginatedOfficeStockCards } from "@/hooks/stockCard.hook";
import StockCardOptions from "../stockCardOptions/StockCardOptions";
import StockCardTableHeader from "../stockCardTableHeader/StockCardTableHeader";
import StockCardHeader from "../stockCardHeader/StockCardHeader";
import { LIST_OF_ALLOWED_USERS } from "@/globals/initialValues";
import { Card, CardContent } from "@/common/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/common/ui/table";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";

export default function OfficeSupply({
  tab,
  onPageClick,
  page,
  currentUser,
  laboratory, // serve as office for office supply
  setSearchParams,
  search,
  submissionDate,
  onDateChange,
  lastDayOfTheMonth,
  formattedDate,
}) {
  const selectedOffice =
    currentUser.role === "Admin" || currentUser.role === "Dean"
      ? laboratory
      : currentUser.office;

  const {
    data: listOfStockCards,
    isPlaceholderData,
    isLoading,
  } = useGetPaginatedOfficeStockCards(
    selectedOffice, // User offices
    "Office",
    Number(page) - 1,
    23,
    tab,
    submissionDate,
    search,
  );

  const isUserAllowedOptions = LIST_OF_ALLOWED_USERS.includes(
    currentUser?.role,
  );

  return (
    <div className="mt-6 overflow-hidden">
      <StockCardHeader
        onPageClick={onPageClick}
        page={page}
        isPlaceholderData={isPlaceholderData}
        hasMore={listOfStockCards?.hasMore}
        isLaboratory={false}
        currentUser={currentUser}
        setSearchParams={setSearchParams}
        laboratory={laboratory}
        tab={tab}
        submissionDate={submissionDate}
        onDateChange={onDateChange}
        lastDayOfTheMonth={lastDayOfTheMonth}
        formattedDate={formattedDate}
      />

      <Card className="border-none">
        <CardContent className="px-0">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Table>
              <StockCardTableHeader
                currentUser={currentUser}
                isStorage={true}
              />
              <TableBody style={{ fontFamily: "Roboto Mono" }}>
                {listOfStockCards?.stockCards?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="font-medium uppercase text-secondary">
                        {item.item_name}
                      </p>
                      <p className="text-xs uppercase text-gray-100/70">
                        {item.laboratory_name}
                      </p>
                    </TableCell>

                    <TableCell className="text-center text-xs uppercase">
                      {item.item_unit}
                    </TableCell>

                    <TableCell className="text-center">
                      {item.approved_budget}
                    </TableCell>

                    <TableCell className="text-center">
                      {item.remaining_balance}
                    </TableCell>

                    <TableCell className="text-center">
                      {Number(item.approved_budget) -
                        Number(item.remaining_balance)}
                    </TableCell>

                    <TableCell className="">
                      <div className="w-36 text-center">
                        <p className="text-xs">{item.remarks || "-"}</p>
                      </div>
                    </TableCell>

                    {/* <TableCell className="text-center">
                    {item.laboratory_name || "-"}
                  </TableCell> */}

                    <TableCell className="flex justify-center">
                      {isUserAllowedOptions && (
                        <StockCardOptions
                          submissionDate={submissionDate}
                          item={item}
                          tab={tab}
                          laboratory={laboratory}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
