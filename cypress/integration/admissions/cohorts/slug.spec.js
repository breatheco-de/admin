// <reference types="cypress" />
import dayjs from 'dayjs'

describe('Login Screen', () => {
  beforeEach(() => {
    cy.auth();

    cy.intercept('**/v1/admissions/certificate', {
      'fixture': 'admissions/certificate.json'
    })

    cy.mockGetAdmissionsSyllabusResponse();
    cy.mockGetAdmissionsSyllabusVersionResponse();
    cy.mockGetAdmissionsAcademyCohortSlugResponse();
    cy.mockGetAdmissionsSyllabusIdResponse();
    cy.mockGetAdmissionsScheduleResponse();
    cy.mockPutAdmissionsAcademyCohortIdResponse();

    cy.visit('/admissions/cohorts/defence-against-the-dark-arts');
  });
  context('admissions/cohorts/slug', () => {
    it('Edit cohort', () => {
      // Check the form before use it
      cy.get('[data-cy=end-date] input').should('not.exist')
      cy.get('[data-cy=slug] input').should('be.disabled')
      cy.get('[data-cy=never-ends] input').should('be.checked');

      // check before fill the form
      cy.get('[data-cy=slug] input').should('have.value', 'defence-against-the-dark-arts')
      cy.get('[data-cy=syllabus] input').should('have.value', 'Full-Stack Software Developer FT')
      cy.get('[data-cy=version] input').should('have.value', '1')
      cy.get('[data-cy=schedule] input').should('have.value', '')
      cy.get('[data-cy=language] input').should('have.value', 'en')

      cy.fixture('admissions/academy/cohort/slug.json').then((response) => {
        cy.get('[data-cy=start-date] input').should('have.value', dayjs(response.kickoff_date).format('YYYY-MM-DD'))
      })

      // fill the form
      cy.get('[data-cy=schedule]').type('Full Stack PT Mon{downarrow}{enter}')

      // check after fill the form
      cy.get('[data-cy=end-date] input').should('not.exist')
      cy.get('[data-cy=slug] input').should('be.disabled')
      cy.get('[data-cy=never-ends] input').should('be.checked');

      // send request
      cy.get('[data-cy=submit]').click()

      // check the payload
      cy.wait('@putAdmissionsAcademyCohortIdRequest').then(({ request }) => {
        // cy.wrap(request.body).its('name').should('eq', 'Defence Against the Dark Arts');
        cy.wrap(request.body).its('slug').should('eq', 'defence-against-the-dark-arts');

        const isKickoffDateAIsoDate = dayjs(request.body.kickoff_date, dayjs.ISO_8601, true).isValid();
        cy.wrap(isKickoffDateAIsoDate).should('eq', true);

        cy.wrap(request.body).its('ending_date').should('eq', null);
        cy.wrap(request.body).its('never_ends').should('eq', true);
        cy.wrap(request.body).its('syllabus').should('eq', 'full-stack-ft.v1');
        cy.wrap(request.body).its('specialty_mode').should('eq', 4);
        cy.wrap(request.body).its('language').should('eq', 'en');
        cy.wrap(request.body).its('private').should('eq', false);
      })
    });
  });
});
