import { authRoles } from "./auth/authRoles";

export const navigations = [
    {
        name: "Dashboard",
        path: "/dashboard/analytics",
        icon: "dashboard",
    },
    {
        name: "Growth",
        icon: "show_chart",
        children: [
            {
                name: "Dashboard",
                path: "/dashboard/analytics-2",
                iconText: "OL",
                beta: true,
            },
            {
                name: "Reviews",
                path: "/growth/reviews",
                iconText: "OL",
            },
            {
                name: "Sales (Won Leads)",
                path: "/growth/sales",
                iconText: "OL",
            },
            {
                name: "All Leads",
                path: "/growth/leads",
                iconText: "OL",
            },
            {
                name: "URL Shortner",
                path: "/growth/urls",
                iconText: "OL",
            },
        ],
    },
    {
        name: "Admissions",
        icon: "school",
        auth: authRoles.contry_manager,
        children: [
            {
                name: "All Cohorts",
                path: "/admissions/cohorts",
                iconText: "CO",
            },
            {
                name: "All Students",
                path: "/admissions/students",
                iconText: "STU",
            },
            {
                name: "Watch List",
                path: "/admissions/watchlist",
                iconText: "WATCH",
            },
        ],
    },
    {
        name: "Feedback",
        icon: "record_voice_over",
        children: [
            {
                name: "by Surveys",
                path: "/feedback/surveys",
                iconText: "OL",
            },
            {
                name: "All Answers",
                path: "/feedback/answers",
                iconText: "OL",
            },
        ],
    },
    {
        path: "/certificates",
        name: "Certificates",
        icon: "card_membership",
    },
    {
        name: "Events & Workshops",
        icon: "event",
        children: [
            {
                name: "Settings",
                path: "/events/settings",
                iconText: "OL",
                capabilities: ["read_organization"],
            },
            {
                name: "Event List",
                path: "/events/list",
                iconText: "OL",
            },
            {
                name: "Attendees",
                path: "/events/attendees",
                iconText: "OL",
                beta: true,
            },
        ],
    },
    {
        name: "Developer",
        icon: "code",
        children: [
            {
                name: "Settings",
                path: "/developer/settings",
                iconText: "OL",
            },
        ],
    },
    {
        name: "Media Gallery",
        icon: "collections",
        path: "/media/gallery",
    },
    {
        name: "Mentorship",
        icon: "school",
        children: [
            {
                name: "Mentors",
                path: "/mentors",
                iconText: "STA",
            },
            {
                name: "Services",
                path: "/mentors/services",
                iconText: "STA",
            },
            {
                name: "Sessions",
                path: "/mentors/sessions",
                iconText: "STA",
            },
        ],
    },
    {
        name: "Admin",
        icon: "account_circle",
        children: [
            {
                name: "Staff",
                path: "/admin/staff",
                iconText: "STA",
            },
            {
                name: "Invites",
                path: "/admin/invites",
                iconText: "STA",
            },
            {
                name: "Gitpod",
                path: "/admin/gitpod",
                iconText: "STA",
            },
            {
                name: "Syllabus",
                path: "/admin/syllabus",
                iconText: "STA",
            },
        ],
    },
];
