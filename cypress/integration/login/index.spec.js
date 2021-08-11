// <reference types="cypress" />

describe('Login Screen', () => {
  beforeEach(() => {
    /*
      Cypress starts out with a blank slate for each test
      so we must tell it to visit our website with the `cy.visit()` command.
      Since we want to visit the same URL at the start of all our tests,
      we include it in our beforeEach function so that it runs before each test
    */
    cy.visit('/session/signin');
  });
  context('Login Card', () => {
    it('Should have a card with logo and form', () => {
      /*
        We use the `cy.get()` command to get all elements
        that match the selector.
      */
      cy.log('**Card**');
      cy.get('[data-cy=login_card]');

      cy.log('**Logo**');
      cy.get('[data-cy=login_card]').find('img').should('have.attr', 'src');

      cy.log('**Form**');
      cy.get('[data-cy=login_form]');
    });

    it('CASE WRONG: user data', () => {
      /*
        It initialize the form with the input from the email,
        where the css changes are checked
      */
      cy.get('[data-cy=login_form]');
      cy.fixture('/user_contact/wrong').each((wrong) => {
        /*
          here we use the "fixture" function where we have data of
          possible cases of credentials that would be better to validate
        */
        cy.log('**TYPING: email...**');
        cy.get('[data-cy=email]').type(wrong.email);

        cy.log('**-------- Email Label --------**');
        cy.get('[data-cy=login_form]').find('label').contains('Email');

        cy.log('**-------- Prints the field in Red --------**');
        cy.get('[data-cy=login_form]')
          .find('fieldset')
          .should('have.css', 'border-color', 'rgb(255, 61, 87)');

        cy.log('**-------- Hint to help --------**');
        cy.get('[data-cy=login_form]')
          .find('p')
          .contains('email is not valid')
          .should('have.css', 'color', 'rgb(255, 61, 87)');

        cy.log('**TYPING: password...**');
        cy.get('[data-cy=password]').type(wrong.password);

        cy.log('**-------- Password Label --------**');
        cy.get('[data-cy=login_form]').find('label').contains('Password');

        cy.log('**-------- Submit --------**');
        cy.log('Submit');
        cy.get('[data-cy=submit_button]').click();

        cy.log('**-------- Clean Data --------**');
        cy.get('[data-cy=email]').clear();
        cy.get('[data-cy=password]').clear();
      });
    });

    it('CASE SUCCESS: user data', () => {
      /*
        It initialize the form with the input from the email,
        where the css changes are checked
      */
      cy.get('[data-cy=login_form]');
      cy.fixture('/user_contact/right').then((right) => {
        const { email, password } = right

        cy.log('**_____ Start intercept _____**')
        cy.intercept('POST', '**/auth/login').as('postForm')

        /*
          here we use the "fixture" function where we have data of
          possible cases of credentials that would be better to validate
        */
        cy.log('**TYPING: email...**');
        cy.get('[data-cy=email]').type(email);

        cy.log('**-------- Email Label --------**');
        cy.get('[data-cy=login_form]').find('label').contains('Email');

        cy.log('**TYPING: password...**');
        cy.get('[data-cy=password]').type(password);

        cy.log('**-------- Password Label --------**');
        cy.get('[data-cy=login_form]').find('label').contains('Password');
        
        cy.log('**-------- Submit --------**');
        cy.log('Submit');
        cy.get('[data-cy=submit_button]').click();

        // this method verifies that the user data has reached the api with the expected token
        // cy.log("**-------- Verifying Interception --------**")
        // cy.wait('@postForm');
        // // it verify if the response has been intercepted and changed
        // cy.get('@postForm').then(xhr => {
        //   console.log("Response Intercepted:::",xhr)
        //   expect(xhr.response.statusCode).to.equal(200)
        //   expect(xhr.response.body.email).to.equal(email)
        // })
      });
    });
  });
});