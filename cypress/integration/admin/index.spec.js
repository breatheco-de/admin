// // <reference types="cypress" />
// const moment = require('moment-timezone');

// const timeslotStartingAt = '2021-10-12T20:40:07Z';
// const timeslotEndingAt = '2021-10-12T21:40:07Z';

// describe('/admin/syllabus', () => {
//   beforeEach(() => {
//     // cy.auth();

//     cy.mock().then(({ breathecode }) => {
//       // auth
//       breathecode.auth.getTokenKey();
//       breathecode.auth.getUserMe();
//       breathecode.admissions.putAcademyCohortId();

//       // // mock requests
//       // breathecode.admissions.getSyllabus();
//       // breathecode.admissions.getSyllabusSlug('full-stack-ft', {'private': true});
//       // breathecode.admissions.getSchedule([{
//       //   id: 4,
//       //   slug: 'full-stack-pt-mon',
//       //   name: 'Full Stack PT Mon',
//       // }, {
//       //   id: 5,
//       //   slug: 'full-stack-pt-sun',
//       //   name: 'Full Stack PT Sun',
//       // }, {
//       //   id: 6,
//       //   slug: 'full-stack-pt-wet',
//       //   name: 'Full Stack PT Wet',
//       // }]);
//       // breathecode.admissions.getAcademyScheduleIdTimeslot(4, [{
//       //   id: 11,
//       //   starting_at: timeslotStartingAt,
//       //   ending_at: timeslotEndingAt,
//       // }]);
//       // breathecode.admissions.getAcademyScheduleIdTimeslot(5, [{
//       //   id: 12,
//       //   starting_at: timeslotStartingAt,
//       //   ending_at: timeslotEndingAt,
//       //   recurrency_type: 'DAILY',
//       // }]);
//       // breathecode.admissions.getAcademyScheduleIdTimeslot(6, [{
//       //   id: 13,
//       //   starting_at: timeslotStartingAt,
//       //   ending_at: timeslotEndingAt,
//       //   recurrency_type: 'MONTH',
//       // }]);
//       // breathecode.admissions.putSyllabusId();
//       // breathecode.admissions.deleteAcademyScheduleIdTimeslotId();
//       // breathecode.admissions.postAcademySchedule();
//       // breathecode.admissions.postAcademyScheduleIdTimeslot();

//       cy.visit('/admin/syllabus', {
//         onBeforeLoad(win) {
//           cy.stub(win, 'open')
//         }
//       });
//     });

//   });
//   context('Syllabus list', () => {
//     it('Make public/private', () => {
//       // cy.mock().then(({ breathecode }) => {
//       //   // mock requests
//       //   cy.wait(2000);
//       //   breathecode.admissions.getSyllabusSlug('full-stack-ft', {'private': false});
//       //   cy.get('[data-cy="additional-actions"]').click();
//       //   cy.contains('li', 'Make public').click();
//       //   cy.get('[data-cy="confirm-alert-accept-button"]').click();
//       //   cy.wait(2000);

//       //   breathecode.admissions.getSyllabusSlug('full-stack-ft', {'private': true});
//       //   cy.get('[data-cy="additional-actions"]').click();
//       //   cy.contains('li', 'Make private').click();
//       //   cy.get('[data-cy="confirm-alert-accept-button"]').click();
//       //   cy.wait(2000);

//       //   cy.get('[data-cy="additional-actions"]').click();
//       //   cy.contains('li', 'Make public').should('exist');
//       // });
//     });
//   });
// });
