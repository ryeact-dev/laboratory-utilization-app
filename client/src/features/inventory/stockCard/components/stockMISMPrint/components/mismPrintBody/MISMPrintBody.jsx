import mismHeader from "@/assets/mism_header.png";
import { eSign } from "@/lib/helpers/esignatures";
import { addDays, format } from "date-fns";

export default function MISMPrintBody({
  laboratoryNameExtension,
  stockCardItems,
  index,
  mismData,
}) {
  let start = 0;
  let end = 21;

  if (index > 0) {
    start = end * index + 1;
    end = end * (index + 1) + 1;
    console.log(start, end, "index", index);
  }

  while (stockCardItems.length < end) {
    stockCardItems.push({ item_name: null });
  }

  return (
    <div className="break-before-page">
      {/* Header */}
      <header className="-m-1">
        <img
          src={mismHeader}
          alt="mism-header"
          className="w-full object-cover object-center"
        />
      </header>
      {/* Body */}
      <article className="mt-2 border-4 border-black">
        {/* Header */}
        <div className="flex h-16 items-end justify-around gap-2 pb-2 text-xl">
          <div className="flex items-start gap-2">
            <p>College/Department:</p>
            <div>
              <p>{`${mismData.laboratory_name}`}</p>
              <p className="-mt-1 w-full border-b"></p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <p> As of:</p>
            <div>
              <p>
                {format(
                  addDays(new Date(mismData.date_submitted), 1),
                  "MMM dd, yyyy",
                )}
              </p>
              <p className="-mt-1 w-full border-b"></p>
            </div>
          </div>
        </div>

        {/* Item Header */}
        <div className="text-md grid grid-cols-7 divide-x-2 border-y-2">
          <div className="col-span-2 flex items-center justify-center">
            <p className="uppercase">Items/Description</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="uppercase">Unit</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-center uppercase leading-4">Approved Budget</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-center uppercase">Ending Balance</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="uppercase">Variance</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="uppercase leading-3">Remarks</p>
          </div>
        </div>

        {/* Items Section */}
        {stockCardItems.slice(start, end).map((item, index) => (
          <div
            key={index}
            className="grid h-10 grid-cols-7 divide-x-2 border-b-[1px] text-lg"
          >
            <div className="col-span-2 flex items-center">
              <p className="pl-1 capitalize">{item.item_name || ""}</p>
            </div>
            <div className="flex items-center">
              <p className="pl-1 uppercase">{item.item_unit || ""}</p>
            </div>
            <div className="flex items-center">
              <p className="pl-1 text-center capitalize leading-4">
                {item.item_name ? item.approved_budget : ""}
              </p>
            </div>
            <div className="flex items-center">
              <p className="pl-1 text-center capitalize">
                {item.item_name ? item.remaining_balance : ""}
              </p>
            </div>
            <div className="flex items-center pl-1">
              <p className="capitalize">
                {" "}
                {item.item_name
                  ? Number(item.approved_budget) -
                    Number(item.remaining_balance)
                  : `\u00a0`}
              </p>
            </div>
            <div className="flex items-center">
              <p className="pl-1 capitalize">{item.remarks || ""}</p>
            </div>
          </div>
        ))}

        {/* Signatures */}
        <div className="border-b-1 text-md grid grid-cols-3 divide-x-2">
          <div className="flex flex-col justify-end">
            <p className="pl-1">Prepared by:</p>
            <div className="flex flex-col items-center">
              <img
                src={
                  mismData.submitted_esign
                    ? import.meta.env.VITE_LOCAL_BASE_URL +
                      mismData.submitted_esign
                    : eSign("Joe Ritz Bunhayag")
                }
                className="-my-6 h-24 w-32 object-contain object-center"
                alt="personnel-esign"
              />

              <p className="text-xl">
                {mismData.submitted_esign
                  ? mismData.submitted_by
                  : "Joe Ritz Bunhayag"}
              </p>
              <p className="-my-1 w-[80%] border-b"></p>
              <p className="pb-4">Personnel In-Charge</p>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <p className="pl-1">Noted by:</p>
            <div className="flex flex-col items-center">
              {mismData.date_acknowledged ? (
                <img
                  src={eSign("Arnel Ang")}
                  className="-my-6 h-24 w-32 object-contain object-center"
                  alt="head-esign"
                />
              ) : (
                <p className="h-14">{"\u00a0"}</p>
              )}

              <p className="text-xl">Arnel L. Ang</p>
              <p className="-my-1 w-[80%] border-b"></p>
              <p className="pb-4">Head</p>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <p className="pl-1">Physical count conducted by:</p>
            <div className="flex flex-col items-center">
              <p className="h-14">{"\u00a0"}</p>
              <p className="text-xl">{"\u00a0"}</p>
              <p className="-my-1 w-[80%] border-b"></p>
              <p>Signed over printed name</p>
              <p className="-mt-2">(If conducted)</p>
            </div>
          </div>
        </div>
      </article>

      {/* FOOTER */}
      <div className="mt-1 w-full border-b"></div>
      <div className="w-full border-b-4"></div>
      <h2 className="font-serifs ml-4 text-sm font-medium italic">
        F-13050-009/ Rev. #6/ Effectivity: July 23, 2021
      </h2>
    </div>
  );
}
