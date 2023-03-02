import React from "react";

const routes = [
    {
        path: "/admissions/cohorts/new",
        exact: true,
        component: React.lazy(() => import("./cohort-form/NewCohort")),
    },
    {
        path: "/admissions/cohorts/:slug",
        exact: true,
        component: React.lazy(() => import("./cohort-form")),
    },
    {
        exact: true,
        path: "/admissions/cohorts",
        component: React.lazy(() => import("./cohorts")),
    },
    {
        path: "/admissions/students/new",
        exact: true,
        component: React.lazy(() => import("./student-form/NewStudent")),
    },
    {
        path: "/admissions/students/:stdId",
        exact: true,
        component: React.lazy(() => import("./student-form")),
    },
    {
        path: "/admissions/students",
        component: React.lazy(() => import("./students")),
    },
    {
        path: "/admissions/teachers",
        component: React.lazy(() => import("./teachers")),
    },
    {
        path: "/admissions/watchlist",
        component: React.lazy(() => import("./watchlist")),
    },
    {
        path: "/admissions/syllabus",
        exact: true,
        component: React.lazy(() => import("./syllabus")),
      },
      {
          path: "/admissions/syllabus/new",
          component: React.lazy(() => import("../admissions/syllabus-form/NewSyllabus")),
      },
      {
          path: "/admissions/syllabus/:syllabusSlug",
          component: React.lazy(() => import("../admissions/syllabus-form")),
      },
];

export default routes;
