// <reference types="cypress" />

describe('Login Screen', () => {
  beforeEach(() => {
    /*
      Cypress starts out with a blank slate for each test
      so we must tell it to visit our website with the `cy.visit()` command.
      Since we want to visit the same URL at the start of all our tests,
      we include it in our beforeEach function so that it runs before each test
    */
    cy.visit('/');
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
      cy.fixture('/user_contact/right').each((right) => {
        /*
          here we use the "fixture" function where we have data of
          possible cases of credentials that would be better to validate
        */
        cy.log('**TYPING: email...**');
        cy.get('[data-cy=email]').type(right.email);

        cy.log('**-------- Email Label --------**');
        cy.get('[data-cy=login_form]').find('label').contains('Email');

        cy.log('**TYPING: password...**');
        cy.get('[data-cy=password]').type(right.password);

        cy.log('**-------- Password Label --------**');
        cy.get('[data-cy=login_form]').find('label').contains('Password');

        cy.log('**-------- Submit --------**');
        cy.log('Submit');
        cy.get('[data-cy=submit_button]').click();
        cy.get('[data-cy=login_form]').find('.text-error');

        cy.log('**-------- Clean Data --------**');
        cy.get('[data-cy=login_form]')
          .find('[data-cy=email] > .MuiInputBase-root > .MuiInputBase-input')
          .clear();
        cy.get('[data-cy=login_form]')
          .find('[data-cy=password] > .MuiInputBase-root > .MuiInputBase-input')
          .clear();
      });
    });
  });
});
