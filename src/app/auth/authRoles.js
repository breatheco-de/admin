const authRoles = {
  admin: ['ADMIN'], // Only Admin has access
  country_manager: ['ADMIN', 'COUNTRY_MANAGER'], // Only country manager & Admin has access
  mentor_in_residence: ['ADMIN', 'COUNTRY_MANAGER', 'MENTOR_IN_RESIDENCE'], // Only everyone has access (so far)
};

export default authRoles;

// Check out app/views/dashboard/DashboardRoutes.js
// Only SA & Admin has dashboard access

// const dashboardRoutes = [
//   {
//     path: "/dashboard/analytics",
//     component: Analytics,
//     auth: authRoles.admin <===============
//   }
// ];

// Check navigaitons.js

// {
//   name: "Dashboard",
//   path: "/dashboard/analytics",
//   icon: "dashboard",
//   auth: authRoles.admin <=================
// }
