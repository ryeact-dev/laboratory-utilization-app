import { z } from "zod";

// User Schema
export const userSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email must not be empty")
      .email("Please enter a valid email address"),
    full_name: z.string().trim().min(1, "Please fill in your Full Name"),
    user_role: z.string().min(1, "Please select a role"),
    department: z.string(),
    user_program: z.string(),
  })
  .superRefine((data, ctx) => {
    // Validate department for specific roles
    if (
      ["Program Head", "Faculty", "Dean", "Custodian"].includes(data.user_role)
    ) {
      if (!data.department) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a department",
          path: ["department"],
        });
      }
    }

    // Validate program for Program Head role
    if (data.user_role === "Program Head") {
      if (!data.user_program) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a program",
          path: ["user_program"],
        });
      }
    }
  });

// Password must contain at least one letter, one number, and be at least 8 characters long
const passwordRules = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const updateUserPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current Password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(passwordRules, {
        message: "Password must contain at least one letter and one number",
      }),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

// Subject Schema
export const subjectSchema = z.object({
  code: z
    .string()
    .regex(/^[0-9]+$/, "Only numbers")
    .min(4, "ie. 1234")
    .max(4, "ie. 1234")
    .min(1, "Code is required"),
  title: z.string().trim().min(1, "Name/Title is required"),
  program: z.string().trim().min(1, "Program is required"),
  start_time: z.string().trim().min(1, "Start time is required"),
  end_time: z.string().trim().min(1, "End time is required"),
  instructor_id: z.string().trim().min(1, "Instructor is required"),
  term: z.string().trim().min(1, "Term is required"),
  schedule: z.number(),
});

// Schedule Schema
export const scheduleSchema = z.object({
  code: z.string().regex(/^[0-9]+$/, { message: "Code contains only numbers" }),
  is_regular_class: z.boolean(),
  start_time: z.string(),
  end_time: z.string(),
});

//Student Schema
export const studentSchema = z.object({
  id_number: z
    .string()
    .regex(/^[0-9]+$/, { message: "ID Number contains only numbers" })
    .min(6, "ie. 001234")
    .max(6, "ie. 001234"),
  full_name: z.string().trim().min(1, "Student name must not be empty!"),
  // department: z.string().required('Department is required'),
});

export const reservationSchema = z.object({
  code: z
    .string()
    .regex(/^[0-9]+$/, { message: "Subject code contains only numbers" }),
  is_regular_class: z.boolean(),
  purpose: z.string().min(1, "Purpose is required"),
  activity_title: z.string(),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  disapproval_reason: z.string().optional(),
  // topic_content: z.string(),
  // makeup_reason: z.string(),
  // programhead_id: z.string().trim().min(1, "Please select a Program Head"),
  // dean_id: z.string().trim().min(1, "Please select a Dean"),
});
// .superRefine((data, ctx) => {
//   // Validate activity_title for Others purpose
//   if (data.purpose === "Others" && !data.activity_title) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "Please fill-in activity title",
//       path: ["activity_title"],
//     });
//   }

//   // Validate topic_content and makeup_reason for Make-up Class
//   if (data.purpose === "Make-up Class") {
//     if (!data.topic_content) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Please fill-in Topic Content",
//         path: ["topic_content"],
//       });
//     }
//     if (!data.makeup_reason) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Please fill-in Make-up Reason",
//         path: ["makeup_reason"],
//       });
//     }
//   }
// });

// After Usage Remarks Schema
export const orientationSchema = z.object({
  lab_safety_guidelines: z.boolean(),
  lab_evac_plan: z.boolean(),
  lab_emergency_drill: z.boolean(),
});

// After Usage Remarks Schema
export const afterUsageRemarksSchema = z.object({
  remark: z.string().trim(),
  unit_no: z.number(),
  description: z.string().trim(),
  ticket_no: z.string().trim(),
});

// Stock Card Schema
export const stockCardSchema = z.object({
  item_name: z.string().trim().min(1, "Please fill-in item name"),
  item_category: z.string().trim().min(1, "Please fill-in item unit"),
  item_unit: z.string().trim().min(1, "Please fill-in item unit"),
  remarks: z.string().default(""),
});

// Stock Card Add Item Schema
export const stockCardAddItemSchema = z.object({
  date_requested: z.date(),
  date_received: z.date(),
  prs_number: z
    .string()
    .trim()
    .min(1, { message: "Please fill-in PRS Number" }),
  msis_number: z.string().trim().min(1, "Please fill-in MSIS Number"),
  item_quantity: z
    .string()
    .trim()
    .min(1, { message: "Please fill-in Item Quantity" }),
  item_received: z
    .string()
    .trim()
    .min(1, { message: "Please fill-in Item Received" }),
});

// Borrower Return Item Schema
export const stockCardReleaseItemSchema = z.object({
  date_released: z.date(),
  item_released: z
    .string() // Accept input as a string
    .transform((val) => parseFloat(val)) // Convert string to number
    .refine((val) => !isNaN(val) && val >= 0.1, {
      // Validate that it's a number and >= 0.1
      message: "Please fill-in Item Quantity",
    }),
  released_to: z.string().trim().min(1, "Please fill-in Item Received"),
});

// Borrower Info Schema
export const borrowerSlipLabSchema = z.object({
  subject_id: z.string().trim().min(1, "Please select a subject"),
  college_office: z.string().trim().min(1, "Please fill-in Office/College"),
  schedule_date_of_use: z.date(),
  borrower_id: z.string().trim().min(1, "Please enter a student number"),
  instructor_password: z
    .string()
    .trim()
    .min(1, "Please fill-in Insturctor password"),
  instructor_id: z.string().trim().min(1, "Please fill-in Insturctor ID"),
});

// Hardware Schema
export const hardwareSchema = z.object({
  property_number: z
    .string()
    .trim()
    .min(1, "Please fill-in the Property number"),
  date_acquired: z.date(),
  hardware_type: z.string().trim().min(1, "Please select a type"),
  specs: z.string().trim().min(1, "Please fill-in the specifications"),
});

// Borrower Item Schema
export const borrowerSlipItemLabSchema = z.object({
  item_name: z.string().trim(),
  item_quantity: z.number(),
  released_status: z.string().trim(),
});

// Borrower Return Item Schema
export const borrowerSlipReturnItemLabSchema = z.object({
  item_remarks: z.string().trim(),
  item_damaged_quantity: z.string(),
  returned_status: z.string().trim(),
});

// Hardware Upgrade Schema
export const hardwareUpgradeSchema = z.object({
  upgrade_id: z.number().optional(),
  date_upgraded: z.date(),
  upgrade_details: z
    .string()
    .trim()
    .min(1, "Please fill-in the specifications"),
});
