import borrowerHeader from "@/assets/BorrowerSlip_Header.png";
import HeaderSection from "./components/headerSection/HeaderSection";
import ItemSection from "./components/itemSection/ItemSection";
import UsersSection from "./components/usersSection/UsersSection";
import TermsAndConditions from "./components/termsAndConditions/TermsAndConditions";

export default function BorrowerSlipPrint({
  borrowerSlipData,
  equipmentItems,
  materialItems,
  borrowerSlipUsers,
  componentToPrintRef,
}) {
  const borrowerEsign =
    Number(borrowerSlipData.id_number) > 1
      ? `uploads/img/esign/${borrowerSlipData?.id_number}.webp`
      : borrowerSlipData.instructor_esign;

  const borrowerName =
    Number(borrowerSlipData.id_number) > 1
      ? borrowerSlipData.full_name
      : borrowerSlipData.instructor;

  return (
    <div
      ref={componentToPrintRef}
      className="forPrint bg-white font-[calibri] text-black"
    >
      {/* Header */}
      <header>
        <img
          src={borrowerHeader}
          alt="borrower-header"
          className="object-cover object-center"
        />
      </header>
      {/* Body */}
      <section className="mx-0.5 border-2 border-black">
        {/* Header */}
        <HeaderSection borrowerSlipData={borrowerSlipData} />

        {/* Items Section */}
        <ItemSection
          borrowerSlipData={borrowerSlipData}
          equipmentItems={equipmentItems}
          materialItems={materialItems}
        />

        {/* LEGEND */}
        <article className="flex items-center justify-around border-2 border-x-0 px-6 font-bold">
          <p>Legend:</p>
          <p>1 - Good Condition</p>
          <p>2 - For Replacement</p>
          <p>3 - For Repair</p>
          <p>4 - Consumable</p>
        </article>

        {/* USERS */}
        <UsersSection
          borrowerEsign={borrowerEsign}
          borrowerName={borrowerName}
          borrowerSlipData={borrowerSlipData}
          borrowerSlipUsers={borrowerSlipUsers}
        />

        {/* TERMS AND CONDITIONS */}
        <TermsAndConditions
          borrowerEsign={borrowerEsign}
          borrowerName={borrowerName}
          borrowerSlipData={borrowerSlipData}
        />
      </section>

      {/* FOOTER */}
      <div className="mx-1">
        <div className="mt-1 w-full border-b"></div>
      </div>
      <div className="mx-1">
        <div className="w-full border-b-4"></div>
      </div>
      <h2 className="font-serifs ml-4 text-sm font-medium italic">
        F-13050-009/ Rev. #6/ Effectivity: July 23, 2021
      </h2>
    </div>
  );
}
