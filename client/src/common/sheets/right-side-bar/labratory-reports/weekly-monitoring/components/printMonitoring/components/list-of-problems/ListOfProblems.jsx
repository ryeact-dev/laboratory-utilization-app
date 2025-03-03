export default function ListOfProblems({ singleMonitoringData, usageDate }) {
  const filterData = singleMonitoringData?.filter(
    (item) =>
      item.remark !== "Internet Speed" &&
      item.remark !== "No problems found" &&
      item.created_at === usageDate,
  );

  while (filterData?.length < 9) {
    filterData.push({ remark: null, unit_number: 0 });
  }

  return (
    <div className="ml-8 mt-10">
      {filterData?.map((item, index) => (
        <div key={index} className="-mt-1 flex items-center gap-4">
          <div className="w-10">
            <p>
              {Number(item.unit_number) === 0
                ? "\u00a0"
                : Number(item.unit_number) < 10
                  ? `0${Number(item.unit_number)}`
                  : item.unit_number}
            </p>
          </div>

          <p className="w-8 pl-2">
            {item.remark ? item.remark.toString().slice(0, 1) : "\u00a0"}
          </p>
          <p className="w-24 pl-2">
            {item.ticket_no ? item.ticket_no : "\u00a0"}
          </p>
        </div>
      ))}
    </div>
  );
}
