export default function StudentsClasslistCard({
  paginatedClasslist,
  attendance,
  togglePresentAbsent,
  usageId,
}) {
  // RENDER SECTION
  return (
    <div className="grid grid-cols-3 gap-2">
      {paginatedClasslist?.students.map(({ full_name, id_number }, index) => (
        <button
          type="button"
          onClick={() => togglePresentAbsent(usageId, index, attendance[index])}
          key={index}
          className={`relative flex min-h-[60px] items-center gap-2 overflow-hidden rounded-lg border-[1px] px-2 py-1 ${
            attendance[index] === "true"
              ? "hover:bg-green-600/50"
              : "hover:bg-primary/50"
          } ${
            attendance[index] === "true"
              ? "border-green-600 bg-green-600/30"
              : "border-primary bg-primary/30"
          } transition duration-200 ease-in`}
        >
          <div
            className={`absolute left-0 top-0 z-[-1] h-full w-8 ${
              attendance[index] === "true" ? "bg-green-600" : "bg-primary"
            }`}
          ></div>
          <div className="flex items-center gap-3">
            <div className="-ml-0.5 text-center font-medium">
              <p className="-mb-1 text-sm">PC</p>
              <p>{index + 1 < 10 ? "0" + (index + 1) : index + 1}</p>
            </div>
          </div>
          <div className="space-y-0 pl-2 text-left text-sm font-medium leading-4">
            <p>{`${id_number} `}</p>
            <p className="uppercase">{full_name}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
