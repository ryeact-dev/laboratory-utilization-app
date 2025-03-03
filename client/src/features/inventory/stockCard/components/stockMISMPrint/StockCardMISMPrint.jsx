import {
  useGetPaginatedLaboratoryStockCards,
  useGetPaginatedOfficeStockCards,
} from "@/hooks/stockCard.hook";
import MISMPrintBody from "./components/mismPrintBody/MISMPrintBody";

export default function StockCardMISMPrint({ componentToPrintRef, mismData }) {
  const category = mismData.laboratory_name.includes("Office") ? "Office" : "";

  const { data: listOfOfficeStockCards } = useGetPaginatedOfficeStockCards(
    mismData.laboratory_name,
    category,
    0,
    200,
    "1",
    mismData.date_submitted,
  );

  const { data: listOfLabStockCards } = useGetPaginatedLaboratoryStockCards(
    mismData.laboratory_name,
    category,
    0,
    200,
    "2",
    mismData.date_submitted,
  );

  const listOfStockCards =
    category === "Office" ? listOfOfficeStockCards : listOfLabStockCards;

  const pageNumber = Math.ceil(listOfStockCards?.stockCards.length / 22);

  const pageArray = Number(pageNumber) > 0 ? Array(pageNumber)?.fill(null) : [];

  return (
    <div
      ref={componentToPrintRef}
      className="forPrint bg-white font-[calibri] text-black"
    >
      {pageArray.map((_, index) => (
        <MISMPrintBody
          key={index}
          mismData={mismData}
          laboratoryNameExtension="Office Stocks"
          stockCardItems={listOfStockCards?.stockCards}
          index={index}
        />
      ))}
    </div>
  );
}
