// Cypress.Commands.add('mockPutAdmissionsAcademyCohortIdResponse', () => {
// cy.intercept(/\/v1\/admissions\/academy\/cohort\/(\d+)$/, {
//     fixture: 'admissions/academy/cohort.put.json',
//     method: 'PUT',
//     statusCode: 200
// }).as('putAdmissionsAcademyCohortIdRequest');
// });

// Cypress.Commands.add('mockGetAdmissionsAcademyCohortResponse', () => {
// cy.intercept(/\/v1\/admissions\/academy\/cohort$/, {
//     fixture: 'admissions/academy/cohort.json',
//     method: 'GET'
// }).as('getAdmissionsAcademyCohortRequest');
// });

// Cypress.Commands.add('mockGetPaginatedAdmissionsAcademyCohortResponse', () => {
// cy.intercept(/\/v1\/admissions\/academy\/cohort\?(limit|offset)=(\d+)&(limit|offset)=(\d+)$/, {
//     fixture: 'admissions/academy/cohort.paginated.json',
//     method: 'GET'
// }).as('getPaginatedAdmissionsAcademyCohortRequest');
// });

// Cypress.Commands.add('mockGetAdmissionsAcademyCohortSlugResponse', () => {
// cy.intercept(/\/v1\/admissions\/academy\/cohort\/([a-zA-Z\-]+)/, {
//     fixture: 'admissions/academy/cohort/slug.json',
//     method: 'GET'
// }).as('getAdmissionsAcademyCohortSlugRequest');
// });

// Cypress.Commands.add('mockGetAdmissionsSyllabusResponse', () => {
// cy.intercept('**/v1/admissions/syllabus', {
//     fixture: 'admissions/syllabus.json',
//     method: 'GET'
// }).as('getAdmissionsSyllabusRequest');
// });

// Cypress.Commands.add('mockGetAdmissionsSyllabusIdResponse', () => {
// cy.intercept(/\/v1\/admissions\/syllabus\/\d+$/, {
//     fixture: 'admissions/syllabus/id.json',
//     method: 'GET'
// }).as('getAdmissionsSyllabusIdRequest');
// });

// Cypress.Commands.add('mockPutAdmissionsSyllabusIdResponse', () => {
// cy.intercept(/\/v1\/admissions\/syllabus\/\d+$/, {
//     fixture: 'admissions/syllabus/id.put.json',
//     method: 'PUT'
// }).as('putAdmissionsSyllabusIdRequest');
// });

// Cypress.Commands.add('mockPostAdmissionsSyllabusResponse', () => {
// cy.intercept(/\/v1\/admissions\/syllabus$/, {
//     fixture: 'admissions/syllabus.post.json',
//     method: 'POST',
//     statusCode: 201
// }).as('postAdmissionsSyllabusRequest');
// });

// Cypress.Commands.add('mockGetAdmissionsSyllabusSlugResponse', () => {
// cy.intercept(/\/v1\/admissions\/syllabus\/[a-z-]+$/, {
//     fixture: 'admissions/syllabus/slug.json',
//     method: 'GET'
// }).as('getAdmissionsSyllabusSlugRequest');
// });

// Cypress.Commands.add('mockGetAdmissionsSyllabusVersionResponse', () => {
// cy.intercept('**/v1/admissions/syllabus/**/version', {
//     fixture: 'admissions/syllabus/slug/version.json',
//     method: 'GET'
// }).as('getAdmissionsSyllabusVersionRequest');
// });

// Cypress.Commands.add('mockPostAdmissionsAcademyCohortResponse', () => {
// cy.intercept(/\/v1\/admissions\/academy\/cohort$/, {
//     fixture: 'admissions/academy/cohort.post.json',
//     method: 'POST',
//     statusCode: 201
// }).as('postAdmissionsAcademyCohortRequest');
// });

// Cypress.Commands.add('mockGetAdmissionsScheduleResponse', () => {
// cy.intercept('**/v1/admissions/schedule**', {
//     fixture: 'admissions/schedule.json',
//     method: 'GET'
// }).as('getAdmissionsScheduleRequest');
// });

// export const blabla2 = () => cy.log('asdasdasdasd321');
export default {
    getSyllabusSlug() {
        cy.intercept(/\/v1\/admissions\/syllabus\/[a-z-]+$/, {
            fixture: 'admissions/syllabus/slug.json',
            method: 'GET'
        }).as('getAdmissionsSyllabusSlugRequest');
    },
    getSchedule() {
        cy.intercept('**/v1/admissions/schedule**', {
            fixture: 'admissions/schedule.json',
            method: 'GET'
        }).as('getAdmissionsScheduleRequest');
    },
    putSyllabusId() {
        cy.intercept(/\/v1\/admissions\/syllabus\/\d+$/, {
            fixture: 'admissions/syllabus/id.put.json',
            method: 'PUT'
        }).as('putAdmissionsSyllabusIdRequest');
    },
    putAcademyCohortId() {
        cy.intercept(/\/v1\/admissions\/academy\/cohort\/(\d+)$/, {
            fixture: 'admissions/academy/cohort.put.json',
            method: 'PUT',
            statusCode: 200
        }).as('putAdmissionsAcademyCohortIdRequest');
    },
}
