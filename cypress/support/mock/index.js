import breathecode from './breathecode';

Cypress.Commands.add('mock', () => {
    return cy.wrap({ breathecode });
});
