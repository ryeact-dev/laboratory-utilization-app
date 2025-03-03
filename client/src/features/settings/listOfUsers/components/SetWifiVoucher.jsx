import BottomButtons from "@/common/buttons/BottomButtons";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import {
  useGetLabWifiVouchers,
  useUpdateWifiVoucher,
} from "@/hooks/wifiVouchers.hook";

import { useEffect, useState } from "react";

export default function SetWifiVoucher({ closeModal }) {
  const { currentUser } = useGetCurrentUserData();

  const { mutate: addLaboratoryWifiVoucherMutation, isPending } =
    useUpdateWifiVoucher(closeModal);

  const { isLoading, data: listOfVouchers = [] } = useGetLabWifiVouchers({
    laboratory: currentUser?.laboratory,
  });

  const INITIAL_DATA = listOfVouchers?.map((lab) => {
    return {
      laboratory: lab.laboratory,
      voucher_code: lab.voucher_code,
    };
  });

  const [labVoucher, setLabVoucher] = useState(INITIAL_DATA);

  const onChangeHandler = (evt) => {
    const inputId = evt.target.id;
    const value = evt.target.value;

    const arrayIndex = labVoucher.findIndex(
      (lab) => lab.laboratory === inputId,
    );
    const updatedData = labVoucher.map((lab, index) =>
      index === arrayIndex ? { ...lab, voucher_code: value } : lab,
    );

    setLabVoucher(updatedData);
  };

  const onSubmitHandle = (evt) => {
    evt.preventDefault();
    addLaboratoryWifiVoucherMutation({ forAddingData: labVoucher });
  };

  useEffect(() => {
    if (listOfVouchers.length === 0) return;

    const newData = listOfVouchers?.map((lab) => {
      return {
        laboratory: lab.laboratory,
        voucher_code: lab.voucher_code,
      };
    });

    setLabVoucher(newData);
  }, [listOfVouchers.length]);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {!isLoading && listOfVouchers.length === 0 && (
        <NoRecordsFound>No Records Found</NoRecordsFound>
      )}
      {!isLoading && listOfVouchers.length > 0 && (
        <form onSubmit={onSubmitHandle}>
          {listOfVouchers.map((voucher, index) => (
            <div key={index}>
              <Label>{voucher.laboratory}</Label>
              <Input
                onChange={onChangeHandler}
                id={voucher.laboratory}
                value={labVoucher[index]?.voucher_code || ""}
              />
            </div>
          ))}
          <BottomButtons
            closeModal={closeModal}
            isLoading={isPending}
            isPayload={false}
          />
        </form>
      )}
    </>
  );
}
