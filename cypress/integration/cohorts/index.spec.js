// TODO: check the other cohort test suites and join the duplicate tests
describe('Cohorts Screen', () => {
  beforeEach(() => {
    /*
      Cypress starts out with a blank slate for each test
      so we must tell it to visit our website with the `cy.visit()` command.
      Since we want to visit the same URL at the start of all our tests,
      we include it in our beforeEach function so that it runs before each test
    */
    cy.handleLogin()
  });
  context('Testing cohorts Screen', () => {
    // this file is similar to cypress\integration\admissions\cohorts\new.spec.js
    // and cypress\integration\admissions\cohorts\index.spec.js

    it('Searching the cohort created and checking for all coincidences', () => {
      cy.fixture('/cohorts_screen_values/values').then((values) => {
        cy.log('**_____ Goin to Cohorts Screen... _____**')
        cy.mock_list_cohortsB()
        cy.visit('/admissions/cohorts')

        // TODO: the api about the intercept commands is inconsistent
        // TODO: is weird use snake case in this context
        // TODO: is weird ends with uppercase if the rest of name is in snake case
        cy.wait('@mock_list_cohortsB')

        cy.log('**_____ Searching the new cohort _____**')
        cy.get('[data-testid=Search-iconButton]').click()
        cy.cohort_search_result()
        cy.get('.MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type(values.search_cohort)
        cy.wait('@cohort_search_result')

        cy.log('**_____ Checking for all coincidences _____**')
        cy.get('[data-testid=MuiDataTableBodyCell-0-0]').should((id) => {
          expect(id).to.contain(values.id)
        })
        cy.get('[data-testid=MuiDataTableBodyCell-2-0]').should((name) => {
          expect(name).to.contain(values.name)
        })

        cy.get('[data-cy="cohort-555"]').should('have.attr', 'href').and('include', '/admissions/cohorts')
      })
    })
  })
});
