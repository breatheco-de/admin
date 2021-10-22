
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
        
        cy.syllabus_certificates()
        

        cy.log('**_____ Goin to Cohorts Screen... _____**')
        cy.visit('/admissions/cohorts')
        
        cy.wait('@mock_list_cohortsA')
        cy.wait(1500)
        

        cy.log('**_____ Creating a new cohort _____**')
        cy.get('[data-cy=new_cohort_button]').click()

        cy.log('**_____ Sending the syllabus certificates names_____**')
        
        
        cy.log('**_____ Sending the certificates versions_____**')
        cy.certificates_versions()
        cy.wait('@syllabus_certificates')

        cy.log('**_____ Entering the new cohort NAME _____**')
        cy.get('[data-cy=name]').type(values.name)

        cy.log('**_____ Entering the new cohort SLUG _____**')
        cy.get('[data-cy=slug]').type(values.slug)
        
        cy.log('**_____ Picking STARTING DATE for the new cohort _____**')
        // cy.get('[data-cy=start-date]').click(200, 0)
        // cy.get(':nth-child(3) > :nth-child(4) > .MuiButtonBase-root > .MuiIconButton-label > .MuiTypography-root')
        // .click()
        
        cy.log('**_____ Picking ENDING DATE for the new cohort _____**')
        cy.get('.MuiFormControlLabel-root').click()
        
        cy.log('**_____ Selecting the syllabus certificate NAME _____**')
        
        cy.get('[data-cy=syllabus]').type(values.syllabus)
      

        cy.log('**_____ Selecting the syllabus certificate VERSION _____**')
        cy.wait('@certificates_versions')
        cy.get('[data-cy=version]').type('1')
        cy.wait(1000)
        cy.get('[data-cy=version]').type('{downArrow}{enter}')
        
       
        cy.log('**_____ Pressing the "create" button _____**')
        cy.mock_new_cohort()
        cy.wait(3000)
        cy.get('.mt-6 > .MuiButtonBase-root').click()
        cy.wait('@mock_new_cohort')
        cy.wait(3000)
        cy.get('.Toastify__toast-body').should((green) => {
          expect(green).to.contain('success')
        })
        cy.wait(3000)
        
        
      })
       
        })

  it('Searching the cohort created and checking for all coincidences', () => {
    cy.fixture('/cohorts_screen_values/values').then((values) => {
      cy.log('**_____ Goin to Cohorts Screen... _____**')
      cy.mock_list_cohortsB()
      cy.visit('/admissions/cohorts')
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
      cy.wait(3000)
    })
  
  })

  it('Corroborating the editing process of the newly created cohort', () => {
    cy.fixture('/cohorts_screen_values/values').then((values) => {
      cy.log('**_____ Goin to Cohorts Screen... _____**')
      cy.visit('/admissions/cohorts')

      cy.log('**_____ Sending mock cohorts _____**')
      cy.mock_list_cohortsB()
      cy.wait('@mock_list_cohortsB')

      cy.log('**_____ Editing process _____**')
      cy.get('[data-cy=edit_cohort-0]').click()

      cy.log('**_____ Filling editing form _____**')
      cy.cohort_edit_new()
      cy.cohort_edit_syllabus()
      cy.cohort_edit_full()
      // cy.cohort_edit_students()
      cy.cohort_edit_version()
      // cy.cohort_edit_schedule()
      cy.cohort_edit_load_user()
      // cy.wait(3000)
      cy.wait('@cohort_edit_new')
      cy.wait('@cohort_edit_syllabus')
      cy.wait('@cohort_edit_full')
      // cy.wait('@cohort_edit_students')
      cy.wait('@cohort_edit_version')
      cy.wait('@cohort_edit_load_user')
      // cy.wait('@cohort_edit_schedule')
      
      cy.log('**_____ Checking if one can actually edit the cohort  _____**')

      cy.log('**_____ changing the chosen syllabus  _____**')
      cy.cohort_edit_new_version()
      cy.get('[data-cy=syllabus]').click().type('{downArrow}' + values.syllabus)
      cy.wait('@cohort_edit_new_version')

      cy.log('**_____ changing the chosen language  _____**')
      cy.get('[data-cy=language]').type("ES{enter}")
      
      cy.log('**_____ choosing a version of the new syllabus  _____**')
      cy.get('[data-cy=version]').click().type('{downArrow}' + values.syllabus)
      
    

      cy.log('**_____ changing the start date  _____**')
      cy.get('[data-cy=start-date]').click(115, 0)
      cy.get(':nth-child(3) > .MuiIconButton-label > .MuiSvgIcon-root').click()
      cy.get('.MuiPickersCalendar-transitionContainer > :nth-child(1) > :nth-child(2) > :nth-child(3)')
      .click()
      
      cy.wait(1000)

      cy.log('**_____ changing the end date  _____**')
      cy.get('[data-cy=end-date]').click(115, 0)
      cy.get(':nth-child(3) > .MuiIconButton-label > .MuiSvgIcon-root').click()
      cy.get('.MuiPickersCalendar-transitionContainer > :nth-child(1) > :nth-child(2) > :nth-child(3)')
      .click()

      cy.log('**_____ changing to never ends _____**')
      cy.get('[data-cy=never-ends]').click()

      cy.log('**_____ loading a user _____**')
      
      
      cy.log('**_____ saving the changes _____**')
      cy.get('[data-cy=submit]').click()
      cy.visit('/admissions/cohorts')
    
    })
  })

})
});
