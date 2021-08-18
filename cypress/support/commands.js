// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('auth', () => {
    cy.fixture('auth/login.json').then(({token}) => {
        window.localStorage.setItem('accessToken', token)
    })
    // window.localStorage.setItem('accessToken', 'ede4b9f2b68783e80cc0373c8899a453bd02fac7')
    window.localStorage.setItem('_hjid', 'ab98c9ef-6665-44ce-b622-59a4d9894c6a')

    cy.fixture('auth/bc-session.json').then((session) => {
        window.localStorage.setItem('bc-session', JSON.stringify(session))
    })

    // window.localStorage.setItem('bc-session', '{"role":{"academy":{"id":1,"name":"4Geeks Miami","slug":"miami-downtown"},"role":"admin"},"academy":{"id":1,"name":"4Geeks Miami","slug":"miami-downtown"}}')
    cy.intercept('**/v1/auth/token/**', {
        'body': {
          "token": "c831c0690eb94cbd64fa830083c6e6122c3aafed",
          "token_type": "login",
          "expires_at": "2021-08-15T13:18:05.345917Z",
          "user_id": 2
        }
    })
})