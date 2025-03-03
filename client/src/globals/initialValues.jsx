export const TEMPORARY_DEAN_UUID = "e70826ca-4456-450b-8bd6-88e949a5da07";

export const INITIAL_LOGIN_OBJ = {
  password: "",
  email: "",
};

export const INITIAL_VALUES_PASSWORDS = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const PASSWORD_REQUIREMENTS = [
  { id: 1, text: "• At least 8 characters", regex: /.{8,}/ },
  { id: 2, text: "• At least 1 uppercase letter", regex: /[A-Z]/ },
  {
    id: 3,
    text: "• At least 4 numbers",
    regex: /^(?=(?:\D*\d){4})[a-zA-Z0-9]*$/,
  },
];

export const INITIAL_ORIENTATION_SUBMISSION_OBJ = {
  lab_safety_guidelines: false,
  lab_evac_plan: false,
  lab_emergency_drill: false,
};

export const INITIAL_STUDENT_OBJ = {
  id_number: "",
  full_name: "",
  department: "",
  e_sign: "",
};

export const INITIAL_NEW_USER_OBJ = {
  email: "",
  full_name: "",
  user_role: "",
  user_program: "",
  department: "",
};

export const INITIAL_SUBJECT_OBJ = {
  code: "",
  title: "",
  start_time: "",
  end_time: "",
  schedule: 0,
  program: "",
  instructor_id: "",
};

export const INITIAL_SCHEDULE_OBJ = {
  code: "",
  start_time: "",
  end_time: "",
  is_regular_class: true,
  purpose: "",
  activity_title: "",
};

export const INITIAL_RESERVATION_SCHEDULE_OBJ = {
  code: "",
  start_time: "",
  end_time: "",
  purpose: "Make-up Class",
  is_regular_class: false,
  disapproval_reason: "",
  activity_title: "",
  // topic_content: "",
  // makeup_reason: "",
  // programhead_id: "",
  // dean_id: "",
  // program: "",
};

export const INITIAL_AFTER_USAGE_REMARKS_OBJ = {
  remark: "",
  unit_no: 0,
  description: "",
  ticket_no: "",
};

export const INITIAL_HARDWARE_OBJ = {
  property_number: "",
  hardware_type: "",
  specs: "",
  date_acquired: new Date(),
};

export const INITIAL_HARDWARE_UPGRADE_OBJ = {
  hardware_id: "",
  date_upgraded: new Date(),
  upgrade_details: "",
};

export const INITIAL_BORROWER_LAB_OBJ = {
  college_office: "",
  borrower_id: "",
  schedule_date_of_use: new Date(),
  subject_id: "",
  instructor_password: "",
};

export const INITIAL_BORROWER_RELEASE_ITEM_LAB_OBJ = {
  item_name: "",
  item_quantity: 1,
  released_status: "1",
};

export const INITIAL_BORROWER_RETURN_ITEM_LAB_OBJ = {
  item_remarks: "",
  returned_status: "1",
  item_damaged_quantity: "0",
};

export const INITIAL_STOCK_CARD_OBJ = {
  item_name: "",
  item_unit: "",
  item_category: "",
  remarks: "",
};

export const INITIAL_STOCK_CARD_ADD_ITEM_OBJ = {
  date_requested: new Date(),
  prs_number: "",
  item_quantity: "",
  date_received: new Date(),
  msis_number: "",
  item_received: "",
};

export const INITIAL_STOCK_CARD_RELEASE_ITEM_OBJ = {
  date_released: new Date(),
  item_released: "",
  released_to: "",
};

export const BORROWER_ITEM_STATUS = [
  { value: "1", label: "1 - Good Condition" },
  { value: "2", label: "2 - For Replacement" },
  { value: "3", label: "3 - For Repair" },
  { value: "4", label: "4 - Consumable" },
];

export const LAB_ITEM_MEASUREMENTS = [
  { value: "bottle", label: "Bottle" },
  { value: "box", label: "Box" },
  { value: "can", label: "Can" },
  { value: "gal", label: "Gallon" },
  { value: "gram", label: "Gram" },
  { value: "Kg", label: "Kilogram" },
  { value: "Liter", label: "Liter" },
  { value: "ml", label: "ML" },
  { value: "piece", label: "Piece" },
  { value: "lb", label: "Pound" },
  { value: "unit", label: "Unit" },
];

export const OFFICE_ITEM_MEASUREMENTS = [
  { value: "bottle", label: "Bottle" },
  { value: "box", label: "Box" },
  { value: "can", label: "Can" },
  { value: "piece", label: "Piece" },
  { value: "ream", label: "Ream" },
  { value: "roll", label: "Roll" },
  { value: "unit", label: "Unit" },
];

export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const WEEKLY_USER_ROLE_STEP = {
  Custodian: 1,
  Faculty: 2,
  "Program Head": 2,
  Dean: 3,
};

export const LIST_OF_ALLOWED_USERS = ["Admin", "Custodian", "STA"];

export const LIST_OF_ALLOWED_USERS_FOR_BORROWER_SLIP = [
  "Admin",
  "Custodian",
  "STA",
  "Faculty",
  "Program Head",
];

export const USER_ONLY_FOR_VIEWING_AND_ACKNOWLEDGE = [
  "Faculty",
  "Program Head",
  "Dean",
  "Custodian",
  "Admin",
];

export const STUDENT_SUBMISSION_TYPE = [
  { label: "Single Submission", value: "false" },
  { label: "Use Excel File", value: "true" },
];

export const DEPARTMENT = [
  "Dept. of Accounting Education",
  "Dept. of Arts and Sciences Education",
  "Dept. of Business Administration Education",
  "Dept. of Criminal Justice Education",
  "Dept. of Engineering Education",
  "Dept. of Teacher Education",
  "JHS Department",
  "SHS Department",
  "N/A",
];

export const PROGRAM = [
  {
    label: "BS Accountancy",
    value: "BS-ACT",
    department: "Dept. of Accounting Education",
  },
  {
    label: "BS Mgt Accounting",
    value: "BS-MGTA",
    department: "Dept. of Accounting Education",
  },
  {
    label: "AB English",
    value: "BS-ARTS",
    department: "Dept. of Arts and Sciences Education",
  },
  {
    label: "BS Psychology",
    value: "BS-PSY",
    department: "Dept. of Arts and Sciences Education",
  },
  {
    label: "BS Com Sci",
    value: "BS-CS",
    department: "Dept. of Arts and Sciences Education",
  },
  {
    label: "BS Information Tech.",
    value: "BS-IT",
    department: "Dept. of Arts and Sciences Education",
  },
  {
    label: "BS Criminology",
    value: "BS-CRIM",
    department: "Dept. of Criminal Justice Education",
  },
  {
    label: "BSBA-Fin Mgt",
    value: "BSBA-FIN",
    department: "Dept. of Business Administration Education",
  },
  {
    label: "BSBA-Mktg Mgt",
    value: "BSBA-MM",
    department: "Dept. of Business Administration Education",
  },
  {
    label: "BSBA-HR Mgt",
    value: "BSBA-HR",
    department: "Dept. of Business Administration Education",
  },
  {
    label: "BS Tourism Mgt",
    value: "BS-TM",
    department: "Dept. of Business Administration Education",
  },
  {
    label: "BS HRM",
    value: "BS-HRM",
    department: "Dept. of Business Administration Education",
  },
  {
    label: "Bachelor in Sec. Educ.",
    value: "BS-SEC",
    department: "Dept. of Teacher Education",
  },
  {
    label: "Bachelor in Elem. Educ.",
    value: "BS-ELEM",
    department: "Dept. of Teacher Education",
  },
  {
    label: "Bachelor in PE",
    value: "BPE",
    department: "Dept. of Teacher Education",
  },
  {
    label: "BS Electrical Engg",
    value: "BS-EE",
    department: "Dept. of Engineering Education",
  },
  {
    label: "BS Electronics Engg",
    value: "BS-ECE",
    department: "Dept. of Engineering Education",
  },
  {
    label: "BS Computer Engg",
    value: "BS-COE",
    department: "Dept. of Engineering Education",
  },
  {
    label: "Junior High School",
    value: "JHS",
    department: "JHS Department",
  },
  {
    label: "Senior High School",
    value: "SHS",
    department: "SHS Department",
  },
];

export const PROGRAM_COLORS = {
  "BS-ACT": "bg-[#21aba4]",
  "BS-MGTA": "bg-[#21aba4]",
  "BS-ARTS": "bg-[#117a12]",
  "BS-PSY": "bg-[#117a12]",
  "BS-CS": "bg-[#117a12]",
  "BS-IT": "bg-[#117a12]",
  "BS-CRIM": "bg-[#e5192d]",
  "BSBA-FIN": "bg-[#ffe20b] text-black",
  "BSBA-MM": "bg-[#ffe20b] text-black",
  "BSBA-HR": "bg-[#ffe20b] text-black",
  "BS-TM": "bg-[#913ae3]",
  "BS-HRM": "bg-[#913ae3]",
  "BS-SEC": "bg-[#2f39d3]",
  "BS-ELEM": "bg-[#2f39d3]",
  "BS-EE": "bg-[#db8606]",
  "BS-ECE": "bg-[#db8606]",
  "BS-COE": "bg-[#db8606]",
};

export const WEEKDAYS_NAMES_COLORS = [
  { rule: "MO", name: "Mon", color: "bg-[#117a12]/80" },
  { rule: "TU", name: "Tue", color: "bg-[#117a12]/80" },
  { rule: "WE", name: "Wed", color: "bg-[#e5192d]/80" },
  { rule: "TH", name: "Thu", color: "bg-[#e5192d]/80" },
  { rule: "FR", name: "Fri", color: "bg-[#2f39d3]/80" },
  { rule: "SA", name: "Sat", color: "bg-[#2f39d3]/80" },
];

export const USER_ROLE = [
  "Dean",
  "Program Head",
  "Faculty",
  "Custodian",
  "STA",
  "Admin",
];

export const COMPUTING_LAB_REMARKS = [
  { label: "Internet Speed", value: "Internet Speed", width: "w-[20%]" },
  { label: "No problems found", value: "No problems found", width: "w-[20%]" },
  {
    label: "A. Unable to load OS",
    value: "A. Unable to load OS",
    width: "w-[25%]",
  },
  {
    label: "B. Unable to open program",
    value: "B. Unable to open program",
    width: "w-[35%]",
  },
  { label: "C. Lag/Hang-up", value: "C. Lag/Hang-up", width: "w-[20%]" },
  { label: "D. Virus/Malware", value: "D. Virus/Malware", width: "w-[20%]" },
  {
    label: "E. No power/Unable to start",
    value: "E. No power/Unable to start",
    width: "w-[35%]",
  },
  { label: "F. Restarting", value: "F. Restarting", width: "w-[20%]" },
  {
    label: "G. Display problem",
    value: "G. Display problem",
    width: "w-[20%]",
  },
  { label: "H. Beeping", value: "H. Beeping", width: "w-[20%]" },
  { label: "I. Missing Parts", value: "I. Missing Parts", width: "w-[20%]" },
  {
    label: "J. No internet connection",
    value: "J. No internet connection",
    width: "w-[35%]",
  },
  { label: "K. Others", value: "K. Others", width: "w-[20%]" },
];

export const NON_COMPUTING_LAB_REMARKS = [
  { label: "No problems found", value: "No problems found" },
  { label: "Missing Item(s)", value: "Missing Item(s)" },
  { label: "Equipment", value: "Equipment" },
];

export const LABS_NEED_HARDWARE_LIST = [
  "Computing Lab M1",
  "Computing Lab M2",
  "Computing Lab V1",
  "Computing Lab V2",
  "Computing Lab V3",
  "Engg Computer Lab",
  "Purposive Comm Lab",
  "Electronics Lab",
  "Electronics Lab Ext.",
];

export const OFFICE_LIST = [
  { label: "Science Lab Office", value: "Science Lab Office" },
  {
    label: "Laboratory Management Office",
    value: "Laboratory Management Office",
  },
];

export const SCIENCE_LAB_LIST = [
  "Chemistry Lab - Main",
  "Biology Lab - Main",
  "Physics Lab - Main",
  "Micro-Bio Lab - Main",
];

export const LABORATORIES_LIST = [
  "Computing Lab M1",
  "Computing Lab M2",
  "Computing Lab V1",
  "Computing Lab V2",
  "Computing Lab V3",
  "Engg Computer Lab",
  "Electronics Lab",
  "Electronics Lab Ext.",
  "Purposive Comm Lab",
  "Speech Comm Lab",
  "Office Practice Lab",
  "Psychology Lab",
  "Bistro",
  "Mini-Hotel",
  "Hot Kitchen",
  "Bar",
  "Catering",
  "Dark Room",
  "Crime Scene Room",
  "Interrogation Room",
  "Forensic Lab",
  "Polygraph Room",
  "Fire Testing Room",
  "Moot Court",
  "Chemistry Lab - Main",
  "Biology Lab - Main",
  "Physics Lab - Main",
  "Micro-Bio Lab - Main",
  "Physics Lab - Visayan",
  "Chemistry Lab - Visayan",
];

export const LABORATORY_NAMES = [
  "Laboratory Management Office",
  "Computing Laboratory - Main",
  "Computing Laboratory - Visayan",
  "Engineering Computer Laboratory",
  "Electronics Laboratory",
  "Purposive Communication Laboratory",
  "Speech Communication Laboratory",
  "Office Practice Laboratory",
  "Psychology Laboratory",
  "HRM Laboratory",
  "Criminology Laboratory",
  "Science Laboratory - Main",
  "Science Laboratory - Visayan",
];

export const HARDWARE_TYPE = [
  { label: "System Unit", value: "System Unit" },
  { label: "Keyboard", value: "Keyboard" },
  { label: "Monitor", value: "Monitor" },
  { label: "UPS", value: "UPS" },
  { label: "Printer", value: "Printer" },
];

export const SCHEDULE_TYPE = [
  { label: "Regular Class", value: "true" },
  { label: "Reservation Class", value: "false" },
];

export const RESERVATION_PURPOSE = [
  { label: "Make-up Class", value: "Make-up Class" },
  { label: "Others", value: "Others" },
];

export const TYPE_OF_NO_CLASS_DAY = ["Holidays", "School Activities"];

export const TERM_AND_SEM = [
  "1st Term - 1st Sem",
  "2nd Term - 1st Sem",
  "1st Term - 2nd Sem",
  "2nd Term - 2nd Sem",
  "Summer",
];

export const SEMESTERS = ["First Semester", "Second Semester", "Summer"];

export const CLASS_SCHEDULE = [
  { name: "MSA1 (Mon, Tue, Wed)", value: 1 },
  { name: "MSA2 (Thu, Fri, Sat)", value: 2 },
  { name: "WEEKLY (Mon-Sat)", value: 3 },
  { name: "WEEKDAY (ByDay)", value: 4 },
];

export const SCHEDULER_START_TIME = [
  { label: "7:00 AM", value: "23:00:00.000Z" },
  { label: "7:30 AM", value: "23:30:00.000Z" },
  { label: "8:00 AM", value: "00:00:00.000Z" },
  { label: "8:30 AM", value: "00:30:00.000Z" },
  { label: "9:00 AM", value: "01:00:00.000Z" },
  { label: "9:30 AM", value: "01:30:00.000Z" },
  { label: "10:00 AM", value: "02:00:00.000Z" },
  { label: "10:30 AM", value: "02:30:00.000Z" },
  { label: "11:00 AM", value: "03:00:00.000Z" },
  { label: "11:30 AM", value: "03:30:00.000Z" },
  { label: "12:00 PM", value: "04:00:00.000Z" },
  { label: "12:30 PM", value: "04:30:00.000Z" },
  { label: "1:00 PM", value: "05:00:00.000Z" },
  { label: "1:30 PM", value: "05:30:00.000Z" },
  { label: "2:00 PM", value: "06:00:00.000Z" },
  { label: "2:30 PM", value: "06:30:00.000Z" },
  { label: "3:00 PM", value: "07:00:00.000Z" },
  { label: "3:30 PM", value: "07:30:00.000Z" },
  { label: "4:00 PM", value: "08:00:00.000Z" },
  { label: "4:30 PM", value: "08:30:00.000Z" },
  { label: "5:00 PM", value: "09:00:00.000Z" },
  { label: "5:30 PM", value: "09:30:00.000Z" },
  { label: "6:00 PM", value: "10:00:00.000Z" },
  { label: "6:30 PM", value: "10:30:00.000Z" },
  { label: "7:00 PM", value: "11:00:00.000Z" },
  { label: "7:30 PM", value: "11:30:00.000Z" },
  { label: "8:00 PM", value: "12:00:00.000Z" },
  { label: "8:30 PM", value: "12:30:00.000Z" },
];

export const SCHEDULER_END_TIME = [
  { label: "8:00 AM", value: "00:00:00.000Z" },
  { label: "8:30 AM", value: "00:30:00.000Z" },
  { label: "9:00 AM", value: "01:00:00.000Z" },
  { label: "9:30 AM", value: "01:30:00.000Z" },
  { label: "10:00 AM", value: "02:00:00.000Z" },
  { label: "10:30 AM", value: "02:30:00.000Z" },
  { label: "11:00 AM", value: "03:00:00.000Z" },
  { label: "11:30 AM", value: "03:30:00.000Z" },
  { label: "12:00 PM", value: "04:00:00.000Z" },
  { label: "12:30 PM", value: "04:30:00.000Z" },
  { label: "1:00 PM", value: "05:00:00.000Z" },
  { label: "1:30 PM", value: "05:30:00.000Z" },
  { label: "2:00 PM", value: "06:00:00.000Z" },
  { label: "2:30 PM", value: "06:30:00.000Z" },
  { label: "3:00 PM", value: "07:00:00.000Z" },
  { label: "3:30 PM", value: "07:30:00.000Z" },
  { label: "4:00 PM", value: "08:00:00.000Z" },
  { label: "4:30 PM", value: "08:30:00.000Z" },
  { label: "5:00 PM", value: "09:00:00.000Z" },
  { label: "5:30 PM", value: "09:30:00.000Z" },
  { label: "6:00 PM", value: "10:00:00.000Z" },
  { label: "6:30 PM", value: "10:30:00.000Z" },
  { label: "7:00 PM", value: "11:00:00.000Z" },
  { label: "7:30 PM", value: "11:30:00.000Z" },
  { label: "8:00 PM", value: "12:00:00.000Z" },
  { label: "8:30 PM", value: "12:30:00.000Z" },
  { label: "9:00 PM", value: "13:00:00.000Z" },
  { label: "9:30 PM", value: "13:30:00.000Z" },
];

export const TIME_SECONDS = [
  { label: "00", value: "00" },
  { label: "01", value: "01" },
  { label: "02", value: "02" },
  { label: "03", value: "03" },
  { label: "04", value: "04" },
  { label: "05", value: "05" },
  { label: "06", value: "06" },
  { label: "07", value: "07" },
  { label: "08", value: "08" },
  { label: "09", value: "09" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
  { label: "13", value: "13" },
  { label: "14", value: "14" },
  { label: "15", value: "15" },
  { label: "16", value: "16" },
  { label: "17", value: "17" },
  { label: "18", value: "18" },
  { label: "19", value: "19" },
  { label: "20", value: "20" },
  { label: "21", value: "21" },
  { label: "22", value: "22" },
  { label: "23", value: "23" },
  { label: "24", value: "24" },
  { label: "25", value: "25" },
  { label: "26", value: "26" },
  { label: "27", value: "27" },
  { label: "28", value: "28" },
  { label: "29", value: "29" },
  { label: "30", value: "30" },
  { label: "31", value: "31" },
  { label: "32", value: "32" },
  { label: "33", value: "33" },
  { label: "34", value: "34" },
  { label: "35", value: "35" },
  { label: "36", value: "36" },
  { label: "37", value: "37" },
  { label: "38", value: "38" },
  { label: "39", value: "39" },
  { label: "40", value: "40" },
  { label: "41", value: "41" },
  { label: "42", value: "42" },
  { label: "43", value: "43" },
  { label: "44", value: "44" },
  { label: "45", value: "45" },
  { label: "46", value: "46" },
  { label: "47", value: "47" },
  { label: "48", value: "48" },
  { label: "49", value: "49" },
  { label: "50", value: "50" },
  { label: "51", value: "51" },
  { label: "52", value: "52" },
  { label: "53", value: "53" },
  { label: "54", value: "54" },
  { label: "55", value: "55" },
  { label: "56", value: "56" },
  { label: "57", value: "57" },
  { label: "58", value: "58" },
  { label: "59", value: "59" },
];

export const HOURS_12 = [
  { label: "00", value: "00" },
  { label: "01", value: "01" },
  { label: "02", value: "02" },
  { label: "03", value: "03" },
  { label: "04", value: "04" },
  { label: "05", value: "05" },
  { label: "06", value: "06" },
  { label: "07", value: "07" },
  { label: "08", value: "08" },
  { label: "09", value: "09" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
];

export const TABLE_HEADER_BADGE_CLASS =
  "text-sm font-normal tracking-wide text-yellow-200";

export const ID_NUMBER_BADGE_CLASS =
  "rounded-full border-accent/30 bg-accent/15 font-bold text-accent shadow-none";

export const ACTIVE_BADGE_CLASS =
  "border-green-300 bg-green-100 text-green-500 shadow-none";

export const VIOLET_BADGE_CLASS =
  "rounded-full border-violet-300 bg-violet-100 text-violet-500 shadow-none";

export const SUB_CARD_BG_CLASS =
  "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-card to-background/50";
