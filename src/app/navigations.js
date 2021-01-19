import { authRoles } from "./auth/authRoles";

export const navigations = [
  {
    name: "Dashboard",
    path: "/dashboard/analytics",
    icon: "dashboard",
  },
  {
    name: "Growth",
    path: "/dashboard/analytics-2",
    icon: "show_chart",
  },
  //   {
  //     name: "Inventory Management",
  //     path: "/dashboard/inventory-management",
  //     icon: "dashboard",
  //   },
  {
    name: "Admin",
    icon: "school",
    auth: authRoles.contry_manager,
    children: [
      {
        name: "Cohorts",
        path: "/admin/cohorts",
        iconText: "CO",
      },
      {
        name: "Students",
        path: "/admin/students",
        iconText: "STU",
      },
      {
        name: "Staff",
        path: "/admin/staff",
        iconText: "STA",
      },
    ],
  },
  {
    name: "Leads",
    icon: "monetization_on",
    children: [
      {
        name: "Order List",
        path: "/pages/order-list",
        iconText: "OL",
      },
      {
        name: "View Order",
        path: "/invoice/fdskfjdsuoiucrwevbgd",
        iconText: "VO",
      },
    ],
  },
  {
    name: "Feedback",
    icon: "record_voice_over",
    children: [
    ],
  },
  {
    name: "Certificates",
    path: "/certificates",
    icon: "card_membership",
  },
  {
    label: "Components",
    type: "label",
  },
  {
    name: "Components",
    icon: "favorite",
    badge: { value: "30+", color: "secondary" },
    children: [
      {
        name: "Auto Complete",
        path: "/material/autocomplete",
        iconText: "A",
      },
      {
        name: "Buttons",
        path: "/material/buttons",
        iconText: "B",
      },
      {
        name: "Checkbox",
        path: "/material/checkbox",
        iconText: "C",
      },
      {
        name: "Dialog",
        path: "/material/dialog",
        iconText: "D",
      },
      {
        name: "Drag and Drop",
        iconText: "D",
        path: "/others/drag-and-drop",
      },
      {
        name: "Expansion Panel",
        path: "/material/expansion-panel",
        iconText: "E",
      },
      {
        name: "Form",
        path: "/material/form",
        iconText: "F",
      },
      {
        name: "Icons",
        path: "/material/icons",
        iconText: "I",
      },
      {
        name: "Menu",
        path: "/material/menu",
        iconText: "M",
      },
      {
        name: "Progress",
        path: "/material/progress",
        iconText: "P",
      },
      {
        name: "Radio",
        path: "/material/radio",
        iconText: "R",
      },
      {
        name: "Switch",
        path: "/material/switch",
        iconText: "S",
      },
      {
        name: "Slider",
        path: "/material/slider",
        iconText: "S",
      },
      {
        name: "Snackbar",
        path: "/material/snackbar",
        iconText: "S",
      },
      {
        name: "Table",
        path: "/material/table",
        iconText: "T",
      },
    ],
  },
  {
    name: "Utilities",
    icon: "format_list_bulleted",
    children: [
      {
        name: "Color",
        path: "/utilities/color",
        iconText: "C",
        auth: authRoles.admin,
      },
      {
        name: "Spacing",
        path: "/utilities/spacing",
        iconText: "S",
        auth: authRoles.admin,
      },
      {
        name: "Typography",
        path: "/utilities/typography",
        iconText: "T",
      },
      {
        name: "Display",
        path: "/utilities/display",
        iconText: "D",
      },
      {
        name: "Position",
        path: "/utilities/position",
        iconText: "P",
      },
      {
        name: "Shadow",
        path: "/utilities/shadow",
        iconText: "S",
      },
    ],
  },
];
