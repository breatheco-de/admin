// <reference types="cypress" />

const moment = require('moment');

describe('New cohort view', () => {
  beforeEach(() => {
    cy.auth();
    cy.mockGetAdmissionsSyllabusResponse();
    cy.mockGetAdmissionsSyllabusVersionResponse();
    cy.mockPostAdmissionsAcademyCohortResponse();

    cy.visit('/admissions/cohorts/new');
  });
  context('Form', () => {
    it('Should have a card with logo and form', () => {
      // Check the form before use it
      cy.get('[data-cy=end-date] input').should('not.be.disabled')

      // fill the form
      cy.get('[data-cy=name]').type('Defence Against the Dark Arts');
      cy.get('[data-cy=slug]').type('defence-against-the-dark-arts');
      cy.get('[data-cy=syllabus]').type('Full-Stack Software Developer{downarrow}{enter}')
      cy.wait(2000);
      cy.get('[data-cy=version]').type('1{downarrow}{enter}')
      // cy.get('[data-cy=schedule]').type('Full Stack PT Mon{downarrow}{enter}')
      cy.get('[data-cy=never-ends]').click()

      // check the form after use it
      cy.get('[data-cy=name] input').should('have.value', 'Defence Against the Dark Arts')
      cy.get('[data-cy=slug] input').should('have.value', 'defence-against-the-dark-arts')
      cy.get('[data-cy=syllabus] input').should('have.value', 'Full-Stack Software Developer FT')
      cy.get('[data-cy=version] input').should('have.value', '1')
      // cy.get('[data-cy=start-date] input').should('not.be.empty')
      cy.get('[data-cy=end-date] input').should('be.disabled')

      // send request
      cy.get('[data-cy=submit]').click()

      // check the payload
      cy.wait('@postAdmissionsAcademyCohortRequest').then(({ request }) => {
        cy.wrap(request.body).its('name').should('eq', 'Defence Against the Dark Arts')
        cy.wrap(request.body).its('slug').should('eq', 'defence-against-the-dark-arts')

        const isKickoffDateAIsoDate = moment(request.body.kickoff_date, moment.ISO_8601, true).isValid()
        cy.wrap(isKickoffDateAIsoDate).should('eq', true);

        cy.wrap(request.body).its('ending_date').should('eq', null)
        cy.wrap(request.body).its('never_ends').should('eq', true)
        cy.wrap(request.body).its('syllabus').should('eq', 'full-stack-ft.v1')
        cy.wrap(request.body).its('specialty_mode').should('eq', null)
      })

      cy.location('pathname').should('eq', '/admissions/cohorts')
    });
  });
});
