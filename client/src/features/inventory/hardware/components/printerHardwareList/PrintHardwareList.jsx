import { eSign } from "@/lib/helpers/esignatures";
import { format, parseISO } from "date-fns";

export default function PrintHardwareList({
  listOfHardwares,
  title,
  laboratory,
  currentUser,
  index,
}) {
  let start = 0;
  let end = 6;

  if (index > 0) {
    start = index * 6;
    end = end * (index + 1);
  }

  while (listOfHardwares?.length < end) {
    listOfHardwares.push({ property_number: null });
  }

  return (
    <>
      <div className="!mb-7 flex w-full flex-col items-center">
        <h2 className="text-xl font-bold">{laboratory}</h2>
        <p className="text-xl">{title}</p>
      </div>
      <div className="flex w-full flex-row border md:flex-col">
        <div className="grid h-12 grid-cols-8 divide-x-2 text-center">
          <div
            className={`col-span-1 flex items-center justify-center text-base font-semibold`}
          >
            <h2>Property No.</h2>
          </div>

          <div
            className={`col-span-2 flex items-center justify-center text-base font-semibold`}
          >
            <h2>Specifications</h2>
          </div>

          <div
            className={`col-span-1 flex items-center justify-center text-base font-semibold`}
          >
            <h2>Date Acquired</h2>
          </div>

          <div
            className={`col-span-1 flex items-center justify-center text-base font-semibold`}
          >
            <h2>Date Upgraded</h2>
          </div>

          <div
            className={`col-span-2 flex items-center justify-center text-base font-semibold`}
          >
            <h2> Update Details</h2>
          </div>

          <div
            className={`col-span-1 flex items-center justify-center text-base font-semibold`}
          >
            <h2 className="leading-4">Date of Obsolescence</h2>
          </div>
        </div>

        {listOfHardwares?.slice(start, end).map((hardware, index) => {
          return (
            <div
              key={index}
              className={`grid h-full min-h-[96px] w-full grid-cols-8 divide-x-2 border-t-2 text-center ${
                index % 2 === 0 ? "bg-base-100/5" : ""
              } ${(index + 1) % 7 === 0 ? "break-after-page" : ""} `}
            >
              <div className={`col-span-1 flex items-center justify-center`}>
                <p>{hardware.property_number || `\u00a0`}</p>
              </div>

              <div className={`col-span-2 flex items-center justify-center`}>
                <p className="break-words px-2">{hardware.specs || ""}</p>
              </div>

              <div
                className={`col-span-1 flex h-full items-center justify-center`}
              >
                <p>
                  {hardware.property_number
                    ? format(parseISO(hardware.date_acquired), "MMM dd, yyyy")
                    : ""}
                </p>
              </div>

              <div className={`col-span-1 flex items-center justify-center`}>
                {hardware.property_number ? (
                  <h2>
                    {hardware?.hardware_upgrades?.length > 0
                      ? hardware?.hardware_upgrades?.map(
                          ({ date_upgraded }, i) => (
                            <p key={i}>
                              {format(new Date(date_upgraded), "MMM dd, yyyy")}
                            </p>
                          ),
                        )
                      : "No upgrades"}
                  </h2>
                ) : (
                  ""
                )}
              </div>

              <div
                className={`col-span-2 flex items-center justify-center border-y-0`}
              >
                {hardware.property_number ? (
                  <h2 className="break-words">
                    {hardware?.hardware_upgrades?.length > 0
                      ? hardware?.hardware_upgrades?.map(
                          ({ upgrade_details }, i) => (
                            <p key={i}>{upgrade_details}</p>
                          ),
                        )
                      : "N/A"}
                  </h2>
                ) : (
                  ""
                )}
              </div>

              <div className={`col-span-1 flex items-center justify-center`}>
                <p>
                  {hardware.property_number
                    ? format(hardware.obsolesenceDate, "MMM dd, yyyy")
                    : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <footer className="mt-6 flex items-start justify-center px-8">
        <div className="w-full">
          <p>Prepared by:</p>
          <div className="mt-10 flex flex-col justify-end">
            <img
              src={eSign(currentUser.fullName)}
              className="h-14 w-24 object-contain object-bottom"
            />
            <h2 className="-mb-1 text-lg font-bold">{currentUser.fullName}</h2>
            <p>Laboratory Custodian</p>
          </div>
        </div>
        <div className="w-full">
          <p>Noted by:</p>
          <div className="mt-10 flex flex-col justify-end">
            <img
              src={eSign("Arnel Ang")}
              className="h-14 w-24 object-contain object-bottom"
            />
            <h2 className="-mb-1 text-lg font-bold">Arnel Ang</h2>
            <p>LMO - Supervisor</p>
          </div>
        </div>
      </footer>
    </>
  );
}
