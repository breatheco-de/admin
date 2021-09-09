
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
     
    it('Checking that the button creates a new test', () => {
        
      // cy.fixture('/students_screen_values/values').then((values) => {

        cy.log('**_____ Goin to Cohorts Screen... _____**')
        cy.visit('/admissions/cohorts')

        // cy.wait('@test_students');
        // cy.get('@test_students').then(xhr => {
        // const students = xhr.response.body
        // console.log("Response students:::",students) 
        // console.log("json students:::",values.search_url)

      
         
        
        })
        // .its('response.body.results.length').should('be.eq', values.students_count)
      // })
    });

    
    
    
  });
// });
  