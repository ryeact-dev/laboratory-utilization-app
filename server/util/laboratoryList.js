function getListOfLaboratory(laboratory) {
  const labList = {
    // COMPUTING LAB MAIN
    'Computing Lab M1': ['Computing Lab M1', 'Computing Lab M2'],
    'Computing Lab M2': ['Computing Lab M1', 'Computing Lab M2'],

    // COMPUTING LAB VISAYAN
    'Computing Lab V1': [
      'Computing Lab V1',
      'Computing Lab V2',
      'Computing Lab V3',
    ],
    'Computing Lab V2': [
      'Computing Lab V1',
      'Computing Lab V2',
      'Computing Lab V3',
    ],
    'Computing Lab V3': [
      'Computing Lab V1',
      'Computing Lab V2',
      'Computing Lab V3',
    ],

    // Science Lab
    'Chemistry Lab - Main': [
      'Chemistry Lab - Main',
      'Biology Lab - Main',
      'Physics Lab - Main',
      'Micro-Bio Lab - Main',
      'Science Lab Stockroom',
      'Science Lab Office',
    ],
    'Biology Lab - Main': [
      'Chemistry Lab - Main',
      'Biology Lab - Main',
      'Physics Lab - Main',
      'Micro-Bio Lab - Main',
      'Science Lab Stockroom',
      'Science Lab Office',
    ],
    'Physics Lab - Main': [
      'Chemistry Lab - Main',
      'Biology Lab - Main',
      'Physics Lab - Main',
      'Micro-Bio Lab - Main',
      'Science Lab Stockroom',
      'Science Lab Office',
    ],
    'Micro-Bio Lab - Main': [
      'Chemistry Lab - Main',
      'Biology Lab - Main',
      'Physics Lab - Main',
      'Micro-Bio Lab - Main',
      'Science Lab Stockroom',
      'Science Lab Office',
    ],

    // Crime Lab
    'Crime Scene Room': [
      'Dark Room',
      'Crime Scene Room',
      'Interrogation Room',
      'Forensic Lab',
      'Polygraph Room',
      'Fire Testing Room',
      'Moot Court',
    ],
    'Interrogation Room': [
      'Dark Room',
      'Crime Scene Room',
      'Interrogation Room',
      'Forensic Lab',
      'Polygraph Room',
      'Fire Testing Room',
      'Moot Court',
    ],
    'Forensic Lab': [
      'Dark Room',
      'Crime Scene Room',
      'Interrogation Room',
      'Forensic Lab',
      'Polygraph Room',
      'Fire Testing Room',
      'Moot Court',
    ],
    'Polygraph Room': [
      'Dark Room',
      'Crime Scene Room',
      'Interrogation Room',
      'Forensic Lab',
      'Polygraph Room',
      'Fire Testing Room',
      'Moot Court',
    ],
    'Fire Testing Room': [
      'Dark Room',
      'Crime Scene Room',
      'Interrogation Room',
      'Forensic Lab',
      'Polygraph Room',
      'Fire Testing Room',
      'Moot Court',
    ],
    'Moot Court': [
      'Dark Room',
      'Crime Scene Room',
      'Interrogation Room',
      'Forensic Lab',
      'Polygraph Room',
      'Fire Testing Room',
      'Moot Court',
    ],
    'Dark Room': [
      'Dark Room',
      'Crime Scene Room',
      'Interrogation Room',
      'Forensic Lab',
      'Polygraph Room',
      'Fire Testing Room',
      'Moot Court',
    ],

    // HRM Lab
    Bistro: ['Bistro', 'Catering', 'Bar', 'Mini-Hotel', 'Hot Kitchen'],
    Catering: ['Bistro', 'Catering', 'Bar', 'Mini-Hotel', 'Hot Kitchen'],
    Bar: ['Bistro', 'Catering', 'Bar', 'Mini-Hotel', 'Hot Kitchen'],
    'Mini-Hotel': ['Bistro', 'Catering', 'Bar', 'Mini-Hotel', 'Hot Kitchen'],
    'Hot Kitchen': ['Bistro', 'Catering', 'Bar', 'Mini-Hotel', 'Hot Kitchen'],

    // PURPOSIVE COMMUNICATION LAB
    'Purposive Comm Lab': [
      'Purposive Communication Laboratory',
      'Speech Communication Laboratory',
    ],
    'Speech Comm Lab': [
      'Purposive Communication Laboratory',
      'Speech Communication Laboratory',
    ],

    // ELECTORICAL ENGINEERING LAB
    'Electronics Lab': ['Electronics Lab', 'Electronics Lab Ext.'],
    'Electronics Lab Ext.': ['Electronics Lab', 'Electronics Lab Ext.'],

    //
  };

  return labList[laboratory] || [];
}

function laboratory_list() {
  return [
    'Computing Lab M1',
    'Computing Lab M2',
    'Computing Lab V1',
    'Computing Lab V2',
    'Computing Lab V3',
    'Engg Computer Lab',
    'Electronics Lab',
    'Electronics Lab Ext.',
    'Purposive Comm Lab',
    'Speech Comm Lab',
    'Office Practice Lab',
    'Psychology Lab',
    'Bistro',
    'Mini-Hotel',
    'Hot Kitchen',
    'Bar',
    'Catering',
    'Dark Room',
    'Crime Scene Room',
    'Interrogation Room',
    'Forensic Lab',
    'Polygraph Room',
    'Fire Testing Room',
    'Moot Court',
    'Chemistry Lab - Main',
    'Biology Lab - Main',
    'Physics Lab - Main',
    'Micro-Bio Lab - Main',
    'Physics Lab - Visayan',
    'Chemistry Lab - Visayan',
  ];
}

exports.laboratory_list = laboratory_list;
exports.getListOfLaboratory = getListOfLaboratory;
