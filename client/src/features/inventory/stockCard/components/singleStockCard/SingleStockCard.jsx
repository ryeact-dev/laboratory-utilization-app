import TitleCard from "@/common/titleCard/TitleCard";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { modalStore } from "@/store";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";

import { useGetStockCardItems } from "@/hooks/stockCard.hook";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import SingleStockCardTable from "./components/singleStockCardTable/SingleStockCardTable";
import PrintSingleStockCard from "./components/printSingleStockCard/PrintSingleStockCard";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
import { Button } from "@/common/ui/button";
import { Badge } from "@/common/ui/badge";
import { ArrowLeft, Printer } from "lucide-react";

export default function SingleStockCard() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const componentToPrintRef = useRef(null);

  const openModal = modalStore((state) => state.openModal);
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
  });

  const page = searchParams.get("page");

  let category = "laboratory_released";
  switch (state?.tab) {
    case "1":
      category = "office";
      break;
    case "2":
      category = "laboratory";
      break;
    default:
      break;
  }

  // (stockcardId, category, page, limit)
  const { data: stockCardItems } = useGetStockCardItems(
    state.id,
    category,
    Number(page - 1),
    33,
  );

  // Creates array of pages for printing stock card items

  const pageNumber = Math.ceil(stockCardItems?.items.length / 30);
  const pageArray = Number(pageNumber) > 0 ? Array(pageNumber)?.fill(null) : [];

  const onAddReleaseStockCardItems = (isAddItem) => {
    if (!isAddItem && Number(stockCardItems?.stockCardTotalBalance) === 0) {
      return ToastNotification("error", "Please replenish the item first");
    }

    const type = isAddItem ? "STOCK_CARD_ADD_ITEM" : "STOCK_CARD_RELEASE_ITEM";

    // const itemArrayLength = stockCardItems?.items.length;
    // if descending order
    // const stockItemBalance =
    //   stockCardItems?.items.length > 0
    //     ? stockCardItems?.items[itemArrayLength - 1]?.item_balance
    //     : 0;

    // if asscending order
    let stockItemBalance =
      stockCardItems?.items.length > 0
        ? Number(state.tab) === 0
          ? stockCardItems.stockCardTotalBalance
          : stockCardItems?.items[0]?.item_balance
        : 0;

    // stockItemBalance =
    //   Number(state.tab) === 0
    //     ? stockCardItems.stockCardTotalBalance
    //     : stockItemBalance;

    const payload = {
      title: `${isAddItem ? "Receive" : "Issue"} Items`,
      bodyType: MODAL_BODY_TYPES[type],
      extraObject: {
        stockCardData: state,
        totalBalance: stockCardItems.stockCardTotalBalance,
        stockItemBalance,
        category,
      },
    };
    openModal(payload);
  };

  const printResultsBtn = (
    <Button>
      <Printer size={18} strokeWidth={2.5} className="" />
      Print Stock Card
    </Button>
  );

  const reactToPrintBtn = (
    <ReactToPrint
      trigger={() => printResultsBtn}
      content={() => componentToPrintRef.current}
    />
  );

  const onClickBack = (evt) => {
    evt.preventDefault();
    navigate(-1);
  };

  const titleHeader = (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-1">
          <Button onClick={onClickBack} variant="ghost">
            <ArrowLeft className="size-6" />
          </Button>
          <p className="font-medium capitalize xl:text-lg 2xl:text-xl">{`${state.item_name} - ( ${state.item_unit} )`}</p>
        </div>
        <div className="mt-1 flex gap-2 uppercase">
          <Badge className="h-5 border-white bg-white/10 px-4 text-xs text-white hover:bg-white/10">
            Item Balance: {stockCardItems?.stockCardTotalBalance || 0}
          </Badge>
          <Badge className="h-5 border-secondary bg-secondary/10 px-4 text-xs text-secondary hover:bg-secondary/10">{`${state.item_category} Supply`}</Badge>
          <Badge className="h-5 border-green-500 bg-green-500/10 px-4 text-xs uppercase text-green-500 hover:bg-green-500/10">
            {category === "laboratory" ? "Storage Supply" : "Released Supply"}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* {reactToPrintBtn} */}
        {Number(state.tab) > 0 && (
          <Button
            variant="secondary"
            onClick={() => onAddReleaseStockCardItems(true)}
          >
            Recieve Items
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={() => onAddReleaseStockCardItems(false)}
        >
          Issue Items
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <TitleCard
        title={titleHeader}
        width={"min-w-[1200px]"}
        topMargin={"-mt-2"}
      >
        <div></div>
        <SingleStockCardTable
          stockCardItems={stockCardItems}
          state={state}
          category={category}
          openModal={openModal}
        />
      </TitleCard>

      {/* Printing Stock Card */}
      <div
        ref={componentToPrintRef}
        className="forPrint bg-white font-[calibri] text-black"
      >
        {pageArray.map((_, index) => (
          <PrintSingleStockCard
            key={index}
            itemName={state.item_name}
            itemUnit={state.item_unit}
            stockCardItems={stockCardItems?.items}
            index={index}
          />
        ))}
      </div>
    </>
  );
}
