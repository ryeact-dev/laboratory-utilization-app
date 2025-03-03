const stepsHeader = ["Create", "Release", "Return"];

export default function SingleBorrowerSteps({ stepsHeader, singleReport }) {
  const stepsStatus = (index) => {
    let className = "step-secondary";
    let mark = "✕";

    // If undefined/empty, it means that the report has not been submitted
    if (!singleReport) {
      return { className, mark };
    }

    if (singleReport?.step >= index) {
      className = "step-primary";
      mark = "✓";
      return { className, mark };
    } else {
      return { className, mark };
    }
  };

  return (
    <div className="flex w-full justify-center">
      <ul className="steps steps-vertical lg:steps-horizontal w-[80%]">
        {stepsHeader.map((step, index) => (
          <li
            key={index}
            className={`step ${stepsStatus(index + 1).className} `}
            data-content={`${stepsStatus(index + 1).mark}`}
          >
            <p className="-mt-2 text-sm">{step}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
