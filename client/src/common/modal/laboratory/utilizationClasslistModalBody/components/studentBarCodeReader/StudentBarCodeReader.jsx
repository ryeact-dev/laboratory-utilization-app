import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { Input } from "@/common/ui/input";
import { useState } from "react";

function StudentBarCodeReader({
  attendance,
  paginatedClasslist,
  togglePresentAbsent,
  usageId,
}) {
  const [IDBarcode, setIDBarcode] = useState("");

  // BARCODE SCANNER OFTEN SEND A SPECIAL CHARACTER (LIKE A NEWLINE \n OR CARRIAGE RETURN \r)
  // AFTER SCANNING A BARCODE TO SIGNIFY THE END OF THE INPUT
  const onIDNumberChange = (evt) => {
    const value = evt.target.value;
    setIDBarcode(value);
  };

  const handleBarcodeInput = (evt) => {
    if (evt.key === "Enter") {
      evt.preventDefault();

      const removedSOnIDBarcode = IDBarcode.toUpperCase().split("S")[1];
      const IDNumber = removedSOnIDBarcode ? removedSOnIDBarcode : IDBarcode;

      const index = paginatedClasslist?.students.findIndex(
        (student) => Number(student.id_number) === Number(IDNumber),
      );

      if (index >= 0) {
        togglePresentAbsent(usageId, index, attendance[index]);
      } else {
        ToastNotification("error", "Student ID Number is not on the list");
      }

      setIDBarcode("");
    }
  };

  // RENDER SECTION
  return (
    <Input
      className="h-12"
      type="text"
      id="barcode"
      value={IDBarcode || ""}
      placeholder="Enter ID Number"
      onKeyDown={handleBarcodeInput}
      onChange={onIDNumberChange}
      autoFocus
    />
  );
}

export default StudentBarCodeReader;
