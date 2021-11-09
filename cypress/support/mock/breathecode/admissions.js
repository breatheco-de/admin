import { intercept } from '../tools'

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

// Cypress.Commands.add('mockGetAdmissionsSyllabusIdResponse', () => {
// cy.intercept(/\/v1\/admissions\/syllabus\/\d+$/, {
//     fixture: 'admissions/syllabus/id.json',
//     method: 'GET'
// }).as('getAdmissionsSyllabusIdRequest');
// });

// Cypress.Commands.add('mockPostAdmissionsSyllabusResponse', () => {
// cy.intercept(/\/v1\/admissions\/syllabus$/, {
//     fixture: 'admissions/syllabus.post.json',
//     method: 'POST',
//     statusCode: 201
// }).as('postAdmissionsSyllabusRequest');
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

// \/ = '/'
// (|\?.+) = '?...'
// [a-z] = 'a' ... 'z'
// [a-z-]+ = slug
// [n]+ = 'n' + 'n' + ... + 'n'
// $ = ends of string
export default {
    getSyllabus(body) {
        intercept({
            url: /\/v1\/admissions\/syllabus$/,
            fixture: 'admissions/syllabus.json',
            method: 'GET',
            as: 'mockGetAdmissionsSyllabusResponse',
            body,
        })
    },
    getSyllabusSlug(slug='[a-z-]+', body) {
        const url = new RegExp(`/v1/admissions/syllabus/${slug}$`)

        intercept({
            fixture: 'admissions/syllabus/slug.json',
            method: 'GET',
            as: 'getAdmissionsSyllabusSlugRequest',
            url,
            body,
        })
    },
    getSchedule(body) {
        intercept({
            url: /\/v1\/admissions\/schedule(|\?.+)$/,
            fixture: 'admissions/schedule.json',
            method: 'GET',
            as: 'getAdmissionsScheduleRequest',
            body,
        })
    },
    putSyllabusId(body) {
        intercept({
            url: /\/v1\/admissions\/syllabus\/\d+$/,
            fixture: 'admissions/syllabus/id.put.json',
            method: 'PUT',
            as: 'putAdmissionsSyllabusIdRequest',
            body,
        })
    },
    putAcademyCohortId(body) {
        intercept({
            url: /\/v1\/admissions\/academy\/cohort\/(\d+)$/,
            fixture: 'admissions/academy/cohort.put.json',
            method: 'PUT',
            as: 'putAdmissionsAcademyCohortIdRequest',
            body,
        })
    },
    getAcademyScheduleIdTimeslot(id='(\\d+)', body) {
        const url = new RegExp(`/v1/admissions/academy/schedule/${id}/timeslot$`)
        const idIsSetted = id !== '(\\d+)'

        if (idIsSetted && body instanceof Array) { body = body.map((v) => ({ 'specialty_mode': id, ...v})) }
        else if (idIsSetted && !body) { body = [{'specialty_mode': id }]}

        intercept({
            fixture: 'admissions/academy/schedule/id/timeslot.json',
            method: 'GET',
            as: 'getAdmissionsAcademyScheduleIdTimeslotRequest',
            url,
            body,
        })
    },
    deleteAcademyScheduleIdTimeslotId() {
        intercept({
            method: 'DELETE',
            statusCode: 204,
            as: 'deleteAdmissionsAcademyScheduleIdTimeslotIdRequest',
            url: /\/v1\/admissions\/academy\/schedule\/(\d+)\/timeslot\/(\d+)$/,
        })
    },
    postAcademySchedule() {
        intercept({
            fixture: 'admissions/academy/schedule.post.json',
            method: 'POST',
            statusCode: 201,
            as: 'postAdmissionsAcademyScheduleRequest',
            url: /\/v1\/admissions\/academy\/schedule$/,
        })
    },
    postAcademyScheduleIdTimeslot(id='(\\d+)', body) {
        const url = new RegExp(`/v1/admissions/academy/schedule/${id}/timeslot$`)
        const idIsSetted = id !== '(\\d+)'

        if (idIsSetted && body instanceof Array) { body = body.map((v) => ({ 'specialty_mode': id, ...v })) }
        else if (idIsSetted && !body) { body = [{'specialty_mode': id }]}

        intercept({
            fixture: 'admissions/academy/schedule/id/timeslot.post.json',
            method: 'POST',
            statusCode: 201,
            as: 'postAdmissionsAcademyScheduleIdTimeslotRequest',
            url,
            body,
        })
    },
}
