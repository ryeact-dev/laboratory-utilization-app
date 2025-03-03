import stockcardHeader from "@/assets/stockcard_header.png";
import { addDays, format } from "date-fns";

export default function PrintSingleStockCard({
  itemName,
  itemUnit,
  stockCardItems,
  index,
}) {
  let start = 0;
  let end = 29;

  if (index > 0) {
    start = end;
    end = end * (index + 1) + 1;
  }

  let stockCardItemsCopy = [...stockCardItems];

  while (stockCardItemsCopy.length < end) {
    stockCardItemsCopy.push({ item_name: null });
  }

  return (
    <div className="break-before-page">
      {/* Header */}
      <header className="-m-1">
        <img
          src={stockcardHeader}
          alt="mism-header"
          className="w-full object-cover object-center"
        />
      </header>
      {/* Body */}
      <article className="mt-2 border-2 border-black">
        {/* Item Header */}
        <div className="p-2 pt-6 text-xl font-semibold">
          ITEM: {itemName} - {itemUnit}{" "}
        </div>
        <div className="text-md grid grid-cols-9 divide-x border-y bg-grey-1000 text-sm">
          <div className="flex items-center justify-center">
            <p className="uppercase">Date Requested</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="uppercase">PRS #</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-center uppercase leading-4">QTY.</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-center uppercase">Date Received</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="uppercase">MSIS #</p>
          </div>
          <div className="col-span-3 text-center">
            <div className="gird-cols-3 grid">
              <div className="col-span-3 border-b">Quantity</div>
              <div>Received</div>
              <div className="border-x">Issueance</div>
              <div>Balance</div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <p className="uppercase">Issued to/Date</p>
          </div>
        </div>

        {/* Items Section */}
        {stockCardItemsCopy.slice(start, end).map((item, index) => (
          <div
            key={index}
            className="grid h-10 grid-cols-9 divide-x border-b text-lg"
          >
            {/* PRS Info */}
            <div className="flex items-center px-1">
              <p>
                {item.prs_number
                  ? format(new Date(item.date_requested), "MM-dd-yy")
                  : ""}
              </p>
            </div>
            <div className="flex items-center">
              <p className="px-1"> {item.prs_number || " "}</p>
            </div>
            <div className="flex items-center">
              <p className="px-1">
                {item.prs_number ? item.item_quantity : " "}
              </p>
            </div>

            {/* MSIS Info */}
            <div className="flex items-center">
              <p className="px-1">
                {item.date_received
                  ? format(new Date(item.date_received), "MM-dd-yy")
                  : " "}
              </p>
            </div>
            <div className="flex items-center">
              <p className="px-1">{item.msis_number || " "}</p>
            </div>

            {/* Quantity */}
            <div className="flex items-center">
              <p className="px-1">
                {item.msis_number ? item.item_received : " "}
              </p>
            </div>
            <div className="flex items-center">
              <p className="px-1">{item.item_released || " "}</p>
            </div>
            <div className="flex items-center">
              <p className="px-1">{item.item_balance || " "}</p>
            </div>

            {/* Issues to and Date Issued */}
            <div className="text-sm font-semibold">
              <p className="px-1">{item.released_to || " "}</p>
              <p className="-mt-1 px-1">
                {item.date_released
                  ? format(new Date(item.date_released), "MM-dd-yy")
                  : ""}
              </p>
            </div>
          </div>
        ))}
      </article>

      {/* FOOTER */}
      <div className="mt-1 w-full border-b"></div>
      <div className="w-full border-b-2"></div>
      <h2 className="mt-2 font-serifs text-sm font-medium italic">
        F-16405-010/ Rev. #1/ Effectivity: August 12, 2016
      </h2>
    </div>
  );
}
