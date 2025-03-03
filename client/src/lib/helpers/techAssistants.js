// CHRISTIAN SUAYBAGUIO - Tech. Asst.
// Electronics Lab
// Electronics Lab extension
// Eng'g Computer Lab
// Chemistry Lab - Visayan
// Physics Lab - Visayan

// JOE RITZ BUNHAYAG - Tech. Asst.
// Chemistry Lab - Main
// Physics Lab - Main
// Biology Lab
// Microbio Lab

// EDWIN FLORES - Tech. Asst.
// Crim Labs
// HRM Lab
// Psychology Lab
// Speech Comm. Lab

export function techAssistants(laboratory) {
  const cSuaybaguioLabs = [
    "Physics Lab - Visayan",
    "Chemistry Lab - Visayan",
    "Engg Computer Lab",
    "Electronics Lab",
    "Electronics Lab Ext.",
  ];

  const jBunhayagLabs = [
    "Chemistry Lab - Main",
    "Biology Lab - Main",
    "Physics Lab - Main",
    "Micro-Bio Lab - Main",
  ];

  const eFloreLabs = [
    "Psychology Lab",
    "Bistro",
    "Mini-Hotel",
    "Hot Kitchen",
    "Bar",
    "Catering",
    "Crime Scene Room",
    "Interrogation Room",
    "Dark Room",
    "Forensic Lab",
    "Polygraph Room",
    "Fire Testing Room",
    "Moot Court",
  ];

  const aAngLabs = ["Purposive Comm Lab", "Speech Comm Lab"];

  let techAssistant;

  if (cSuaybaguioLabs.includes(laboratory)) {
    techAssistant = "Christian Suaybaguio";
  } else if (jBunhayagLabs.includes(laboratory)) {
    techAssistant = "Joe Ritz Bunhayag";
  } else if (eFloreLabs.includes(laboratory)) {
    techAssistant = "Edwin Flores";
  } else if (aAngLabs.includes(laboratory)) {
    techAssistant = "Arnel Ang";
  }

  return techAssistant;
}

export function technicianOnDuty(laboratory) {
  const jBunhayagLabs = [
    "Computing Lab M1",
    "Computing Lab M2",
    "Purposive Comm Lab",
    "Speech Comm Lab",
  ];

  const eFloreLabs = [
    "Computing Lab V1",
    "Computing Lab V2",
    "Computing Lab V3",
    "Engg Computer Lab ",
  ];

  let techAssistant;

  if (jBunhayagLabs.includes(laboratory)) {
    techAssistant = "Joe Ritz Bunhayag";
  } else if (eFloreLabs.includes(laboratory)) {
    techAssistant = "Edwin Flores";
  }

  return techAssistant;
}
