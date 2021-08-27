describe('Students Screen', () => {
  beforeEach(() => {
    /*
      Cypress starts out with a blank slate for each test
      so we must tell it to visit our website with the `cy.visit()` command.
      Since we want to visit the same URL at the start of all our tests,
      we include it in our beforeEach function so that it runs before each test
    */
    cy.handleLogin()
    
    
  });
  context('Testing Students Screen', () => {
    it('Has spected structure', () => {
        /*
        //       Hard coded structure to compare 
        //     */
        cy.test_students()

        cy.log('**_____ Goin to Students Screen... _____**')
        cy.visit('/admissions/students')

        cy.wait('@test_students');
        cy.get('@test_students').then(xhr => {
        const students = xhr.response.body
        console.log("Response students:::",students) 
        // cy.get(students.results.length).should('have.length', 2)
       
        
        
      }).its('response.body.results.length').should('be.eq', 2)
    });
  
  });
});
  