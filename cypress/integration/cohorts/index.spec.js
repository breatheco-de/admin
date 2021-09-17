
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
     
    it('Checking that the button creates a new cohort', () => {
        
      cy.fixture('/cohorts_screen_values/values').then((values) => {
        cy.log('**_____ Sending the mocked cohorts_____**')
        cy.mock_list_cohortsA()
        
        cy.log('**_____ Goin to Cohorts Screen... _____**')
        cy.visit('/admissions/cohorts')
        cy.wait('@mock_list_cohortsA')
        cy.wait(1500)

        cy.log('**_____ Sending the syllabus certificates names_____**')
        cy.syllabus_certificates()

        cy.log('**_____ Sending the certificates versions_____**')
        cy.certificates_versions()

        cy.log('**_____ Creating a new cohort _____**')
        cy.get('.btn > .MuiButtonBase-root').click()

        cy.log('**_____ Entering the new cohort NAME _____**')
        cy.get(':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input')
        .type(values.name)

        cy.log('**_____ Entering the new cohort SLUG _____**')
        cy.get(':nth-child(4) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input')
        .type(values.slug)
        
        cy.log('**_____ Picking STARTING DATE for the new cohort _____**')
        cy.get(':nth-child(8) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root')
        .click()
        cy.get(':nth-child(3) > :nth-child(4) > .MuiButtonBase-root > .MuiIconButton-label > .MuiTypography-root')
        .click()
        
        cy.log('**_____ Picking ENDING DATE for the new cohort _____**')
        cy.get('.MuiFormControlLabel-root').click()
        
        cy.log('**_____ Selecting the syllabus certificate NAME _____**')
        cy.get('.MuiAutocomplete-popupIndicator > .MuiIconButton-label > .MuiSvgIcon-root')
        .type(values.syllabus)

        cy.log('**_____ Selecting the syllabus certificate VERSION _____**')
        cy.get('[data-cy=certificate_version]').type('1')
        cy.wait(1000)
        cy.get('[data-cy=certificate_version]').type('{downArrow}{enter}')
        
       
        cy.log('**_____ Pressing the "create" button _____**')
        cy.mock_new_cohort()
        cy.wait(1000)
        cy.get('.mt-6 > .MuiButtonBase-root').click()
        cy.wait(3000)
        cy.get('.Toastify__toast-body').contains('success')

        cy.log('**_____ The new cohort has been created _____**')
        cy.log('**_____ TEST SUCCESSFULL _____**')
        
        

        
        
      })
       
        })
        
    

    // cy.log('**_____ Goin BACK to Cohorts Screen... _____**')
        // cy.mock_list_cohortsB()
        // cy.visit('/admissions/cohorts')
    
    
  

  // it('Searching the cohort created', () => {
  //   cy.log('**_____ Goin to Cohorts Screen... _____**')
  //   cy.visit('/admissions/cohorts')

  //   cy.log('**_____ Searching the new cohort _____**')
  //   cy.get('[data-testid=Search-iconButton]').click()
  //   cy.get('.MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type('Test-Cohort PT{enter}')
  // })

//   it('Corroborating the editing process of the newly created cohort', () => {
    

//     cy.log('**_____ Goin to Cohorts Screen... _____**')
//     cy.visit('/admissions/cohorts')

//     cy.log('**_____ Sending mock cohorts _____**')
//     cy.mock_cohorts()
//     cy.wait('@mock_cohorts');
//       cy.get('@mock_cohorts').then(xhr => {
//         console.log("Mocked Response",xhr)
//       })

//     cy.log('**_____ Editing process _____**')
    
//   })

})
});