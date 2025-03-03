import { useGetPaginatedLaboratoryStockCards } from "@/hooks/stockCard.hook";
import StockCardOptions from "../stockCardOptions/StockCardOptions";
import StockCardTableHeader from "../stockCardTableHeader/StockCardTableHeader";
import StockCardHeader from "../stockCardHeader/StockCardHeader";
import { useState } from "react";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import { Card, CardContent } from "@/common/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/common/ui/table";
import { LIST_OF_ALLOWED_USERS } from "@/globals/initialValues";

export default function LaboratorySupply({
  tab,
  onPageClick,
  laboratory,
  page,
  currentUser,
  setSearchParams,
  search,
  submissionDate,
  onDateChange,
  lastDayOfTheMonth,
  formattedDate,
}) {
  const [category, setCategory] = useState("");

  const {
    data: listOfStockCards,
    isPlaceholderData,
    isLoading,
  } = useGetPaginatedLaboratoryStockCards(
    laboratory,
    category,
    Number(page) - 1,
    50,
    tab,
    submissionDate,
    search,
  );

  const onCategoryChange = (selectedCategory) => {
    let value = selectedCategory;
    if (selectedCategory === "Storage" || selectedCategory === "All")
      value = "";
    setCategory(value);
  };

  const isStorage = category.trim() === "";

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
        tab={tab}
        onCategoryChange={onCategoryChange}
        category={category}
        currentUser={currentUser}
        search={search}
        setSearchParams={setSearchParams}
        laboratory={laboratory}
        submissionDate={submissionDate}
        onDateChange={onDateChange}
        lastDayOfTheMonth={lastDayOfTheMonth}
        formattedDate={formattedDate}
      />

      {laboratory.trim() !== "" && isLoading ? (
        <LoadingSpinner />
      ) : laboratory.trim() !== "" &&
        !isLoading &&
        listOfStockCards?.stockCards.length === 0 ? (
        <p className="my-4 text-center">No Data to be displayed</p>
      ) : (
        <Card className="border-none">
          <CardContent className="px-0">
            <Table>
              <StockCardTableHeader
                currentUser={currentUser}
                isStorage={isStorage}
              />
              <TableBody style={{ fontFamily: "Roboto Mono" }}>
                {listOfStockCards?.stockCards?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="uppercase text-secondary">
                        {item.item_name} - {item.item_category}
                      </p>
                      <p className="text-xs uppercase text-gray-100/80">
                        {item.laboratory_name}
                      </p>
                    </TableCell>

                    <TableCell className="text-center text-xs uppercase">
                      {item.item_unit}
                    </TableCell>

                    {isStorage && (
                      <TableCell className="text-center">
                        {item.approved_budget}
                      </TableCell>
                    )}

                    <TableCell className="text-center">
                      {item.remaining_balance}
                    </TableCell>

                    {isStorage && (
                      <>
                        <TableCell className="text-center">
                          {Number(item.approved_budget) -
                            Number(item.remaining_balance)}
                        </TableCell>

                        <TableCell className="">
                          <div className="w-36 text-center">
                            <p className="text-xs">{item.remarks || "-"}</p>
                          </div>
                        </TableCell>
                      </>
                    )}

                    {/* <TableCell className="text-center">
                      {item.laboratory_name || "-"}
                    </TableCell> */}

                    <TableCell className="flex justify-center">
                      {isUserAllowedOptions && (
                        <StockCardOptions
                          submissionDate={submissionDate}
                          laboratoryCategory={category}
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
