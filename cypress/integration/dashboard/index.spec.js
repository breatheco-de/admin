describe('Dashboard screen', () => {
  beforeEach(() => {
    cy.handleLogin()
  });
  
  context('Testing dashboard', () => {
    it('Visit dashboard', () => {
      cy.mock_leads()
      cy.mock_academyLeads()
      cy.mock_academyEvents()
      cy.mock_feedbackAcademy()
      cy.mock_Report()

      cy.log('**_____ Starting Dashboard... _____**')
      cy.visit('/dashboard/analytics')



      cy.wait('@mock_leads');
      cy.get('@mock_leads').then(xhr => {
        console.log("Response Leads:::",xhr)
      })

      cy.wait('@mock_academyLeads');
      cy.get('@mock_academyLeads').then(xhr => {
        console.log("Response Academy Leads:::",xhr)
      })

      cy.wait('@mock_academyEvents');
      cy.get('@mock_academyEvents').then(xhr => {
        console.log("Response Academy Events:::",xhr)
      })

      cy.wait('@mock_feedbackAcademy');
      cy.get('@mock_feedbackAcademy').then(xhr => {
        console.log("Response Feedback Academy:::",xhr)
      })

      cy.wait('@mock_Report');
      cy.get('@mock_Report').then(xhr => {
        console.log("Response Report:::",xhr)
      })

    });
    
  });
});
