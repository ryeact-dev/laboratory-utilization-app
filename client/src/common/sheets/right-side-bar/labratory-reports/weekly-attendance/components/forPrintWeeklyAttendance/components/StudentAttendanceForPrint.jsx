export default function StudentAttendanceForPrint({
  page,
  subjectClasslist,
  listOfAggregatedUsage,
  studentWorkstationNumber,
}) {
  // RENDER SECTION
  return (
    <div className="-mt-1 border-2 border-gray-800">
      {subjectClasslist.map(({ full_name, id_number }, index) => (
        <article
          key={index}
          className="flex w-full items-center justify-stretch"
        >
          <div className="flex w-full min-w-[232px] items-center justify-start gap-2 border-b border-l border-gray-800">
            <h2 className="w-10 pl-2">
              {`${
                index < 9 && page === 0
                  ? `0${studentWorkstationNumber(index + 1)}`
                  : `${studentWorkstationNumber(index + 1)}`
              }`}
            </h2>
            <h2 className="text-left">{full_name ? full_name : ""}</h2>
          </div>
          {listOfAggregatedUsage[0].usage_details.map((usage, usageIndex) => (
            <div
              key={usageIndex}
              className={`w-96 border-b border-l border-gray-800 text-center ${
                usageIndex === listOfAggregatedUsage[0].usage_details.length - 1
                  ? "border-r"
                  : ""
              }`}
            >
              <div className="flex h-6 w-full items-center justify-center">
                {usage.date && (
                  <p className="text-xs">
                    {!usage.students_attendance[
                      studentWorkstationNumber(index)
                    ] && full_name ? (
                      "Absent"
                    ) : usage.students_attendance[
                        studentWorkstationNumber(index)
                      ] === "true" ? (
                      <img
                        src={
                          import.meta.env.VITE_LOCAL_BASE_URL +
                          `uploads/img/esign/${id_number}.webp`
                        }
                        className="h-5 w-full object-fill object-center px-2 py-1"
                      />
                    ) : usage.students_attendance[
                        studentWorkstationNumber(index)
                      ] === "false" ? (
                      "Absent"
                    ) : (
                      "\u00a0\u00a0"
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </article>
      ))}
    </div>
  );
}
