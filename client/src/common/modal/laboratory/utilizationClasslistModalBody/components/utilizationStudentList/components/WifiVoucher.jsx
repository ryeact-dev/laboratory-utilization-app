import { useGetSingleLabWifiVoucher } from "@/hooks/wifiVouchers.hook";

import { useState } from "react";
import { Eye, EyeOff, Wifi } from "lucide-react";
import { Label } from "@/common/ui/label";

export default function WifiVoucher({ laboratory }) {
  const [viewVoucher, setViewVoucher] = useState(false);

  const { isLoading, data: singleLabVoucer = [] } =
    useGetSingleLabWifiVoucher(laboratory);

  const wifiVoucher = isLoading
    ? "Loading..."
    : !isLoading && singleLabVoucer.length > 0
      ? singleLabVoucer[0]?.voucher_code
      : "No voucher set";

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-secondary px-4 py-1.5 font-semibold text-black">
      <div className="flex items-center justify-center gap-2">
        <Wifi className="size-6" strokeWidth={2} />
        <input
          type={viewVoucher ? "text" : "password"}
          disabled
          className="bg-transparent text-lg font-semibold tracking-wider"
          value={wifiVoucher || "No Voucher Set"}
        />
      </div>
      <Label
        onClick={() => setViewVoucher(!viewVoucher)}
        className="flex h-9 cursor-pointer items-center p-0 text-black"
      >
        {viewVoucher ? (
          <Eye className="size-6" strokeWidth={2} />
        ) : (
          <EyeOff className="size-6" strokeWidth={2} />
        )}
      </Label>
    </div>
  );
}
