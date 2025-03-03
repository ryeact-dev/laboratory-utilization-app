export default function Stepper({ steps, singleReport }) {
  const stepsStatus = (index) => {
    let className = "bg-primary";
    let mark = "✕";
    let status = "Submitted";

    // If undefined/empty, it means that the report has not been submitted
    if (!singleReport) {
      return { className, mark };
    }

    if (singleReport?.step >= index) {
      className = "bg-green-500";
      mark = "✓";

      const status = singleReport?.step === 1 ? "Submitted" : "Acknowledged";

      return { className, mark, status };
    } else {
      return { className, mark, status };
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-[80%] items-center justify-center px-4 pt-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-white ${stepsStatus(index + 1).className}`}
              >
                {stepsStatus(index + 1).mark}
              </div>
              <div className="mt-2 w-20 text-center text-sm font-normal tracking-wide">
                <p>{step}</p>
                <p className={`text-xs text-foreground/80`}>
                  {/* {stepsStatus(index + 1)?.status} */}
                </p>
              </div>
            </div>
            {index < 2 && (
              <div
                className={`-mt-6 h-1 w-20 rounded-lg ${stepsStatus(index + 2).className}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
