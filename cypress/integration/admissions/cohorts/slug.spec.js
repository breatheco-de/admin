// <reference types="cypress" />
import moment from 'moment'

describe('Login Screen', () => {
  beforeEach(() => {
    /*
      Cypress starts out with a blank slate for each test
      so we must tell it to visit our website with the `cy.visit()` command.
      Since we want to visit the same URL at the start of all our tests,
      we include it in our beforeEach function so that it runs before each test
    */

    cy.auth();
    // cy.intercept('**/v1/admissions/academy/cohort', {
    //   'fixture': 'admissions/academy/cohort.json'
    // })

    cy.intercept('**/v1/auth/user/me', {
      'fixture': 'auth/user/me.json'
    })

    cy.intercept('**/v1/admissions/certificate', {
      'fixture': 'admissions/certificate.json'
    })
    cy.visit('/admissions/cohorts/defence-against-the-dark-arts');
  });
  context('Form', () => {
    it('Should have a card with logo and form', () => {
      // // Check the form before use it
      // cy.get('[data-cy=end-date] input').should('not.be.disabled')
      cy.get('[data-cy=slug] input').should('be.disabled')

      // // fill the form
      cy.get('[data-cy=slug] input').should('have.value', 'defence-against-the-dark-arts')
      cy.get('[data-cy=syllabus] input').should('have.value', 'Defence Against the Dark Arts')
      cy.get('[data-cy=version] input').should('have.value', '1')
      cy.get('[data-cy=schedule] input').should('have.value', 'Full Stack PT Mon')
      cy.get('[data-cy=language] input').should('have.value', 'en')

      cy.fixture('admissions/academy/cohort.json').then((response) => {
        cy.get('[data-cy=start-date] input').should('have.value', moment(response[0].kickoff_date).format('yyyy-MM-DD'))
      })

      // cy.get('[data-cy=never-ends] input').invoke('attr', 'checked').should('eq', '')
      // cy.get('[data-cy=never-end] input').should('be.selected')


      // cy.get('[data-cy=start-date] input').should('have.value', 'EN')
      // cy.get('[data-cy=slug]').type('defence-against-the-dark-arts');
      // cy.get('[data-cy=slug]').type('defence-against-the-dark-arts');
      // cy.get('[data-cy=syllabus]').type('Defence Against the Dark Arts{downarrow}{enter}')
      // cy.get('[data-cy=version]').type('1{downarrow}{enter}')
      // cy.get('[data-cy=schedule]').type('Full Stack PT Mon{downarrow}{enter}')
      // cy.get('[data-cy=never-ends]').click()

      // // check the form after use it
      // cy.get('[data-cy=name] input').should('have.value', 'Defence Against the Dark Arts')
      // cy.get('[data-cy=slug] input').should('have.value', 'defence-against-the-dark-arts')
      // cy.get('[data-cy=syllabus] input').should('have.value', 'Defence Against the Dark Arts')
      // cy.get('[data-cy=version] input').should('have.value', '1')
      // cy.get('[data-cy=end-date] input').should('be.disabled')

    });
  });
});
