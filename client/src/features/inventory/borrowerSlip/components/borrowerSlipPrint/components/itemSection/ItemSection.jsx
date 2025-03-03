import { format } from "date-fns";

export default function ItemSection({
  borrowerSlipData,
  equipmentItems,
  materialItems,
}) {
  while (equipmentItems?.length < 5) {
    equipmentItems?.push({
      item_name: "\u00a0",
      item_quantity: "\u00a0",
      released_date: "\u00a0",
      released_status: "\u00a0",
      returned_date: "\u00a0",
      returned_status: "\u00a0",
      item_remarks: "\u00a0",
    });
  }

  while (materialItems?.length < 10) {
    materialItems?.push({
      item_name: "\u00a0",
      item_quantity: "\u00a0",
      released_date: "\u00a0",
      released_status: "\u00a0",
      returned_date: "\u00a0",
      returned_status: "\u00a0",
      item_remarks: "\u00a0",
    });
  }

  return (
    <>
      <article className="border border-x-0 border-t-0">
        <div className="flex items-center text-center">
          <div className="flex h-10 flex-[2] flex-col justify-center">
            <p className="-mb-2 text-base font-bold">SPECIFICATION</p>
            <p className="text-xs italic">(Please write legibly)</p>
          </div>

          <div className="flex h-10 w-24 items-center justify-center border border-y-0">
            <p className="text-base font-bold">Quantity</p>
          </div>
          <div className="flex h-10 flex-1 flex-col items-center justify-center">
            <p className="-mb-3 text-base font-bold">Date</p>
            <p className="text-base font-bold">Released</p>
          </div>
          <div className="flex h-10 w-24 items-center justify-center border border-y-0">
            <p className="text-base font-bold">Status</p>
          </div>
          <div className="flex h-10 flex-1 flex-col items-center justify-center">
            <p className="-mb-3 text-base font-bold">Date</p>
            <p className="text-base font-bold">Returned</p>
          </div>
          <div className="flex h-10 w-24 items-center justify-center border border-y-0">
            <p className="text-base font-bold">Status</p>
          </div>
          <div className="flex h-10 flex-[2] items-center justify-center">
            <p className="text-base font-bold">Remarks</p>
          </div>
        </div>
      </article>

      {/* Items List */}
      <article>
        <h2 className="ml-1 font-semibold uppercase">Equipments</h2>
        {equipmentItems?.map((item, index) => (
          <div
            key={index}
            className={`border border-x-0 ${index > 0 && "border-t-0"}`}
          >
            <div className="flex items-center justify-center">
              <div className="flex flex-[2] flex-col items-start justify-center">
                <p className="pl-2 text-base capitalize">{`${index + 1}. ${
                  item.item_name
                }`}</p>
              </div>

              <div className="flex w-24 items-center justify-center border border-y-0">
                <p className="text-base">{`${item.item_quantity} ${item.item_name.trim() !== "" ? "unit" : ""}`}</p>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <p className="text-base">
                  {item.item_name.trim() !== "" &&
                    format(
                      new Date(borrowerSlipData.released_date),
                      "yyyy-MM-dd",
                    )}
                </p>
              </div>
              <div className="flex w-24 items-center justify-center border border-y-0">
                <p className="text-base">{item.released_status}</p>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <p className="text-base">
                  {item.item_name.trim() !== "" &&
                    format(
                      new Date(borrowerSlipData.returned_date),
                      "yyyy-MM-dd",
                    )}
                </p>
              </div>
              <div className="flex w-24 items-center justify-center border border-y-0">
                <p className="text-base">{item.returned_status}</p>
              </div>
              <div className="flex flex-[2] items-center justify-center">
                <p className="text-base">{item.item_remarks}</p>
              </div>
            </div>
          </div>
        ))}
        <h2 className="ml-1 font-semibold uppercase">Materials/Supplies</h2>
        {materialItems?.map((item, index) => (
          <div
            key={index}
            className={`border border-x-0 ${index > 0 && "border-t-0"}`}
          >
            <div className="flex items-center justify-center">
              <div className="flex flex-[2] flex-col items-start justify-center">
                <p className="pl-2 text-base capitalize">{`${index + 1}. ${
                  item.item_name
                }`}</p>
              </div>

              <div className="flex w-24 items-center justify-center border border-y-0">
                <p className="text-base">{`${item.item_quantity} ${item.item_name.trim() !== "" ? item.item_unit : ""}`}</p>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <p className="text-base">
                  {item.item_name.trim() !== "" &&
                    format(
                      new Date(borrowerSlipData.released_date),
                      "yyyy-MM-dd",
                    )}
                </p>
              </div>
              <div className="flex w-24 items-center justify-center border border-y-0">
                <p className="text-base">{item.released_status}</p>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <p className="text-base">
                  {item.item_name.trim() !== "" &&
                    format(
                      new Date(borrowerSlipData.returned_date),
                      "yyyy-MM-dd",
                    )}
                </p>
              </div>
              <div className="flex w-24 items-center justify-center border border-y-0">
                <p className="text-base">{item.returned_status}</p>
              </div>
              <div className="flex flex-[2] items-center justify-center">
                <p className="text-base">{item.item_remarks}</p>
              </div>
            </div>
          </div>
        ))}
      </article>
    </>
  );
}
