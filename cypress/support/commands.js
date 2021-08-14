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


// NOTE: _____________________________ACCESS COMANDS_____________________________

Cypress.Commands.add('handleLogin', () => {
  cy.visit('/session/signin');
  cy.log('**-------- Login process --------**');
  cy.fixture('/user_contact/right').then((right) => {
    const { email, password, token } = right

    cy.mock_login(email, password, token);
    cy.mock_token(token);
    cy.mock_userData(email, password);

    cy.get('[data-cy=email]').type(email);
    cy.get('[data-cy=password]').type(password);
    cy.get('[data-cy=submit_button]').click();

    cy.wait('@postForm');
    // it verify if the response has been intercepted and changed
    cy.get('@postForm').then(xhr => {
      console.log("Response Intercepted:::",xhr)
    })
    cy.wait('@getTokenStatus');
    cy.get('@getTokenStatus').then(xhr => {
      console.log("Response getTokenStatus:::",xhr)
    })
    cy.wait('@getUserData');
    cy.get('@getUserData').then(xhr => {
      console.log("Response getUserData:::",xhr)
    })
  })
    
});


Cypress.Commands.add('mock_login', (email, password, token) => {
  cy.intercept('POST', '**/auth/login', {
    statusCode: 200,
    body: {
      email,
      password,
      token,
      user_id: 238
    },
  }).as('postForm')
});

Cypress.Commands.add('mock_token', (token) => {
  cy.intercept('GET', '**/auth/token/*', {
    status: 200,
    token,
    token_type: "login",
    expires_at: "2021-012-15T01:09:49.535548Z",
    user_id: 238
  }).as('getTokenStatus')
});

Cypress.Commands.add('mock_userData', (email, password) => {
  cy.intercept('GET', '**/auth/user/me', {
    academy: {
      id: 4,
      name: "Downtown Miami",
      slug: "downtown-miami"
    },
    email,
    password,
    first_name: 'userTesterME',
    last_name: 'success?',
    id: 136,
    role: {
      academy: {
        id: 4,
        name: "Downtown Miami",
        slug: "downtown-miami"
      },
      role: "admin"
    },
    roles: [
      {
        academy: {
          id: 4,
          name: "Downtown Miami",
          slug: "downtown-miami"
        },
        role: "admin"
      }
    ]

  }).as('getUserData')
});


// NOTE: _____________________________DASHBOARD COMANDS_____________________________

Cypress.Commands.add('mock_leads', () => {
  // "https://breathecode-test.herokuapp.com/v1/marketing/report/lead?start=2021-07-15&end=2021-08-14&academy=downtown-miami&by=utm_source"
  cy.intercept('GET', '**/marketing/report/lead/*', {
    status: 200,
    statusText: "OK",
    data: [
      {
        total_leads: 2,
        utm_source: null
      }
    ]
  }).as('getLead')
});

Cypress.Commands.add('mock_academyLeads', () => {
  // "https://breathecode-test.herokuapp.com/v1/marketing/report/lead
  cy.intercept('GET', '**/marketing/report/lead/*', {
    status: 200,
    statusText: "OK",
    data: [
      {
        course: "software-engineering",
        created_at__date: "2021-08-05",
        created_date: "20210805",
        location: "downtown-miami",
        total_leads: 1
      },
      {
        course: "software-engineering",
        created_at__date: "2021-08-05",
        created_date: "20210806",
        location: "downtown-miami",
        total_leads: 1
      }
    ]
  }).as('getAcademyLeads')
});

Cypress.Commands.add('mock_academyEvents', () => {
  cy.intercept('GET', '**/events/academy/checkin*', {
    status: 200,
    statusText: "OK",
    data: []
  }).as('getAcademyEvents')
});

Cypress.Commands.add('mock_feedbackAcademy', () => {
  // responseURL: "https://breathecode-test.herokuapp.com/v1/feedback/academy/answer?status=ANSWERED"
  cy.intercept('GET', '**/feedback/academy/answer?*', {
    status: 200,
    statusText: "OK",
    data: [
      {
        academy: {
          id: 4,
          name: "Downtown Miami",
          slug: "downtown-miami"
        },
        cohort: {
          id: 6,
          name: "MCBO-1",
          slug: "mcbo-1"
        },
        comment: "Hello from cypress :)",
        created_at: "2021-08-12T00:03:30.538849Z",
        event: {
          description: "description example",
          excerpt: "etcmeidoemdie",
          id: 3,
          lang: "es",
          title: "Programación orientada a objetos"
        },
        highest: "very likely",
        id: 1,
        lang: "en",
        lowest: "not likely",
        mentor: {
          first_name: "Jhon",
          id: 12,
          last_name: "Doe"
        },
        score: 10,
        status: "ANSWERED",
        title: "Programación orientada a objetos",
        user: {
          first_name: "Crook",
          id: 211,
          last_name: "Doe"
        }
      },
    ]
  }).as('getFeedbackAcademy')
});

// TODO: Test functions work for dashboard cypress test

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
