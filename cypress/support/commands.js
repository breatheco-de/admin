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

    cy.wait('@mock_login');
    // it verify if the response has been intercepted and changed
    cy.get('@mock_login').then(xhr => {
      console.log("Response Intercepted:::",xhr)
    })
    cy.wait('@mock_token');
    cy.get('@mock_token').then(xhr => {
      console.log("Response token:::",xhr)
    })
    cy.wait('@mock_userData');
    cy.get('@mock_userData').then(xhr => {
      console.log("Response User Data:::",xhr)
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
  }).as('mock_login')
});

Cypress.Commands.add('mock_token', (token) => {
  cy.intercept('GET', '**/auth/token/*', {
    status: 200,
    token,
    token_type: "login",
    expires_at: "2021-012-15T01:09:49.535548Z",
    user_id: 238
  }).as('mock_token')
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

  }).as('mock_userData')
});


// NOTE: _____________________________DASHBOARD COMANDS_____________________________

Cypress.Commands.add('mock_leads', () => {
  
  // get leads by UTM_SOURCE
  cy.intercept('GET', '**/marketing/report/lead?*&by=utm_source', [
    {
      total_leads: 2,
      utm_source: null
    }
  ]).as('mock_leads')
});

Cypress.Commands.add('mock_academyLeads', () => {
  // get leads by LOCATION
  cy.intercept('GET', '**/marketing/report/lead?*&by=location,created_at__date,course', [
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
    },
  ]).as('mock_academyLeads')
});

Cypress.Commands.add('mock_academyEvents', () => {
  cy.intercept('GET', '**/events/academy/checkin*', []).as('mock_academyEvents')
});

Cypress.Commands.add('mock_feedbackAcademy', () => {
  // responseURL: "https://breathecode-test.herokuapp.com/v1/feedback/academy/answer?status=ANSWERED"
  cy.intercept('GET', '**/feedback/academy/answer?*', [
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
  ]).as('mock_feedbackAcademy')
});

Cypress.Commands.add('mock_Report', () => {
  cy.intercept('GET', '**/admissions/report', {
    id: 2,
    latitude: null,
    logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami",
    longitude: null,
    name: "Downtown Miami",
    slug: "downtown-miami",
    status: "ACTIVE",
    street_address: "1801 SW 3rd Ave #100, Miami, FL 33129",
    students: {total: 62, active: 43, suspended: 0, graduated: 6, dropped: 0},
    teachers: {total: 4, active: {main: 5, assistant: 1, reviewer: 0, total: 6}},
    website_url: null
  }).as('mock_Report')
});
