import { authRoles } from './auth/authRoles';

export const navigations = [
  {
    name: 'Dashboard',
    path: '/dashboard/analytics',
    icon: 'dashboard',
  },
  {
    name: 'Growth',
    path: '/dashboard/analytics-2',
    icon: 'show_chart',
    beta: true,
  },
  {
    name: 'Student Report',
    path: '/dashboard/student/1/cohort/1',
    icon: 'show_chart',
    beta: true,
  },
  {
    name: 'Admissions',
    icon: 'school',
    auth: authRoles.contry_manager,
    children: [
      {
        name: 'All Cohorts',
        path: '/admissions/cohorts',
        iconText: 'CO',
      },
      {
        name: 'All Students',
        path: '/admissions/students',
        iconText: 'STU',
      },
    ],
  },
  {
    name: 'Leads',
    icon: 'monetization_on',
    children: [
      {
        name: 'Won Leads',
        path: '/leads/won',
        iconText: 'OL',
      },
      {
        name: 'All Leads',
        path: '/leads/list',
        iconText: 'OL',
      },
    ],
  },
  {
    name: 'Feedback',
    icon: 'record_voice_over',
    children: [
      {
        name: 'by Surveys',
        path: '/feedback/surveys',
        iconText: 'OL',
      },
      {
        name: 'All Answers',
        path: '/feedback/answers',
        iconText: 'OL',
      },
    ],
  },
  {
    path: '/certificates',
    name: 'Certificates',
    icon: 'card_membership',
  },
  {
    name: 'Events & Workshops',
    icon: 'event',
    children: [
      {
        name: 'Settings',
        path: '/events/settings',
        iconText: 'OL',
        beta: true,
      },
      {
        name: 'Event List',
        path: '/events/list',
        iconText: 'OL',
      },
      {
        name: 'Attendees',
        path: '/events/attendees',
        iconText: 'OL',
        beta: true,
      },
    ],
  },
  {
    name: 'Media Gallery',
    icon: 'collections',
    path: '/media/gallery',
  },
  {
    name: 'Admin',
    icon: 'account_circle',
    children: [
      {
        name: 'Staff',
        path: '/admin/staff',
        iconText: 'STA',
      },
      {
        name: 'Invites',
        path: '/admin/invites',
        iconText: 'STA',
      },
      {
        name: 'Syllabus',
        path: '/admin/syllabus',
        iconText: 'STA',
        beta: true,
      },
    ],
  },
];
