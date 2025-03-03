// TECH ASSISTANTS , CUSTODIANS AND ADMINS
import arnelAng from "@/assets/esign/arnel-esig.jpg";
import christianSuaybaguio from "@/assets/esign/christian-esig.jpg";
import edwinFlores from "@/assets/esign/edwin-esig.jpg";
import joeritzBunhayag from "@/assets/esign/joe-esig.jpg";
import joniferBalbarona from "@/assets/esign/jonifer-esig.png";
import lutherJacobo from "@/assets/esign/luther-esig.png";

// DEAN OFFICE ASSISTANT
import jennyRoseProcillo from "@/assets/esign/perocillo-esign.jpg";

export function eSign(user) {
  const esignMap = {
    "Arnel Ang": arnelAng,
    "Christian Suaybaguio": christianSuaybaguio,
    "Edwin Flores": edwinFlores,
    "Jonifer Balbarona": joniferBalbarona,
    "Joe Ritz Bunhayag": joeritzBunhayag,
    "Luther Jacobo": lutherJacobo,
    "Ryan Montoya": lutherJacobo,
    "Jenny Rose Perocillo": jennyRoseProcillo,
  };

  return esignMap[user?.trim()] || null;
}
