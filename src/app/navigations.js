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
                capabilities: ["read_review"],
            },
            {
                name: "Sales (Won Leads)",
                path: "/growth/sales",
                iconText: "OL",
                capabilities: ["read_won_lead"],
            },
            {
                name: "All Leads",
                path: "/growth/leads",
                iconText: "OL",
                capabilities: ["read_lead"],
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
                capabilities: ["read_all_cohort"],
            },
            {
                name: "All Students",
                path: "/admissions/students",
                iconText: "STU",
                capabilities: ["read_student"],
            },
            {
                name: "Watch List",
                path: "/admissions/watchlist",
                iconText: "WATCH",
                capabilities: ["read_student"],
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
                capabilities: ["read_survey"],
            },
            {
                name: "All Answers",
                path: "/feedback/answers",
                iconText: "OL",
                capabilities: ["read_nps_answers"],
            },
        ],
    },
    {
        path: "/certificates",
        name: "Certificates",
        icon: "card_membership",
        capabilities: ["read_certificate"],
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
                capabilities: ["read_event"],
            },
            {
                name: "Attendees",
                path: "/events/attendees",
                iconText: "OL",
                beta: true,
                capabilities: ["read_eventcheckin"],
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
                capabilities: ["get_academy_token"],
            },
        ],
    },
    {
        name: "Content Gallery",
        icon: "collections",
        children: [
            {
                name: "Media Gallery",
                path: "/media/gallery",
                iconText: "GAL",
                capabilities: ["read_media"],
            },
            {
                name: "Assets",
                path: "/media/asset",
                iconText: "ASS",
                beta: true,
                capabilities: ["read_asset"],
            },
            {
                name: "Pipeline",
                path: "/media/article_issues",
                iconText: "PIP",
                beta: true,
                capabilities: ["read_asset"],
            },
            {
                name: "SEO",
                path: "/media/seo/cluster",
                iconText: "SEO",
                beta: true,
                capabilities: ["read_asset"],
            },
        ]
        
    },
    {
        name: "Mentorship",
        icon: "school",
        children: [
            {
                name: "Mentors",
                path: "/mentors",
                iconText: "STA",
                capabilities: ["read_mentorship_mentor"],
            },
            {
                name: "Services",
                path: "/mentors/services",
                iconText: "STA",
                capabilities: ["read_mentorship_service"],
            },
            {
                name: "Sessions",
                path: "/mentors/sessions",
                iconText: "STA",
                capabilities: ["read_mentorship_session"],
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
                capabilities: ["read_member"],
            },
            {
                name: "Invites",
                path: "/admin/invites",
                iconText: "STA",
                capabilities: ["read_invite"],
            },
            {
                name: "Gitpod",
                path: "/admin/gitpod",
                iconText: "STA",
                capabilities: ["get_gitpod_user"],
            },
            {
                name: "Syllabus",
                path: "/admin/syllabus",
                iconText: "STA",
                capabilities: ["read_syllabus"],
            },
        ],
    },
];
