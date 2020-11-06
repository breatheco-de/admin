import { authRoles } from "./auth/authRoles";

export const navigations = [
  {
    name: "Dashboard",
    path: "/dashboard/analytics",
    icon: "dashboard",
  },
  {
    name: "Growth",
    path: "/dashboard/analytics",
    icon: "dashboard",
  },
//   {
//     name: "Inventory Management",
//     path: "/dashboard/inventory-management",
//     icon: "dashboard",
//   },
  {
    label: "Pages",
    type: "label",
  },
 
  {
    name: "Admin",
    icon: "school",
    children: [
      {
        name: "Cohorts",
        path: "/pages/customer-list",
        iconText: "CL",
      },
      {
        name: "Students",
        path: "/pages/view-customer",
        iconText: "VC",
      },
      {
        name: "New Customer",
        path: "/pages/new-customer",
        iconText: "NC",
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
    icon: "card_membership",
    children: [
    ],
  },
  {
    name: "Help Center",
    icon: "help",
    children: [
      {
        name: "FAQ 1",
        path: "/pages/faq-1",
        iconText: "F1",
      },
      {
        name: "FAQ 2",
        path: "/pages/faq-2",
        iconText: "F2",
      },
    ],
  },
  {
    name: "User List",
    icon: "people",
    children: [
      {
        name: "User List 1",
        path: "/pages/user-list-1",
        iconText: "U1",
      },
      {
        name: "User List 2",
        path: "/pages/user-list-2",
        iconText: "U2",
      },
      {
        name: "User List 3",
        path: "/pages/user-list-3",
        iconText: "U3",
      },
      {
        name: "User List 4",
        path: "/pages/user-list-4",
        iconText: "U3",
      },
    ],
  },
  {
    name: "Forms",
    icon: "description",

    children: [
      {
        name: "Order Form",
        path: "/forms/order-form",
        iconText: "OF",
      },
      {
        name: "Invoice Form",
        path: "/forms/invoice-form",
        iconText: "IF",
      },
      {
        name: "Property Listing Form",
        path: "/forms/property-listing-form",
        iconText: "PF",
      },
      {
        name: "Basic",
        path: "/forms/basic",
        iconText: "B",
      },
      {
        name: "Editor",
        path: "/forms/editor",
        iconText: "E",
      },
      {
        name: "Upload",
        path: "/forms/upload",
        iconText: "U",
      },
      {
        name: "Wizard",
        path: "/forms/wizard",
        iconText: "W",
      },
    ],
  },
  {
    name: "Matx List",
    icon: "list",

    children: [
      {
        name: "Infinite Scroll",
        path: "/infinite-scroll",
        iconText: "I",
      },
      {
        name: "List",
        path: "/matx-list",
        iconText: "L",
      },
    ],
  },
  {
    name: "Certificates",
    icon: "security",
    children: [
      {
        name: "Sign in",
        iconText: "SI",
        path: "/session/signin",
      },
      {
        name: "Sign up",
        iconText: "SU",
        path: "/session/signup",
      },
      {
        name: "Forgot Password",
        iconText: "FP",
        path: "/session/forgot-password",
      },
      {
        name: "Error",
        iconText: "404",
        path: "/session/404",
      },
    ],
  },
  {
    name: "Left Sidebar Card",
    path: "/page-layouts/Left-sidebar-card",
    icon: "vertical_split",
  },
  {
    name: "User Profile",
    path: "/page-layouts/user-profile",
    icon: "person",
  },

  {
    label: "Apps",
    type: "label",
  },
  {
    name: "Ecommerce",
    icon: "shopping_basket",

    children: [
      {
        name: "Shop",
        path: "/ecommerce/shop",
        iconText: "S",
      },
      {
        name: "Cart",
        path: "/ecommerce/cart",
        iconText: "C",
      },
      {
        name: "Checkout",
        path: "/ecommerce/checkout",
        iconText: "CO",
      },
    ],
  },
  {
    name: "Scrum Board",
    icon: "group_work",
    path: "/scrum-board/c5d7498bbcb84d81fc7454448871ac6a6e",
  },
  {
    name: "Invoice Builder",
    icon: "receipt",
    path: "/invoice/list",
  },
  {
    name: "Calendar",
    icon: "date_range",
    path: "/calendar",
  },
  {
    name: "Chat",
    icon: "chat",
    path: "/chat",
  },
  {
    name: "Inbox",
    icon: "inbox",
    path: "/inbox",
  },
  {
    name: "Todo",
    icon: "center_focus_strong",
    path: "/todo/list",
  },
  {
    label: "Tables",
    type: "label",
  },
  {
    name: "CRUD Table",
    icon: "format_list_bulleted",
    path: "/crud-table",
  },
  {
    name: "Data Table",
    icon: "table_view",

    children: [
      {
        name: "Simple Mui Table",
        path: "/data-table/simple-mui-table",
        iconText: "T1",
      },
      {
        name: "Expandable Mui Table",
        path: "/data-table/expandable-mui-table",
        iconText: "T2",
      },
    ],
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
  {
    name: "Map",
    icon: "add_location",
    path: "/map",
  },
  {
    label: "Charts",
    type: "label",
  },
  {
    name: "Charts",
    icon: "trending_up",

    children: [
      {
        name: "Echarts",
        path: "/charts/echarts",
        iconText: "E",
      },
      // {
      //   name: "Recharts",
      //   path: "/charts/recharts",
      //   iconText: "R",
      // },
      {
        name: "React Vis",
        path: "/charts/react-vis",
        iconText: "R",
      },
      {
        name: "Victory Chart",
        path: "/charts/victory-charts",
        iconText: "V",
      },
    ],
  },
  {
    name: "Documentation",
    icon: "launch",
    type: "extLink",
    path: "http://demos.ui-lib.com/matx-react-doc/",
  },
];
