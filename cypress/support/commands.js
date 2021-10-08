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

const { LocalPostOfficeOutlined } = require("@material-ui/icons");


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
  }).as('handleLogin')
    
  })



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

// NOTE: _____________________________STUDENTS COMANDS_____________________________

Cypress.Commands.add('test_students', () => {
  // get correct structure
  cy.intercept('GET', '**/auth/academy/student?*', {
    
      count: 2,
      first: null,
      next: null,
      previous: null,
      last: null,
      results: [
          {
              id: 64,
              first_name: "Jonathan",
              last_name: "Ferragut",
              user: null,
              academy: {
                  id: 4,
                  name: "Downtown Miami",
                  slug: "downtown-miami"
              },
              role: {
                  slug: "student",
                  name: "Student"
              },
              created_at: "2021-05-17T18:35:09.382565Z",
              email: "jonathan@alkemyinc.com",
              address: "",
              phone: "305879655",
              status: "ACTIVE"
          },
          {
              id: 145,
              first_name: "albertovargas",
              last_name: "vargas",
              user: null,
              academy: {
                  id: 4,
                  name: "Downtown Miami",
                  slug: "downtown-miami"
              },
              role: {
                  slug: "student",
                  name: "Student"
              },
              created_at: "2021-06-14T15:59:12.268369Z",
              email: "albertovargas@hotmail.com",
              address: "",
              phone: "30565452133",
              status: "INVITED"
          }
      ]
  },
    
  
  ).as('test_students')
});  

Cypress.Commands.add('mock_search', () => {
  cy.intercept('GET', '**/auth/academy/student?limit=10&offset=0&like=Jonathan',{
    count: 1,
      first: null,
      next: null,
      previous: null,
      last: null,
      results: [
          {
              id: 64,
              first_name: "Jonathan",
              last_name: "Ferragut",
              user: null,
              academy: {
                  id: 4,
                  name: "Downtown Miami",
                  slug: "downtown-miami"
              },
              role: {
                  slug: "student",
                  name: "Student"
              },
              created_at: "2021-05-17T18:35:09.382565Z",
              email: "jonathan@alkemyinc.com",
              address: "",
              phone: "305879655",
              status: "ACTIVE"
          }]
  }).as('mock_search')
})

// NOTE: _____________________________COHORTS COMANDS_____________________________

Cypress.Commands.add('syllabus_certificates', () => {
  // send syllabus names 
  cy.intercept('GET', '**/admissions/syllabus', 
    
      [
        {
            id: 1,
            slug: "full-stack",
            name: "Full-Stack Software Developer",
            duration_in_days: 48,
            description: "Manages front-end and back-end side of the web",
            logo: null
        },
        {
            id: 2,
            slug: "web-development",
            name: "Web Developer",
            duration_in_days: 42,
            description: "Create websites using CMS, API's and React.js",
            logo: null
        },
        {
            id: 3,
            slug: "coding-introduction",
            name: "Coding Introduction",
            duration_in_days: 5,
            description: "Learn how to code and do simple websites",
            logo: null
        },
        {
            id: 4,
            slug: "full-stack-ft",
            name: "Full-Stack Software Developer FT",
            duration_in_days: 45,
            description: "Develop web applications using React.js and building your own API.",
            logo: null
        },
        {
            id: 5,
            slug: "mentoring",
            name: "Become a Mentor",
            duration_in_days: 0,
            description: "Guidelines for teachers and mentors at 4Geeks Academy",
            logo: null
        },
        {
            id: 6,
            slug: "front-end-development",
            name: "Front End Development",
            duration_in_days: 36,
            description: "Develop applications using HTML,CSS,Javascript and React using headless CMS or API's",
            logo: null
        },
        {
            id: 7,
            slug: "back-end-development",
            name: "Back-End Development",
            duration_in_days: 39,
            description: "Starting with the basics of Python, then the command line, working with file storage, data structures, building API's, etc.",
            logo: null
        },
        {
            id: 8,
            slug: "coding-for-executives",
            name: "Coding for Executives",
            duration_in_days: 30,
            description: "Ideal for executives and busy people interested in getting into the world of code.",
            logo: null
        },
        {
            id: 9,
            slug: "software-engineering",
            name: "Software Engineering",
            duration_in_days: 45,
            description: "Second level for the full-stack development.",
            logo: null
        },
        {
            id: 10,
            slug: "full-stack-pt-immersive",
            name: "Full Stack PT Immersive",
            duration_in_days: 60,
            description: "Full Stack syllabus spreaded in 12 weeks at 5 days a week 3 hours every day.",
            logo: null
        },
        {
            id: 11,
            slug: "front-end-pt-immersive",
            name: "Front End PT Immersive",
            duration_in_days: 48,
            description: "48 days",
            logo: null
        }
      
      ]
  
   
    

  ).as('syllabus_certificates')
});  

Cypress.Commands.add('certificates_versions', () => {
  // send certificates versions options names 
  cy.intercept('GET', '**/admissions/syllabus/full-stack/version', [{
    version: 1,
    certificate: {
      id: 1,
      slug: "full-stack",
      name: "Full-Stack Software Developer",
      duration_in_days: 48,
      // description: "Guidelines for teachers and mentors at 4Geeks Academy",
      // logo: null,
    }
   
  }] ).as('certificates_versions')
});  

Cypress.Commands.add('mock_new_cohort', () => {
  
  cy.intercept('POST', '**/admissions/academy/cohort', 
    [{
      id: 221,
      slug: "isra-ptwnxs",
      name: "isra-cohwnxe",
      kickoff_date: "2021-09-14T19:04:00.529000-04:00",
      current_day: 0,
      academy: {
          id: 4,
          slug: "downtown-miami",
          name: "Downtown Miami",
          street_address: "1801 SW 3rd Ave #100, Miami, FL 33129",
          country: "us",
          city: 1
      },
      syllabus: "full-stack.v1",
      ending_date: null,
      stage: "INACTIVE",
      language: "en",
      created_at: "2021-09-14T19:13:29.119640-04:00",
      updated_at: "2021-09-14T19:13:29.119653-04:00",
      never_ends: true
  }]
   
   ).as('mock_new_cohort')
});  

Cypress.Commands.add('mock_list_cohortsA', () => {
  // the list of cohorts BEFORE adding a new cohort
  cy.intercept('GET', '**/admissions/academy/cohort?**', 
    {
      count: 40,
      first: null,
      next: "https://breathecode-test.herokuapp.com/v1/admissions/academy/cohort?limit=10&offset=10",
      previous: null,
      last: "https://breathecode-test.herokuapp.com/v1/admissions/academy/cohort?limit=10&offset=30",
      results: [
            
          {
              id: 221,
              slug: "Caracas-V full time",
              name: "Caracas-V",
              never_ends: true,
              private: false,
              language: "en",
              kickoff_date: "2021-09-14T23:04:00.529000Z",
              ending_date: null,
              current_day: 0,
              stage: "ENDED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 220,
              slug: "Madrid 3 part time",
              name: "Madrid-III-PT",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-09-14T23:03:32.259000Z",
              ending_date: "2021-09-14T23:03:32.338000Z",
              current_day: 0,
              stage: "INACTIVE",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 219,
              slug: "test-cohort #254",
              name: "test-cohort254",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-09-14T22:55:21.508000Z",
              ending_date: "2021-09-14T22:55:21.542000Z",
              current_day: 0,
              stage: "INACTIVE",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 218,
              slug: "test-cohortA",
              name: "test A",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-09-14T21:37:58.187000Z",
              ending_date: "2021-09-20T21:37:00Z",
              current_day: 0,
              stage: "INACTIVE",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 178,
              slug: "miami_pt_xxx",
              name: "Miami PT XXX",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-07-02T18:54:00Z",
              ending_date: "2021-11-29T19:54:00Z",
              current_day: 0,
              stage: "STARTED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 213,
              slug: "kendall_I",
              name: "Kendall",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-06-18T17:29:25Z",
              ending_date: "2021-10-01T17:29:54Z",
              current_day: 0,
              stage: "DELETED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 216,
              slug: "delete3-cohort",
              name: "delete3-cohort",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-06-15T14:24:10.700000Z",
              ending_date: "2021-07-16T14:24:00Z",
              current_day: 0,
              stage: "ENDED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 215,
              slug: "delete2-cohort",
              name: "delete2-cohort",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-06-15T14:23:35.890000Z",
              ending_date: "2021-08-27T14:23:00Z",
              current_day: 0,
              stage: "DELETED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 214,
              slug: "delete-cohort",
              name: "Delete Chort",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-06-15T14:23:12.891000Z",
              ending_date: "2021-06-30T14:23:00Z",
              current_day: 0,
              stage: "DELETED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 212,
              slug: "sample-cohort-2",
              name: "Sample Cohort 2",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-06-01T22:38:19.160000Z",
              ending_date: "2021-06-26T22:38:00Z",
              current_day: 0,
              stage: "STARTED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          }
      ]
  }
   
   ).as('mock_list_cohortsA')
});  

Cypress.Commands.add('mock_list_cohortsB', () => {
  // the list of cohorts AFTER adding a new cohort
  cy.intercept('GET', '**/admissions/academy/cohort?**', 
    {
      count: 40,
      first: null,
      next: "https://breathecode-test.herokuapp.com/v1/admissions/academy/cohort?limit=10&offset=10",
      previous: null,
      last: "https://breathecode-test.herokuapp.com/v1/admissions/academy/cohort?limit=10&offset=30",
      results: [
            {
              id: 555,
              slug: "Porlamar_7_full_time",
              name: "Porlamar-VII",
              never_ends: true,
              private: false,
              language: "en",
              kickoff_date: "2021-09-14T23:04:00.529000Z",
              ending_date: null,
              current_day: 0,
              stage: "STARTED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 221,
              slug: "Caracas-V full time",
              name: "Caracas-V",
              never_ends: true,
              private: false,
              language: "en",
              kickoff_date: "2021-09-14T23:04:00.529000Z",
              ending_date: null,
              current_day: 0,
              stage: "ENDED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 220,
              slug: "Madrid 3 part time",
              name: "Madrid-III-PT",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-09-14T23:03:32.259000Z",
              ending_date: "2021-09-14T23:03:32.338000Z",
              current_day: 0,
              stage: "INACTIVE",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 219,
              slug: "test-cohort #254",
              name: "test-cohort254",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-09-14T22:55:21.508000Z",
              ending_date: "2021-09-14T22:55:21.542000Z",
              current_day: 0,
              stage: "INACTIVE",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 218,
              slug: "test-cohortA",
              name: "test A",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-09-14T21:37:58.187000Z",
              ending_date: "2021-09-20T21:37:00Z",
              current_day: 0,
              stage: "INACTIVE",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 178,
              slug: "miami_pt_xxx",
              name: "Miami PT XXX",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-07-02T18:54:00Z",
              ending_date: "2021-11-29T19:54:00Z",
              current_day: 0,
              stage: "STARTED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 213,
              slug: "kendall_I",
              name: "Kendall",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-06-18T17:29:25Z",
              ending_date: "2021-10-01T17:29:54Z",
              current_day: 0,
              stage: "DELETED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 216,
              slug: "delete3-cohort",
              name: "delete3-cohort",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-06-15T14:24:10.700000Z",
              ending_date: "2021-07-16T14:24:00Z",
              current_day: 0,
              stage: "ENDED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 215,
              slug: "delete2-cohort",
              name: "delete2-cohort",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-06-15T14:23:35.890000Z",
              ending_date: "2021-08-27T14:23:00Z",
              current_day: 0,
              stage: "DELETED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 214,
              slug: "delete-cohort",
              name: "Delete Chort",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-06-15T14:23:12.891000Z",
              ending_date: "2021-06-30T14:23:00Z",
              current_day: 0,
              stage: "DELETED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          },
          {
              id: 212,
              slug: "sample-cohort-2",
              name: "Sample Cohort 2",
              never_ends: false,
              private: false,
              language: "en",
              kickoff_date: "2021-06-01T22:38:19.160000Z",
              ending_date: "2021-06-26T22:38:00Z",
              current_day: 0,
              stage: "STARTED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          }
      ]
  }
   
   ).as('mock_list_cohortsB')
});  



Cypress.Commands.add('cohort_search_result', () => {
  // the list of cohorts AFTER adding a new cohort
  cy.intercept('GET', '**/admissions/academy/cohort?**', 
    {
      count: 40,
      first: null,
      next: "https://breathecode-test.herokuapp.com/v1/admissions/academy/cohort?limit=10&offset=10",
      previous: null,
      last: "https://breathecode-test.herokuapp.com/v1/admissions/academy/cohort?limit=10&offset=30",
      results: [
            {
              id: 555,
              slug: "Porlamar_7_full_time",
              name: "Porlamar-VII",
              never_ends: true,
              private: false,
              language: "en",
              kickoff_date: "2021-09-14T23:04:00.529000Z",
              ending_date: null,
              current_day: 0,
              stage: "STARTED",
              specialty_mode: null,
              syllabus_version: null,
              academy: {
                  id: 4,
                  slug: "downtown-miami",
                  name: "Downtown Miami",
                  country: {
                      code: "us",
                      name: "USA"
                  },
                  city: {
                      name: "Miami"
                  },
                  logo_url: "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
              }
          }
      
      ]
  }
   
   ).as('cohort_search_result')
});  


// NOTE: _____________________________EDIT COHORTS COMANDS_____________________________


Cypress.Commands.add('cohort_edit_new', () => {
    // the data of the new cohort so can be edit
    cy.intercept('GET', '**/admissions/academy/cohort/Porlamar_7_full_time', 

    {
        "id": 158,
        "slug": "miami-xxx",
        "name": "Miami XXX",
        "never_ends": false,
        "private": false,
        "language": "en",
        "kickoff_date": "2021-12-07T01:00:00Z",
        "ending_date": "2022-04-22T00:00:00Z",
        "current_day": 0,
        "stage": "INACTIVE",
        "specialty_mode": null,
        "syllabus_version": {
            "version": 4,
            "slug": "full-stack",
            "name": "Full-Stack Software Developer",
            "syllabus": 41,
            "duration_in_hours": 320,
            "duration_in_days": 48,
            "week_hours": 9,
            "github_url": null,
            "logo": "https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack",
            "private": false
        },
        "academy": {
            "id": 4,
            "slug": "downtown-miami",
            "name": "4Geeks Academy Miami",
            "country": {
                "code": "us",
                "name": "USA"
            },
            "city": {
                "name": "Miami"
            },
            "logo_url": "https://storage.googleapis.com/admissions-breathecode/location-downtown-miami"
        }
    }

    ).as('cohort_edit_new')
}); 

Cypress.Commands.add('cohort_edit_syllabus', () => {
    // the data of the new cohort so can be edit
    cy.intercept('GET', '**/admissions/syllabus', 
      
    [
        {
            "id": 30,
            "slug": "web-development",
            "name": "Web Developer",
            "github_url": null,
            "duration_in_hours": 126,
            "duration_in_days": 42,
            "week_hours": 9,
            "logo": null,
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.495197Z",
            "updated_at": "2021-09-14T23:33:08.495221Z"
        },
        {
            "id": 31,
            "slug": "coding-introduction",
            "name": "Coding Introduction",
            "github_url": null,
            "duration_in_hours": 40,
            "duration_in_days": 5,
            "week_hours": 8,
            "logo": null,
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.500168Z",
            "updated_at": "2021-09-14T23:33:08.500185Z"
        },
        {
            "id": 32,
            "slug": "mentoring",
            "name": "Become a Mentor",
            "github_url": null,
            "duration_in_hours": 0,
            "duration_in_days": 0,
            "week_hours": null,
            "logo": null,
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.504554Z",
            "updated_at": "2021-09-14T23:33:08.504570Z"
        },
        {
            "id": 33,
            "slug": "front-end-development",
            "name": "Front End Development",
            "github_url": null,
            "duration_in_hours": 108,
            "duration_in_days": 36,
            "week_hours": 9,
            "logo": null,
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.509065Z",
            "updated_at": "2021-09-14T23:33:08.509079Z"
        },
        {
            "id": 34,
            "slug": "back-end-development",
            "name": "Back-End Development",
            "github_url": null,
            "duration_in_hours": 108,
            "duration_in_days": 39,
            "week_hours": 12,
            "logo": null,
            "private": false,
            "academy_owner": null,
            "created_at": "2021-09-14T23:33:08.511300Z",
            "updated_at": "2021-09-14T23:33:08.511314Z"
        },
        {
            "id": 35,
            "slug": "coding-for-executives",
            "name": "Coding for Executives",
            "github_url": null,
            "duration_in_hours": 120,
            "duration_in_days": 30,
            "week_hours": 4,
            "logo": null,
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.515720Z",
            "updated_at": "2021-09-14T23:33:08.515734Z"
        },
        {
            "id": 36,
            "slug": "full-stack-ft",
            "name": "Full-Stack Software Developer FT",
            "github_url": null,
            "duration_in_hours": 320,
            "duration_in_days": 45,
            "week_hours": 40,
            "logo": "https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack-ft",
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.520272Z",
            "updated_at": "2021-09-14T23:33:08.520285Z"
        },
        {
            "id": 37,
            "slug": "software-engineering",
            "name": "Software Engineering",
            "github_url": null,
            "duration_in_hours": 350,
            "duration_in_days": 35,
            "week_hours": 9,
            "logo": null,
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.524578Z",
            "updated_at": "2021-09-14T23:33:08.524590Z"
        },
        {
            "id": 38,
            "slug": "front-end-pt-immersive",
            "name": "Front End PT Immersive",
            "github_url": null,
            "duration_in_hours": 144,
            "duration_in_days": 48,
            "week_hours": 12,
            "logo": null,
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.528894Z",
            "updated_at": "2021-09-14T23:33:08.528907Z"
        },
        {
            "id": 39,
            "slug": "intro-to-web-development",
            "name": "Intro To Web Development",
            "github_url": null,
            "duration_in_hours": 60,
            "duration_in_days": 20,
            "week_hours": 15,
            "logo": null,
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.533299Z",
            "updated_at": "2021-09-14T23:33:08.533312Z"
        },
        {
            "id": 40,
            "slug": "full-stack-ft-node-10w",
            "name": "Full-Stack - FT - Node - 10w",
            "github_url": null,
            "duration_in_hours": 400,
            "duration_in_days": 50,
            "week_hours": 40,
            "logo": null,
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.537704Z",
            "updated_at": "2021-09-14T23:33:08.537716Z"
        },
        {
            "id": 41,
            "slug": "full-stack",
            "name": "Full-Stack Software Developer",
            "github_url": null,
            "duration_in_hours": 320,
            "duration_in_days": 48,
            "week_hours": 9,
            "logo": "https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack",
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.542059Z",
            "updated_at": "2021-09-14T23:33:08.542072Z"
        },
        {
            "id": 42,
            "slug": "machine-learning-pt-16w",
            "name": "Machine Learning Engineering",
            "github_url": null,
            "duration_in_hours": 320,
            "duration_in_days": 48,
            "week_hours": 20,
            "logo": null,
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.546323Z",
            "updated_at": "2021-09-14T23:33:08.546336Z"
        },
        {
            "id": 43,
            "slug": "intro-to-machine-learning-python-2w",
            "name": "Intro to Machine Learning with Python",
            "github_url": null,
            "duration_in_hours": 40,
            "duration_in_days": 12,
            "week_hours": 9,
            "logo": null,
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.550816Z",
            "updated_at": "2021-09-14T23:33:08.550828Z"
        },
        {
            "id": 44,
            "slug": "full-stack-pt-immersive",
            "name": "Full Stack PT Immersive",
            "github_url": null,
            "duration_in_hours": 180,
            "duration_in_days": 60,
            "week_hours": 15,
            "logo": null,
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.555172Z",
            "updated_at": "2021-09-14T23:33:08.555186Z"
        },
        {
            "id": 45,
            "slug": "your-first-job",
            "name": "Your First Job",
            "github_url": null,
            "duration_in_hours": 160,
            "duration_in_days": 60,
            "week_hours": 20,
            "logo": null,
            "private": false,
            "academy_owner": 4,
            "created_at": "2021-09-14T23:33:08.559551Z",
            "updated_at": "2021-09-14T23:33:08.559565Z"
        },
        {
            "id": 46,
            "slug": "imf-prework",
            "name": "IMF Prework",
            "github_url": null,
            "duration_in_hours": 60,
            "duration_in_days": 15,
            "week_hours": 20,
            "logo": "https://d3qmr1ohejzvpt.cloudfront.net/img/logos/logo-imf.svg",
            "private": false,
            "academy_owner": 6,
            "created_at": "2021-09-14T23:33:08.563991Z",
            "updated_at": "2021-09-14T23:33:08.564005Z"
        }
    ]
     
     ).as('cohort_edit_syllabus')
  }); 

  Cypress.Commands.add('cohort_edit_version', () => {
    // the data of the new cohort so can be edit
    cy.intercept('GET', '**/admissions/syllabus/full-stack/version', 
      
    [
        {
            "json": "{\"label\":\"Full-Stack Development\",\"profile\":\"full-stack\",\"description\":\"Become a full-stack web developer using the 2 most popular technologies in the world: Javascript, React and Python\",\"days\":[{\"label\":\"Day 1\",\"description\":\"During the prework you learned basic HTML and CSS, but here your will learn the evolved CSS that enables amazing layouts with boxes and also a rich set of CSS Selectors\",\"instructions\":\"Students know already basic CSS and HTML, just go over the concepts really fast but stop and explain carefully the Display and Position rules. Then, start coding the project.\",\"project\":{\"title\":\"Simple Instagram\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/instagram-feed#readme\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/instagram-without-bootstrap\\/\"},\"homework\":\"Students must finish the Instagram & the Postcard.\",\"key-concepts\":[\"Everything is text!\",\"Always Be Closing\",\"Client vs Server\",\"HTTP Request vs Response\",\"Browser Interpretation\",\"HTML vs CSS\",\"CSS Selectors (basic ones)\",\"Do not use ID as CSS selectors (use specificity)\",\"::Before & ::After Selectors\",\"DRY Technique\",\"Box Model\"],\"lessons\":[{\"title\":\"Doing Layouts\",\"slug\":\"css-layouts\"},{\"title\":\"Advanced CSS Selectors\",\"slug\":\"mastering-css-selectors\"}],\"replits\":[{\"title\":\"Doing Layouts\",\"slug\":\"layouts\"}],\"quizzes\":[{\"title\":\"Basics of HTML\",\"slug\":\"html\"},{\"title\":\"Internet Architecture\",\"slug\":\"internet-architecture\"},{\"title\":\"Basics of CSS\",\"slug\":\"css\"}],\"assignments\":[\"instagram-feed\",\"postcard\",\"instagram-post\"],\"technologies\":[\"CSS3\",\"HTML5\"]},{\"label\":\"Day 2\",\"description\":\"Bootstrap arrived to profesionalize websites, removing 99% of the layout pain. Everything is a component from now on.\",\"instructions\":\"Explain bootstrap and how it solves 99% of the pain. Everything is a component from now own.\",\"project\":{\"title\":\"Bootstrap Instagram\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/instagram-feed-bootstrap#readme\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/instagram-with-bootstrap\\/\"},\"lessons\":[{\"title\":\"Working with Bootstrap\",\"slug\":\"bootstrap-tutorial-of-bootstrap-4\"}],\"replits\":[{\"title\":\"Working with Bootstrap\",\"slug\":\"bootstrap\"}],\"assignments\":[\"instagram-feed-bootstrap\"],\"key-concepts\":[\"Bootstrap\",\"Components\",\"Workflow: Identify the components, Copy&Paste them and finally customize them\",\"Helper\\/Utility Classes that come with Bootstrap\"],\"technologies\":[\"Bootstrap\"]},{\"label\":\"Day 3\",\"description\":\"A text editor and the console - that's all you need to be a great coder. Time to master the second one.\",\"teacher_instructions\":\"Teach the command line to your students, use the CMD challenge to make it very fun! Start with a small explanation about the importance of the CMD and then explain each command after its respective challenge is completed.\",\"project\":{\"title\":\"The CMD Challenge\",\"instructions\":\"https:\\/\\/github.com\\/breatheco-de\\/exercise-terminal-challenge\\/\"},\"replits\":[{\"title\":\"Command Line Interactive Challenge\",\"slug\":\"the-command-line\"}],\"lessons\":[{\"title\":\"The Command Line\",\"slug\":\"the-command-line-the-terminal\"}],\"homework\":\"At the end of the class, present the students with the GIT project & please ask each student to start coding its corresponding part of the website.\",\"key-concepts\":[\"Most used CMD commands\",\"File Directory Hierarchy\",\"Relative .\\/ vs Absolute Paths \",\"Moving Up ..\",\"Autocomplete with TAB\",\"GIT in a general way\"],\"technologies\":[\"Command Line\"]},{\"label\":\"Day 4\",\"description\":\"The CMD Line has millions of tools, it's time to learn the first ones: GIT & Github - together they make collaboration amazing!\",\"instructions\":\"Time to explain and practice with GIT in detail, create a repository for your Landing Page GIT project and make them clone it and upload their piece of the project. Review the key concepts.\",\"project\":{\"title\":\"GIT Colaborative Landing Page\",\"instructions\":\"https:\\/\\/github.com\\/breatheco-de\\/exercise-collaborative-html-website\\/\"},\"homework\":\"If some of the students have not finished their piece of the landing page, they have to finish it by next class, also ask them to try starting to deliver all the previous projects thru the BreatheCode Platform. Lastly ask them to finish all replits and projects.\",\"key-concepts\":[\"Do not explain Git SSH credentials in detail, students must use HTTP\",\"Why using Github?\",\"It will be impossible to avoid using github\",\"The Commit Object\",\"The HEAD\",\"The Stage\",\"Branch\",\"Commit vs PUSH\",\"Resolving Conflicts\"],\"replits\":[{\"title\":\"Git interactive tutorial\",\"slug\":\"git\"}],\"lessons\":[{\"title\":\"GIT (Version Control System)\",\"slug\":\"how-to-use-git-version-control-system\"}],\"technologies\":[\"Git\",\"Github\",\"Markdown\"]},{\"label\":\"Day 5\",\"teacher_instructions\":\"Students have a lot of homework, today is perfect catch-up day and also learning on how to contribute on Github by fixing misspells.\",\"description\":\"There is a lot to do, use this class to catch up on all your homework and ask any questions you may have because next day we are starting javascript!\",\"project\":{\"title\":\"HTML5 Form\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/html5-form#readme\",\"solution\":\"https:\\/\\/repl.it\\/@4GeeksAcademy\\/Bootstrap-Form\"},\"homework\":\"Finish Replits and Projects\",\"lessons\":[{\"title\":\"Using Inputs and Forms\",\"slug\":\"html-input-html-textarea\"}],\"replits\":[{\"title\":\"Working with Bootstrap\",\"slug\":\"forms\"}],\"assignments\":[\"html5-form\",\"fix-the-misspell\"]},{\"label\":\"Day 6\",\"description\":\"HTML & CSS are great, but the world needed interactive pages (not just beautiful text documents). JavaScript comes to help us generate HTML & CSS based commands after the initial text document has already loaded.  JavaScript will also re-write the website live, based on the user's activity.\",\"instructions\":\"Explain the basic coding concepts (variables, data-types, functions, loops, arrays, etc.), then start the excuse generator is a great way to explain how JavaScript and HTML\\/CSS can play together. Use the VanillaJS boilerplate, that way students will start getting used to it\",\"project\":{\"title\":\"The Excuse Generator\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/excuse-generator#readme\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/excuse-generator\\/\"},\"homework\":\"Students need to finish the Excuse Generator, make the replits about JavaScript and complete the layout for the Random Card Generator\",\"key-concepts\":[\"All datatypes in javascript\",\"What is a variable\",\"Arrays\",\"The code is a procedure from top to bottom (for now)\",\"You can skip lines with conditionals\",\"Do not explain looping yet\",\"Do not explain functions yet\",\"Null vs Undefined\",\"Generating random numbers\"],\"lessons\":[{\"title\":\"Learning to code with JS\",\"slug\":\"what-is-javascript-learn-to-code-in-javascript\"}],\"replits\":[{\"title\":\"Introduction to JS\",\"slug\":\"js-beginner\",\"vtutorial_slug\":\"begin-js\"}],\"assignments\":[\"excuse-generator\"],\"technologies\":[\"JavaScript\"]},{\"label\":\"Day 7\",\"teacher_instructions\":\"Today we will be introducing webpack and npm for the first time, just the basics. Ask students to gather and create a flow chart on the whiteboard with the decision process behind building the html for the profile card project. Finish conditional profile card and all previous replits. \",\"description\":\"What we call \\\"thinking\\\" is basically the process of making decisions based on some information (variables) that we have available. You can replicate the same behavior in a computer by using conditionals and logical operations.\",\"homework\":\"Finish the profile card and replits to date\",\"project\":{\"title\":\"Conditional Profile Card\",\"instructions\":\"https:\\/\\/github.com\\/breatheco-de\\/conditional-profile-card\"},\"replits\":[{\"title\":\"Working with functions\",\"slug\":\"functions\"},{\"title\":\"Mastering JS\",\"slug\":\"js-devmaker\"}],\"lessons\":[{\"title\":\"Using Conditional in Algorithms\",\"slug\":\"conditionals-in-programing-coding\"},{\"title\":\"Bundling with Webpack\",\"slug\":\"what-is-webpack\"}],\"assignments\":[\"conditional-profile-card\"],\"key-concepts\":[\"Every JavaScript code starts OnLoad\",\"String Concatenation\",\"Variable Initialization\",\"If... Else\",\"Some times else is not needed\",\"Ternaries and one case were they make sense\",\"What is compiling?\",\"Why the Javascript community decided to bundle (compatibility, ES6, performance, etc.)\",\"Please do not attempt to explain the Webpack Config.\",\"Bundling JS, CSS & Images\",\"Include your bundle on index.html\",\"We can use NPM to download popular functions (libraries)\"],\"technologies\":[\"Webpack\",\"Javascript Conditionals\"]},{\"label\":\"Day 8\",\"instructions\":\"Review everything we have seen so far very quick, reinforce that we are building HTML using JS now, ask the students and ask them to strategize on the white board, before starting to code reinforce the ONLOAD function as the beginning of your application, start using the breathecode-cli and vanilla-js \",\"description\":\"Arrays are the only way to have a list of things in programming, and they are challenging because developers need to master the art of getting or setting values from arrays using loops\",\"project\":{\"title\":\"Domain Name Generator\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/domain-generator#readme\"},\"homework\":\"Finish the domain name generator and work hard on the JS replits for Begin JS, Arrays, Functions and Mastering JS\",\"replits\":[{\"title\":\"Looping and Arrays\",\"slug\":\"arrays\"}],\"lessons\":[{\"title\":\"Looping and Arrays\",\"slug\":\"what-is-an-array-define-array\"}],\"assignments\":[\"domain-generator\"],\"key-concepts\":[\"Functions (anonymous vs normal)\",\"The forEach\",\"Every JavaScript code starts OnLoad\",\"String Concatenation\",\"Main website events: PreLoad & OnLoad\",\"The-Runtime (after OnLoad)\",\"Introduce the DOM\",\"Use querySelector() to select DOM Elements just like you do with CSS\",\"Add\\/Remove CSS Classes to DOM elements\",\"Please do not attempt to explain the Webpack Config.\",\"Bundling JS, CSS & Images.\",\"Include your bundle on index.html (only one scriptag from no on)\"],\"technologies\":[\"Javascript Arrays and Loops\"]},{\"label\":\"Day 9\",\"teacher_instructions\":\"Finish pending replits, make sure students upload projects into their github accounts and finish the Student External Profile\",\"description\":\"Your entire journey at the academy can de summarized into one landing page: The Student External Profile. It is time to start building it.\",\"homework\":\"Students must finish their student external profile and start the replits about Begin JS, Arrays and Functions\",\"project\":{\"title\":\"Student External Profile\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/learn-in-public#readme\",\"solution\":\"http:\\/\\/sep.4geeksacademy.co\\/alesanchezr\"},\"replits\":[{\"title\":\"Working with Functions\",\"slug\":\"functions\"}],\"lessons\":[{\"title\":\"Working with Functions\",\"slug\":\"working-with-functions\"}],\"key-concepts\":[\"How to Pull Request\",\"How to use GIT\",\"What is the Student External Profile\",\"Store Using YML\"],\"technologies\":[\"Javascript Functions\",\"Git\"],\"assignments\":[\"learn-in-public\"]},{\"label\":\"Day 10\",\"teacher_instructions\":\"Do the Random Card using the VanillaJS template but focusing a lot on the workflow (how to plan your strategy and begin coding), reinforce the Window.onLoad event and how to change CSS styles from JS (apply rules and classes)\",\"description\":\"Ok but how do we use JavaScript to build websites? You have to interact with The DOM to create dynamic HTML\\/CSS and wait for events to occur\",\"project\":{\"title\":\"Random Card Generator\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/random-card\\/\"},\"homework\":\"Finish the Random Card and pending replits, start DOM & EVENTS replits\",\"replits\":[{\"title\":\"The DOM\",\"slug\":\"the-dom\"},{\"title\":\"Events\",\"slug\":\"events\"}],\"lessons\":[{\"title\":\"Introduction to Front-End Web Development\",\"slug\":\"what-is-front-end-development\"},{\"title\":\"The DOM\",\"slug\":\"what-is-dom-define-dom\"},{\"title\":\"Events\",\"slug\":\"event-driven-programming\"}],\"assignments\":[\"random-card\"],\"key-concepts\":[\"Main website events: PreLoad & OnLoad\",\"The-Runtime (after OnLoad)\",\"Introduce the DOM\",\"Use querySelector() to select DOM Elements just like you do with CSS\",\"Add\\/Remove CSS Classes to DOM elements\",\"Please do not attempt to explain the Webpack Config.\",\"Bundling JS, CSS & Images.\",\"Include your bundle on index.html\"],\"technologies\":[\"DOM\",\"Events\"]},{\"label\":\"Day 11\",\"description\":\"You have a lot of things to cach up on, finish and deliver the replit exercises and projects. Make sure to review the last replit of events (todo list).\",\"teacher_instructions\":\"Help students finish the replit exercises and projects. Make sure to review the last replit of events (todo list). IMPORTANT: This next coding weekend will be the last before getting into react, encourage students to attend.\",\"project\":\"Work on the replits and projects\",\"homework\":\"Finished Replits and Projects\"},{\"label\":\"Day 12\",\"instructions\":\"It's the first time students will be using objects, explain the concept (without classes). Make students create their first react components and explain the use of JSX. Only talk about functinal components, class components will be explained later. Landing page project should be a code along at start, then groups at end.\",\"description\":\"But working with the DOM can get tricky and it's resource consuming, for that and many other reasons libraries like React.js got popular in the last couple of years. The let you create HTML and CSS using JS in a very intuitive way.\",\"project\":{\"title\":\"Landing Page with React\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/landing-page-with-react#readme\"},\"homework\":\"Students must finish the landing page with react for the next class\",\"lessons\":[{\"title\":\"Object Oriented Programming\",\"slug\":\"what-is-object-oriented-programming-concepts\"},{\"title\":\"Building interfaces with React\",\"slug\":\"learn-react-js-tutorial\"},{\"title\":\"Creating React.js Components\",\"slug\":\"making-react-components\"},{\"title\":\"React Hooks Explained\",\"slug\":\"react-hooks-explained\"},{\"title\":\"Importing and Exporting from other JS files\",\"slug\":\"javascript-import\"}],\"replits\":[{\"title\":\"Object Oriented Programming\",\"slug\":\"object-oriented-programing\"},{\"title\":\"Using React.js as a Rendering Engine\",\"slug\":\"react-js\"}],\"assignments\":[\"simple-counter-react\",\"landing-page-with-react\"],\"key-concepts\":[\"Export -> Import modules\",\"You can create your own tags\",\"Create a Component like a Function\",\"JSX Syntax\",\"Component Properties\"],\"technologies\":[\"React\",\"O.O. Programing\"]},{\"label\":\"Day 13\",\"description\":\"Its the first time you've heard or learn about react, we have given you a lot of exercises to practice. Please practice like crazy with all of them. Ask questions.\",\"instructions\":\"Students have now a lot of homework: The React Replits, Traffic Light, Counter and the Landing page. Work with students to help them complete the developments.\",\"project\":{\"title\":\"Simple Counter with React\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/simple-counter-react#readme\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/simple-counter-react\"},\"homework\":\"Finished Replits and Projects\",\"lessons\":[{\"title\":\"Creating React.js Components\",\"slug\":\"making-react-components\"},{\"title\":\"React Hooks Explained\",\"slug\":\"react-hooks-explained\"},{\"title\":\"Importing and Exporting from other JS files\",\"slug\":\"javascript-import\"}],\"replits\":[{\"title\":\"Using React.js as a Rendering Engine\",\"slug\":\"react-js\"}],\"assignments\":[\"simple-counter-react\"]},{\"label\":\"Day 14\",\"instructions\":\"Review landing page. React as rendering engine: Students need to understand that now they can finally create their own HTML tags (React Components) and how to use the State and the Props. Have the class discuss the strategy for todo-list\",\"description\":\"Finally we can create our own HTML tags and re-use them on several projects and views. The key to understand a component is understanding Props and The State. Please continue working on the Todo-List Application.\",\"project\":{\"title\":\"Todo list with React\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/todo-list\\/\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/todo-list#readme\"},\"assignments\":[\"todo-list\",\"traffic-light-react\"],\"key-concepts\":[\"Controlled Inputs\",\"Condigional Rendering\",\"The component state\",\"The state is inmutable\",\"State vs Props\",\"Using const, map, filter and concat to prevent state mutation\"],\"homework\":\"Students must finish the TodoList being able to add & delete tasks.\",\"technologies\":[\"Class Components\"]},{\"label\":\"Day 15\",\"description\":\"Most of the applications build on the internet require some king of database syncronization, normal made thru several API requests.\",\"teacher_instructions\":\"Introduce the concept of fetching help students finish the todo list and incorporate the synconization with the API\",\"project\":{\"title\":\"Todo list with React and Fetch\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/todo-list-react-with-fetch#readme\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/todolist-with-fetch\"},\"homework\":\"Students must finish the all replits and projects\",\"lessons\":[{\"title\":\"Asynchronous Scripting with Javascript\",\"slug\":\"asynchronous-algorithms-async-await\"},{\"title\":\"Javascript Fetch API\",\"slug\":\"the-fetch-javascript-api\"},{\"title\":\"Understanding REST API's\",\"slug\":\"understanding-rest-apis\"}],\"assignments\":[\"todo-list-react-with-fetch\"],\"key-concepts\":[\"Using Fetch to retrieve information from the server\",\"Asyncrunus Programing\",\"Component Did Mount its ideal to fetch info\",\"Initializations on the component contructor before fetching\",\"Displaying a 'loading' before the data arrives\",\"Reseting the state when fetch finalizes\",\"POSTing, PUTing and DELETEing data to the server\",\"Sync the state with the server\"],\"technologies\":[\"Fetch API\"]},{\"label\":\"Day 16\",\"description\":\"You know exactly how to build small js apps, but what if your application will have several pages\\/views? E.g.: Having a 'Settings' page on the Spotify clone. We need to connect different URLs to our React Components. Welcome to the world of Routing.\",\"teacher_instructions\":\"This project is all about URLs and Routing. Each student must build two views\\/pages: One List and one Single. For example: List of Space Ships and a view for a single Space Ship. The have to make sure the URL's are propery setup on the reouter and also that the information is fetch on the didmount of the respectiv view. Also, you will be using the Context API for MVC (Store, View, Actions)\",\"project\":{\"title\":\"Starwars blog with reading list\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/starwars-blog-reading-list\\/\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/starwars-blog-reading-list#readme\"},\"homework\":\"Students must finish the all replits and projects\",\"lessons\":[{\"title\":\"Using React Router\",\"slug\":\"routing-our-views-with-react-router\"},{\"title\":\"Learning about Context.API\",\"slug\":\"context-api\"}],\"assignments\":[\"starwars-blog-reading-list\"],\"key-concepts\":[\"Connecting Components to URLS (Routing)\",\"Defining Parameters on the URL Path\",\"Retrieving URL parameters with match.params\",\"Using withProps for components not connected directly to the <Route>\",\"Redirecting with history.push\",\"Fetching on didmount\"],\"technologies\":[\"FLUX & Context\"]},{\"label\":\"Day 17\",\"description\":\"Lets warp the last things about the Starwars Blog because we are about to dive into and exciting journey inside the world of backend! :)\",\"teacher_instructions\":\"Help students finish the starwars blog and also any other previous exercises and project and publish them to github\",\"project\":{\"title\":\"Starwars blog with reading list\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/starwars-blog-reading-list\\/\",\"instructions\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/starwars-blog-reading-list\\/\"},\"homework\":\"Students must finish the all replits and projects\",\"lessons\":[],\"assignments\":[],\"key-concepts\":[],\"technologies\":[\"FLUX & Context\"]},{\"label\":\"Day 18\",\"teacher_instructions\":\"Now you can deep further into HTTP: Explain the other methods POST, PUT, DELETE. Present the new project that uses FLUX, Context and Fetch again, but now it lets the user to Create, Update and Delete information using an API\",\"description\":\"When your real application is almost ready, it's time to integrate with a real database. That will enable it to work with real information: Create, Update, Delete and get real data. We do HTTP Requests for that.\",\"project\":{\"title\":\"Contact List (Using Context-API)\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/contact-list-context#readme\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/contact-list\"},\"replits\":[],\"assignments\":[\"contact-list-context\"],\"key-concepts\":[\"How to use POSTMan, set environment variables and use collections\",\"JSON is a JavaScript object but as TEXT\",\"The goal is to send\\/receive everything as JSON Serialize>Send>Unserialize\",\"What is serialization and how to do it (Parsing)\",\"Why use several request types (GET, POST, PUT, DELETE)?\",\"Explain the 3 main content-types: Form, URL-Encoded, Raw (With JSON)\"],\"homework\":\"Using POSTman, and then using React, students must consume the API to Save, Delete and Update Contacts.\",\"technologies\":[\"HTTP\",\"AJAX\",\"JSON\",\"HTTP Fetch\",\"API\",\"Serialization\"]},{\"label\":\"Day 19\",\"instructions\":\"Finish the Contact Managment API integration, focus on Debugging procedures and start the introduction to Python\",\"description\":\"Make sure to finish the contact management project\",\"project\":{\"title\":\"Finish the Contact List\"},\"homework\":\"Students must finish the Contact Management API Integration\"},{\"label\":\"Day 20\",\"instructions\":\"One last day to finish the Contact Managment Application with your students, review all the Context, React, Components and HTTP Ajax concepts and best practices\",\"description\":\"Make sure to finish the contact management project\",\"project\":{\"title\":\"Contact Management API Integration\"},\"homework\":\"Students must finish the Contact Management Application\"},{\"label\":\"Day 21\",\"teacher_instructions\":\"Time to start the Final project! Let's give the students a break and dive into User Stories and the SCRUM methodology. Students must pick their projects & partner, and start building the user stories using Github Project. Create a project with them.\",\"description\":\"Time to start the Final project! Lets review how software is built today, you'll learn and follow the same methods used by the top tech companies in the world.\",\"project\":{\"title\":\"Final Project User Stories and Wireframes\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/full-stack-project-stories-and-wireframes#readme\"},\"lessons\":[{\"title\":\"Agile Web Development\",\"slug\":\"agile-development\"},{\"title\":\"Creating User Stories\",\"slug\":\"user-stories-examples\"}],\"assignments\":[\"full-stack-project-stories-and-wireframes\"],\"key-concepts\":[\"What is a Kanban board and how does it work\",\"How to use Github's kanban automated board\",\"Adding one issue per user story\",\"Writting stories int he users point of view\",\"Acceptance Criteria\",\"You application roles & capabilities\",\"Standup Meeting\"],\"homework\":\"Students must finish the user stories by next class, remember that the student projects must meet certain conditions to be accepted.\",\"technologies\":[\"SCRUM\",\"User Stories\",\"Kanban\",\"Agile Methodologies\"]},{\"label\":\"Day 22\",\"instructions\":\"Continue working on the final project but now start building the React Views, use the FLUX boilerplate with the students and start organizing eveyrthing from Layout.jsx\",\"description\":\"Today you will be coding your final project HTML Views and making them React Views\",\"project\":{\"title\":\"Coding the Project Views\"},\"lessons\":[],\"assignments\":[\"full-stack-project-prototype\"],\"key-concepts\":[\"Reinforce the Minimum Viable Product concept\",\"Students should not get excited about npm packages, use only a handfull\",\"Usign React-Strap is a great idea to save some time\"],\"homework\":\"Sit with every project team and discuss how to split the code into Views vs Components, students must finish their project home layout by next class\",\"technologies\":[\"Wireframing\",\"React JS\"]},{\"label\":\"Day 23\",\"description\":\"Keep working on your final project final HTML\\/CSS and React Views. Link them together as a prototype and be ready to start the backend side of the web.\",\"teacher_instructions\":\"Work with students to complete the HTML\\/CSS, React Views and Components. Make sure they are on their way to complete a 'Prototipe' that is close to the front-end side of their projects\",\"project\":{\"title\":\"Build your project Views\"},\"homework\":\"Students must deliver the first views of their projects\"},{\"label\":\"Day 24\",\"teacher_instructions\":\"Help students to finish their prototype, make sure it follows best practices and unstuck them on any problems they may encounter\",\"description\":\"Please work hard with your team on completing your front-end views, this will be the last font-end only day and we will start building your Project API next monday\",\"project\":{\"title\":\"Build your project Views\"},\"homework\":\"Students (in groups) must create a 4 page website (Home, Blog, Product, Checkout-Cart) using React Router\",\"technologies\":[\"React Router\"]},{\"label\":\"Day 25\",\"description\":\"The backend side of the web is all about creating API's for data storing and processing; and integrating with 3rd party API's. The first step of that process is storing the information.\",\"teacher_instructions\":\"Go back to HTTP and explain that the backend purpose is to respond to the requests with the right information the front-end wants. Work on doing the model\\/structure of previously made most important projects\",\"project\":{\"title\":\"Data Structure\\/Model Previous Projects\",\"instructions\":\"https:\\/\\/github.com\\/breatheco-de\\/exercise-data-model-previous-projects\"},\"homework\":\"Students must finish the all replits and projects\",\"lessons\":[{\"title\":\"Welcome to the world of Python\",\"slug\":\"python-syntax\"}],\"replits\":[{\"title\":\"Learn Python\",\"slug\":\"python-beginner\"},{\"title\":\"Learn Python Functions\",\"slug\":\"python-functions\"},{\"title\":\"Python Loops and Lists\",\"slug\":\"python-lists\"}],\"assignments\":[],\"key-concepts\":[\"Different Types of Data Structures (with examples)\",\"Review different approaches for the TODO List\",\"Review different approaches for the Contact List\",\"Object vs Array\",\"Example of a very complicated object\",\"Calculated properties like age\"],\"technologies\":[\"Data Structures & Model\"]},{\"label\":\"Day 26\",\"description\":\"Database engines are not related particular languages (like Python, PHP or Node) and they run on a different server than the website or application. For that reason and many others databases have their own language: SQL\",\"teacher_instructions\":\"The have done one database using SQL Alchemy, it is time to explain how SQL database work and how to write some SQL to interact with them, look at the full teacher instrutcions for more details\",\"project\":{\"title\":\"Work on SQL Replits\"},\"homework\":\"Students must finish the all replits and projects\",\"replits\":[{\"title\":\"Learn SQL\",\"slug\":\"sql\"}],\"lessons\":[{\"title\":\"Understanding SQL (Relational Databases)\",\"slug\":\"what-is-sql-database\"}],\"assignments\":[],\"key-concepts\":[\"SQL Table vs SQL Alchemy Model\",\"Table Relations: 1-1, 1-N, N-N\",\"Metadata vs Data\",\"INSER, UPDATET, DELETE, UPDATE\",\"ALTER, DROP\",\"Transactions: COMMT\"],\"technologies\":[\"SQL\"]},{\"label\":\"Day 27\",\"description\":\"The backend its all about data, structures and databases. Let's review how to createt a database model and connect it to our Python backend\",\"teacher_instructions\":\"Take the mayority of the class to draw the UML diagram of Instagram, then, explain User Stories with an example really fast, explain why they exists and the different between reuierments and stories and whay that matters. Build a couple of stories and then let the students start building the instagram stories right way.\",\"project\":{\"title\":\"Building Instagram Data Model & Stories\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/instagram-data-modeling#readme\"},\"homework\":\"Students must finish the all replits and projects\",\"lessons\":[{\"title\":\"SQL Alchemy\",\"slug\":\"everything-you-need-to-start-using-sqlalchemy\"}],\"assignments\":[\"instagram-data-modeling\"],\"key-concepts\":[\"Why do we have to draw the database first?\",\"It is hard to change the database in the middle of development\",\"UML has become the standard for diagrams\",\"SQLAlchemy is the most popular library for python database\",\"Instead of SQL We will use ORM's for 90% of our database needs\",\"ORM's translate Python Objects and Functions into SQL Language\",\"Databases have more data-types than programing languages\",\"Relationships can be 1-1 1-N or N-N\"],\"technologies\":[\"Data-Modeling\"]},{\"label\":\"Day 28\",\"teacher_instructions\":\"First, run a simple Python script in the shell, explain the benefits and capabilities that it brings in the back-end. Then, follow the interactive Flask tutorial and explain the sample API that comes with it (remember the todo list?), then ask the students to build the API for the TodoList they already coded on the front-end\",\"description\":\"Welcome to the back-end! The back-end side has almost no limitations, you have access to the entire computer, printers or anything you need. Your life as a back-end developer will start by doing API's because it is the most needed skill in the market. We really hope you like it as much as we do!\",\"project\":{\"title\":\"Build a Todolist API and Integrate with Todo App\",\"solution\":\"https:\\/\\/github.com\\/breatheco-de\\/python-flask-api-tutorial\"},\"lessons\":[{\"title\":\"Building REST API's\",\"slug\":\"understanding-rest-apis\"},{\"title\":\"Building REST API's with Flask\",\"slug\":\"building-apis-with-python-flask\"}],\"assignments\":[\"python-flask-api-tutorial\"],\"key-concepts\":[\"Python has access to the Entire Machine\",\"Python has packages just like NPM but it is called (Pipenv)\",\"The Pipfile is like the package.json\",\"Flask its the most popular Python Framework\",\"Workflow for Creating an endpoint in Flask (The same MVC pattern but now on the backend)\",\"Flask easily with SQLAlchemy (models.py)\",\"What is Serialization (jsonify)\"],\"homework\":\"Students must finish the todolist api\",\"technologies\":[\"Flask\",\"API's\",\"Serialization\"]},{\"label\":\"Day 29\",\"teacher_instructions\":\"Help students finish pending the todo-list api\",\"description\":\"Continue working on the todolist\",\"project\":{\"title\":\"Continue working on the todolist\"},\"homework\":\"Finish python replits and pending projects\",\"technologies\":[\"Web Framework\",\"API\"]},{\"label\":\"Day 30\",\"teacher_instructions\":\"This lessons is about data-structures + API. We are trying to make students use a class\\/data-structure to build the API around it. Lets build another API but now using a more complicated data-structures on the Backend.\",\"description\":\"Lets keep working on the backend and get more familiar with Python's dictionaries, lists and the lamdba function\",\"project\":{\"title\":\"Family Tree API\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/family-static-api#readme\"},\"assignments\":[\"family-static-api\"],\"key-concepts\":[\"Python has dictonaries instead of object literals\",\"Python has lamda instead of arrow functions\",\"Python has lists and tuples instead of arrays\",\"Explain how to map an array with lambda\"],\"homework\":\"Finish python replits and pending projects\",\"technologies\":[\"Web Framework\",\"API\"]},{\"label\":\"Day 31\",\"teacher_instructions\":\"Help students finish pending backend projects\",\"description\":\"Continue working on the family tree\",\"project\":{\"title\":\"Family Tree API\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/family-static-api#readme\"},\"homework\":\"Finish python replits and pending projects\",\"technologies\":[\"Web Framework\",\"API\"]},{\"label\":\"Day 32\",\"teacher_instructions\":\"Time to start working on your final project backend\",\"description\":\"You have built 2 different API's using python already, it is time to start working on your own. Start by building your UML diagram and setting up the repository\",\"project\":{\"title\":\"Students must start building their backend API\"},\"homework\":\"Finish python replits and pending projects\",\"technologies\":[\"Final Project\"]},{\"label\":\"Day 47\",\"instructions\":\"Create a 'rehersal day' and let the students present the project to their classmates\",\"description\":\"A great way of rehearsing is by presenting the final project to your classmates\",\"project\":{\"title\":\"Final presentation rehersal\"}},{\"label\":\"Pitch Day\",\"instructions\":\"Answer any question your students may have\",\"description\":\"You have worked a lot during these weeks, it's time to present the final project and enjoy with your family and friends!\"}]}",
            "version": 3,
            "updated_at": "2021-09-14T23:33:08.673014Z",
            "created_at": "2021-09-14T23:33:08.672994Z",
            "slug": "full-stack",
            "name": "Full-Stack Software Developer",
            "syllabus": 41,
            "duration_in_hours": 320,
            "duration_in_days": 48,
            "week_hours": 9,
            "github_url": null,
            "logo": "https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack",
            "private": false
        },
        {
            "json": "{\"label\":\"Full-Stack Development experiment\",\"profile\":\"full-stack\",\"description\":\"Become a full-stack full-stack developer with special focus backend: File Storage, Networks, DataStructures, API's and a bit of vanillajs\",\"weeks\":[{\"label\":\"Week 1: The command line\",\"topic\":\"The Command Line\",\"summary\":\"Everything Starts with the command line, it was the only available UI\\/UX at the beginning and the #1 way devs communicate with the computer.\",\"days\":[{\"label\":\"Day 1\",\"description\":\"We are beginning this journey getting familiar with the command line, it will be our #1 way to -manually- communicate with the computer (server).\",\"teacher_instructions\":\"Today its the first day, it should be fun an motivating, the command line challenge it's a great way to break the ice. By the end students should understand the basic commands to get along during their daily coding activities in in the future\",\"project\":{\"title\":\"The CMD Challenge\",\"instructions\":\"https:\\/\\/github.com\\/breatheco-de\\/exercise-terminal-challenge\\/\"},\"replits\":[{\"title\":\"Command Line Interactive Challenge\",\"slug\":\"the-command-line\"}],\"lessons\":[{\"title\":\"Welcome to 4Geeks Academy\",\"slug\":\"intro-to-4geeks\"},{\"title\":\"Building your Github Reputation\",\"slug\":\"building-your-github-profile-and-reputation\"},{\"title\":\"The Command Line\",\"slug\":\"the-command-line-the-terminal\"}],\"homework\":\"At the end of the class, present talk about GIT, Github and how it works\",\"key-concepts\":[\"Most used CMD commands\",\"File Directory Hierarchy\",\"Relative .\\/ vs Absolute Paths \",\"Moving Up ..\",\"Autocomplete with TAB\",\"GIT in a general way\"],\"technologies\":[\"Command Line\"]},{\"label\":\"Day 2\",\"description\":\"Now that you are familiar with the command line, it's time to starting running our python scripts!, but first lets get familiar with the Python language and how to create the most basic algorithms\",\"teacher_instructions\":\"Let's asume that students don't know anything about coding, go over data-types, conditionals, logical expression and the basics, then, start doing replits with them. After 2 hours of replits, help them start building the excuse generator.\",\"project\":{\"title\":\"The Excuse Generator CLI\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/excuse-generator-python-cli#readme\",\"solution\":\"https:\\/\\/github.com\\/breatheco-de\\/model-solutions-excuse-generator\\/blob\\/master\\/cli.py\"},\"replits\":[{\"title\":\"Python Beginner Exercises\",\"slug\":\"python\"}],\"lessons\":[{\"title\":\"Conditionals in Python\",\"slug\":\"conditionals-in-programing-python\"},{\"title\":\"Woking with Strings in Python\",\"slug\":\"working-with-strings-in-python\"}],\"homework\":\"Students must finish the pending python replits\",\"key-concepts\":[\"All datatypes in python\",\"What is a variable\",\"The code is a procedure from top to bottom (for now)\",\"You can skip lines with conditionals\",\"Do not explain looping yet\",\"Do not explain functions yet\",\"Null vs Undefined\",\"Generating random numbers\",\"String Concatenation\"],\"technologies\":[\"Python\"],\"assignments\":[\"excuse-generator-python-cli\"]},{\"label\":\"Day 3\",\"description\":\"Practice day! Time to master your algorithm skills, continue working on the exercises you have pending\",\"teacher_instructions\":\"Lets keep doing the exercises for loops, arrays and mastering python syntax.\",\"replits\":[{\"title\":\"Python List Exercises\",\"slug\":\"python-lists\"}],\"lessons\":[{\"title\":\"Working with Lists (arrays)\",\"slug\":\"what-is-a-python-list\"}],\"key-concepts\":[\"What is a list\",\"What is the position\\/index and the element\\/item\",\"Lists start form 0 instead of 1\",\"How to retrieve an item using the position\",\"How set an item in a particular position\",\"How to loop a list using while\",\"How to loop a list using for\",\"do not explain lambda, that is for the 'functions' lesson\"],\"homework\":\"Students must finish the pending python replits\",\"technologies\":[\"Python\"],\"assignments\":[\"random-card-cli-python\"]},{\"label\":\"Day 4\",\"description\":\"Other important coding is Functions, today we will be practicing them further\",\"teacher_instructions\":\"Students must have done at least half of the array exercises, not its time to introduce functions and the lambda\",\"replits\":[{\"title\":\"Python Function Exercises\",\"slug\":\"python-functions\"}],\"lessons\":[{\"title\":\"Working with Functions\",\"slug\":\"working-with-functions-python\"}],\"key-concepts\":[\"Functions are blocks of code\",\"function must return something or it will return None\",\"Functions receibe parameters in order\",\"The parameter order is important, but the parameter names don't\",\"You have less code because you re-use\",\"Having less code means less bugs\",\"Variables declared inside functions only live inside the function\",\"Using global variables is generaly a bad idea, the less the better\"],\"homework\":\"Students must finish the pending python replits\",\"technologies\":[\"Python\"],\"assignments\":[\"todo-list-cli-python\",\"tictactoe-cli-python\"]},{\"label\":\"Day 5\",\"description\":\"Practice Day! Share you questions with your teacher.\",\"teacher_instructions\":\"Work with the students on finishing the current exercises and projects\",\"homework\":\"Students must finish tic-tac-toe, todo-list and pending exercises\",\"technologies\":[\"Python\"]},{\"label\":\"Day 6\",\"description\":\"Before continuing with your coding education we have to take some time to learn on of the most popular tools for coding collaboration: Git and Github\",\"teacher_instructions\":\"Make sure every student has a github account, have them do the git interactive tutorial in spanish (look for the translation)\",\"project\":{\"title\":\"Collaborative Excuse generator with CSV Storage\",\"instructions\":\"https:\\/\\/github.com\\/breatheco-de\\/exercise-excuse-generator-file-storage-collaborative\"},\"replits\":[{\"title\":\"Git interactive tutorial\",\"slug\":\"git\"}],\"lessons\":[{\"title\":\"How to use GIT (Version control system)\",\"slug\":\"how-to-use-git-version-control-system\"},{\"title\":\"Storing in plain text files in Python\",\"slug\":\"working-with-plain-text-files-backend\"}],\"key-concepts\":[\"Do not explain Git SSH credentials in detail, students must use HTTP\",\"Why using Github?\",\"It will be impossible to avoid using github\",\"The Commit Object\",\"The HEAD\",\"The Stage\",\"Branch\",\"Commit vs PUSH\",\"Resolving Conflicts\",\"What are files?\",\"How do we store on files\",\"Types of file formats for storage (csv, json, yml)\",\"File permisions (r, w, w+)\"],\"homework\":\"Students must finish the interactive tutorial and push their changes of the collaborative excuse generator\",\"technologies\":[\"File Storage\"],\"assignments\":[\"compression-algorithm-python\"]},{\"label\":\"Day 7\",\"description\":\"Thanks to the internet we can not only save files locally, we can also interact with API's on the cloud to save or retrive information\",\"teacher_instructions\":\"Have students do the todo list on the comand line and connect to the todo list API to save it on the cloud\",\"project\":{\"title\":\"Todo List CLI persisted on the Cloud\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/todo-list-cli-with-cloud\",\"solution\":\"https:\\/\\/github.com\\/breatheco-de\\/todo-list-cli-with-cloud\\/tree\\/solution\"},\"lessons\":[{\"title\":\"Understanding REST API's\",\"slug\":\"understanding-rest-apis\"}],\"assignments\":[\"todo-list-cli-with-cloud\"],\"key-concepts\":[\"What is HTTP\",\"What are the HTTP Methods? GET, PUT, POST, DELETE\",\"GET is for reading\",\"POST is for Creating\",\"PUT is for Updating\",\"DELETE is for deleting\",\"Python requests package\",\"Request vs Response\",\"Request Status Code\",\"Request Content-Type (json, text, image, etc.)\"],\"homework\":\"Students must finish the todo list connecting to the API\",\"technologies\":[\"HTTP\",\"REST\"]},{\"label\":\"Day 8\",\"description\":\"Practice Day! Share you questions with your teacher.\",\"teacher_instructions\":\"Work with the students on finishing the current exercises and projects\",\"homework\":\"Students must finish all pending projects and exercises\",\"technologies\":[\"Python\"]},{\"label\":\"Day 9\",\"description\":\"Connecting to your first Real API\",\"key-concepts\":[\"API credentials\",\"Pipenv package manager\",\"Installing packages\",\"Creating environments\",\"Environmental Variables\",\"Reading API Documentations\"],\"teacher_instructions\":\"Start the project with the students but let them work in groups to figure it out on their own\",\"homework\":\"Students must finish all pending projects and exercises\",\"technologies\":[\"Python\"],\"assignments\":[\"urban-dictionary-cli\"]},{\"label\":\"Day 10\",\"description\":\"Arrays and dicts are the main but not the only way to store and process data withing an application, lets review some of the other data-structures\",\"teacher_instructions\":\"Focus a lot on explaining object oriented programing, use real life examples as an analogy, take your time, make sure they understand, afterwards explain the Queue Data Structure (LIFO and FIFO) and start the project with the students\",\"project\":{\"title\":\"Queue Managment CLI using Files for Storage\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/queue-management-cli-python\",\"solution\":\"https:\\/\\/github.com\\/breatheco-de\\/exercise-queue-management-cli-python\\/tree\\/solution\"},\"lessons\":[{\"title\":\"Data Structures\",\"slug\":\"modeling-data-using-data-structures\"},{\"title\":\"Object Oriented Programing\",\"slug\":\"what-is-object-oriented-programming-concepts\"}],\"assignments\":[\"queue-management-cli-python\"],\"key-concepts\":[\"What is an object?\",\"Use real life examples to explain object in real life vs objects in coding\",\"How to declare an object\",\"What is an Object Constructor?\",\"What are object properties?\"],\"homework\":\"Students must finish the queue management cli\",\"technologies\":[\"Queue Datastructure\",\"O.O. Programing\"]},{\"label\":\"Day 11\",\"description\":\"Integrate your Queue Managmnet to make it send SMS messages to clients ready to be seated on the restorant\",\"teacher_instructions\":\"Take some time to review data-structures with the students, go over the project instructions again and help them finish their projects\"},{\"label\":\"Day 12\",\"description\":\"Integrate your Todo list with an API\",\"teacher_instructions\":\"Students are overwhelmed right now, its beeter to keep practicing that starting any new concepts, let's integrate our TODO list with an API to save and retrieve the data\",\"assignments\":[\"todo-list-cli-with-cloud\"]},{\"label\":\"Day 13\",\"description\":\"The backend its all about data, structures and databases. Let's review how to createt a database model and connect it to our Python backend\",\"teacher_instructions\":\"Take the mayority of the class to draw the UML diagram of Instagram, then, explain User Stories with an example really fast, explain why they exists and the different between reuierments and stories and whay that matters. Build a couple of stories and then let the students start building the instagram stories right way.\",\"project\":{\"title\":\"Building Instagram Data Model & Stories\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/instagram-data-modeling#readme\"},\"homework\":\"Students must finish the all replits and projects\",\"replits\":[{\"title\":\"Learn SQL\",\"slug\":\"sql\"}],\"lessons\":[{\"title\":\"Understanding SQL (Relational Databases)\",\"slug\":\"what-is-sql-database\"},{\"title\":\"SQL Alchemy\",\"slug\":\"everything-you-need-to-start-using-sqlalchemy\"}],\"assignments\":[\"instagram-data-modeling\"],\"key-concepts\":[\"Why do we have to draw the database first?\",\"It is hard to change the database in the middle of development\",\"UML has become the standard for diagrams\",\"SQLAlchemy is the most popular library for python database\",\"Instead of SQL We will use ORM's for 90% of our database needs\",\"ORM's translate Python Objects and Functions into SQL Language\",\"Databases have more data-types than programing languages\",\"Relationships can be 1-1 1-N or N-N\"],\"technologies\":[\"Data-Modeling\"]},{\"label\":\"Day 14\",\"teacher_instructions\":\"Build an example of API that it's not the Todo List, just a couple of sample endpoints and then have the class do the Todo-List following the tutorial\",\"description\":\"Finally API's! The whole goal of being a Back-end Web Developer is develoing APIs. You are focused on providing all the information that clients may need (web or mobile).\",\"project\":{\"title\":\"Build a Todolist API and Integrate with Todo CLI\",\"solution\":\"https:\\/\\/github.com\\/breatheco-de\\/python-flask-api-tutorial\"},\"lessons\":[{\"title\":\"Building REST API's\",\"slug\":\"understanding-rest-apis\"},{\"title\":\"Building REST API's with Flask\",\"slug\":\"building-apis-with-python-flask\"}],\"assignments\":[\"python-flask-api-tutorial\"],\"key-concepts\":[\"Python has access to the Entire Machine\",\"Python has packages too (Pipenv)\",\"The Pipfile is like the package.json\",\"Flask its the most popular Python Framework\",\"Workflow for Creating an endpoint in Flask: Adding endpoints\",\"Flask comes with easy integration with SQLAlchemy (models.py)\",\"What is Serialization\"],\"homework\":\"Students must finish the todolist api\",\"technologies\":[\"Django\",\"API's\",\"Serialization\"]},{\"label\":\"Day 15\",\"teacher_instructions\":\"This lessons is about data-structures + API. We are trying to make students use a class\\/data-structure to build the API around it. Lets build another API but now using a more complicated data-structures on the Backend.\",\"description\":\"Lets keep working on the backend and get more familiar with Python's dictionaries, lists and the lamdba function\",\"project\":{\"title\":\"Family Tree API\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/family-static-api#readme\"},\"assignments\":[\"family-static-api\"],\"key-concepts\":[\"Python has dictonaries instead of object literals\",\"Python has lamda instead of arrow functions\",\"Python has lists and tuples instead of arrays\",\"Explain how to map an array with lambda\"],\"homework\":\"Finish python replits and pending projects\",\"technologies\":[\"Web Framework\",\"API\"]},{\"label\":\"Day 16\",\"description\":\"Backend Graduation Day! You have learned everything you need to become a usefull junior back-end engineer, now its time to practice more and more! Congratulations! :)\",\"teacher_instructions\":\"Take this class to make sure all students delivered their project assignments and replits. Make them feel good about finishing this important phase of the course.\"},{\"label\":\"Day 17\",\"description\":\"During the prework you learned basic HTML and CSS, but here your will learn the evolved CSS that enables amazing layouts with boxes and also a rich set of CSS Selectors\",\"instructions\":\"Students know already basic CSS and HTML, just go over the concepts really fast but stop and explain carefully the Display and Position rules. Then, start coding the project.\",\"project\":{\"title\":\"Simple Instagram\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/instagram-feed#readme\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/instagram-without-bootstrap\\/\"},\"homework\":\"Students must finish the Instagram & the Postcard.\",\"key-concepts\":[\"Everything is text!\",\"Always Be Closing\",\"Client vs Server\",\"HTTP Request vs Response\",\"Browser Interpretation\",\"HTML vs CSS\",\"CSS Selectors (basic ones)\",\"Do not use ID as CSS selectors (use specificity)\",\"::Before & ::After Selectors\",\"DRY Technique\",\"Box Model\"],\"lessons\":[{\"title\":\"Doing Layouts\",\"slug\":\"css-layouts\"},{\"title\":\"Advanced CSS Selectors\",\"slug\":\"mastering-css-selectors\"}],\"replits\":[{\"title\":\"Doing Layouts\",\"slug\":\"layouts\"},{\"title\":\"Doing Layouts\",\"slug\":\"forms\"}],\"quizzes\":[{\"title\":\"Basics of HTML\",\"slug\":\"html\"},{\"title\":\"Internet Architecture\",\"slug\":\"internet-architecture\"},{\"title\":\"Basics of CSS\",\"slug\":\"css\"}],\"assignments\":[\"instagram-feed\",\"postcard\",\"instagram-post\"],\"technologies\":[\"CSS3\",\"HTML5\"]},{\"label\":\"Day 18\",\"description\":\"Bootstrap arrived to profesionalize websites, removing 99% of the layout pain. Everything is a component from now on.\",\"instructions\":\"Explain bootstrap and how it solves 99% of the pain. Everything is a component from now own.\",\"project\":{\"title\":\"Bootstrap Instagram\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/instagram-feed-bootstrap#readme\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/instagram-with-bootstrap\\/\"},\"lessons\":[{\"title\":\"Working with Bootstrap\",\"slug\":\"bootstrap-tutorial-of-bootstrap-4\"}],\"replits\":[{\"title\":\"Working with Bootstrap\",\"slug\":\"bootstrap\"}],\"assignments\":[\"instagram-feed-bootstrap\"],\"key-concepts\":[\"Bootstrap\",\"Components\",\"Workflow: Identify the components, Copy&Paste them and finally customize them\",\"Helper\\/Utility Classes that come with Bootstrap\"],\"technologies\":[\"Bootstrap\"]},{\"label\":\"Day 19\",\"teacher_instructions\":\"Finish pending replits (all css and html related), upload student projects into their github accounts and finish the Student External Profile\",\"description\":\"Your entire time at the academy can de summarized into one landing page: The Student External Profile. It is time to start building it.\",\"homework\":\"Students must finish their student external profile and start the replits about Begin JS, Arrays and Functions\",\"project\":{\"title\":\"Learn In Public\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/learn-in-public#readme\",\"solution\":\"http:\\/\\/sep.4geeksacademy.co\\/alesanchezr\"},\"replits\":[{\"title\":\"Document your developer life with Markdown\",\"slug\":\"markdown\"}],\"key-concepts\":[\"How to Pull Request\",\"How to use GIT\",\"What is the Student External Profile\",\"Store Using YML\"],\"technologies\":[\"git\",\"html\",\"css\"],\"assignments\":[\"learn-in-public\",\"collaborative-html-website\"]},{\"label\":\"Day 20\",\"description\":\"HTML & CSS are great, but the world needed interactive pages (not just beautiful text documents). JavaScript comes to help us generate HTML & CSS based commands after the initial text document has already loaded.  JavaScript will also re-write the website live, based on the user's activity.\",\"instructions\":\"Explain the basic coding concepts (variables, data-types, functions, loops, arrays, etc.), then start the excuse generator is a great way to explain how JavaScript and HTML\\/CSS can play together. Use the VanillaJS boilerplate, that way students will start getting used to it\",\"project\":{\"title\":\"The Excuse Generator\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/excuse-generator#readme\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/excuse-generator\\/\"},\"homework\":\"Students need to finish the Excuse Generator, make the replits about JavaScript and complete the layout for the Random Card Generator\",\"key-concepts\":[\"All datatypes in javascript\",\"What is a variable\",\"Arrays\",\"The code is a procedure from top to bottom (for now)\",\"You can skip lines with conditionals\",\"Do not explain looping yet\",\"Do not explain functions yet\",\"Null vs Undefined\",\"Generating random numbers\"],\"lessons\":[{\"title\":\"Learning to code with JS\",\"slug\":\"what-is-javascript-learn-to-code-in-javascript\"}],\"replits\":[{\"title\":\"Introduction to JS\",\"slug\":\"js-beginner\",\"vtutorial_slug\":\"begin-js\"}],\"assignments\":[\"excuse-generator\"],\"technologies\":[\"JavaScript\"]},{\"label\":\"Day 21\",\"teacher_instructions\":\"Today we will be introducing webpack and npm for the first time, just the basics. Ask students to gather and create a flow chart on the whiteboard with the decision process behind building the html for the profile card project. Finish conditional profile card and all previous replits. \",\"description\":\"What we call \\\"thinking\\\" it's basically the process of making decitions based on some information (variables) that we have available. You can replicate the same behavior in a computer by using conditionals and logical operations.\",\"homework\":\"Finish the profile card and replits to date\",\"project\":{\"title\":\"Conditional Profile Card\",\"instructions\":\"https:\\/\\/github.com\\/breatheco-de\\/conditional-profile-card\"},\"replits\":[{\"title\":\"Working with functions\",\"slug\":\"functions\"},{\"title\":\"Mastering JS\",\"slug\":\"js-devmaker\"}],\"lessons\":[{\"title\":\"Using Conditional in Algorithms\",\"slug\":\"conditionals-in-programing-coding\"},{\"title\":\"Bundling with Webpack\",\"slug\":\"what-is-webpack\"}],\"assignments\":[\"conditional-profile-card\"],\"key-concepts\":[\"Every JavaScript code starts OnLoad\",\"String Concatenation\",\"Variable Initialization\",\"If... Else\",\"Some times else is not needed\",\"Ternaries and one case were they make sense\",\"What is compiling?\",\"Why the Javascript community decided to bundle (compatibility, ES6, performance, etc.)\",\"Please do not attempt to explain the Webpack Config.\",\"Bundling JS, CSS & Images\",\"Include your bundle on index.html\",\"We can use NPM to download popular functions (libraries)\"],\"technologies\":[\"Webpack\"]},{\"label\":\"Day 22\",\"teacher_instructions\":\"Do the TodoList using the Flask+VanillaJS template but focusing a lot on the workflow (how to plan your strategy and begin coding), reinforce the Window.onLoad event and how to change CSS styles from JS (apply rules and classes)\",\"description\":\"Ok but how do we use JavaScript to build websites? You have to interact with The DOM to create dynamic HTML\\/CSS and wait for events to occur\",\"project\":{\"title\":\"Random Card Generator\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/random-card\\/\"},\"homework\":\"Finish the Random Card and pending replits, start DOM & EVENTS replits\",\"replits\":[{\"title\":\"The DOM\",\"slug\":\"the-dom\"},{\"title\":\"Events\",\"slug\":\"events\"}],\"lessons\":[{\"title\":\"Introduction to Front-End Web Development\",\"slug\":\"what-is-front-end-development\"},{\"title\":\"The DOM\",\"slug\":\"what-is-dom-define-dom\"},{\"title\":\"Events\",\"slug\":\"event-driven-programming\"}],\"assignments\":[\"random-card\",\"full-stack-todo-list\"],\"key-concepts\":[\"Main website events: PreLoad & OnLoad\",\"The-Runtime (after OnLoad)\",\"Introduce the DOM\",\"Use querySelector() to select DOM Elements just like you do with CSS\",\"Add\\/Remove CSS Classes to DOM elements\",\"Please do not attempt to explain the Webpack Config.\",\"Bundling JS, CSS & Images.\",\"Include your bundle on index.html\"],\"technologies\":[\"DOM\",\"Events\"]},{\"label\":\"Day 23\",\"instructions\":\"It's the first time students will be using objects, explain the concept (without classes). Make students create their first react components and explain the use of JSX. Only talk about functinal components, class components will be explained later. Landing page project should be a code along at start, then groups at end.\",\"description\":\"But working with the DOM can get tricky and it's resource consuming, for that and many other reasons libraries like React.js got popular in the last couple of years. The let you create HTML and CSS using JS in a very intuitive way.\",\"project\":{\"title\":\"Landing Page with React\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/landing-page-with-react#readme\"},\"homework\":\"Students must finish the landing page with react for the next class\",\"lessons\":[{\"title\":\"Object Oriented Programming\",\"slug\":\"what-is-object-oriented-programming-concepts\"},{\"title\":\"Building interfaces with React\",\"slug\":\"learn-react-js-tutorial\"},{\"title\":\"Creating React.js Components\",\"slug\":\"making-react-components\"},{\"title\":\"Importing and Exporting from other JS files\",\"slug\":\"javascript-import\"}],\"replits\":[{\"title\":\"Object Oriented Programming\",\"slug\":\"object-oriented-programing\"},{\"title\":\"Using React.js as a Rendering Engine\",\"slug\":\"react-js\"}],\"assignments\":[\"simple-counter-react\",\"landing-page-with-react\"],\"key-concepts\":[\"Export -> Import modules\",\"You can create your own tags\",\"Create a Component like a Function\",\"JSX Syntax\",\"Component Properties\"],\"technologies\":[\"React\",\"O.O. Programing\"]},{\"label\":\"Day 24\",\"description\":\"Its the first time you've heard or learn about react, we have given you a lot of exercises to practice. Please practice like crazy with all of them. Ask questions.\",\"instructions\":\"Students have now a lot of homework: The React Replits, Traffic Light, Counter and the Landing page. Work with students to help them complete the developments.\",\"project\":\"Work on the replits and projects\",\"homework\":\"Finished Replits and Projects\"},{\"label\":\"Day 25\",\"teacher_instructions\":\"Time to start the Final project! Let's give the students a break and dive into User Stories and the SCRUM methodology. Students must pick their projects & partner, and start building the user stories using Github Project. Create a project with them.\",\"description\":\"Time to start the Final project! Lets review how software is built today, you'll learn and follow the same methods used by the top tech companies in the world.\",\"project\":{\"title\":\"Final Project User Stories and Wireframes\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/full-stack-project-stories-and-wireframes#readme\"},\"lessons\":[{\"title\":\"Agile Web Development\",\"slug\":\"agile-development\"},{\"title\":\"Creating User Stories\",\"slug\":\"user-stories-examples\"}],\"assignments\":[\"full-stack-project-stories-and-wireframes\"],\"key-concepts\":[\"What is a Kanban board and how does it work\",\"How to use Github's kanban automated board\",\"Adding one issue per user story\",\"Writting stories int he users point of view\",\"Acceptance Criteria\",\"You application roles & capabilities\",\"Standup Meeting\"],\"homework\":\"Students must finish the user stories by next class, remember that the student projects must meet certain conditions to be accepted.\",\"technologies\":[\"SCRUM\",\"User Stories\",\"Kanban\",\"Agile Methodologies\"]},{\"label\":\"Day 26\",\"instructions\":\"Review landing page. React as rendering engine: Students need to understand that now they can finally create their own HTML tags (React Components) and how to use the State and the Props. Have the class discuss the strategy for todo-list\",\"description\":\"Finally we can create our own HTML tags and re-use them on several projects and views. The key to understand a component is understanding Props and The State. Please continue working on the Todo-List Application.\",\"project\":{\"title\":\"Todo list with React\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/todo-list\\/\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/todo-list#readme\"},\"lessons\":[{\"title\":\"React Hooks and the State\",\"slug\":\"react-hooks-explained\"}],\"assignments\":[\"traffic-light-react\",\"todo-list-react-with-fetch\"],\"key-concepts\":[\"Controlled Inputs\",\"Condigional Rendering\",\"The component state\",\"The state is inmutable\",\"State vs Props\",\"Using const, map, filter and concat to prevent state mutation\"],\"homework\":\"Students must finish the TodoList being able to add & delete tasks.\",\"technologies\":[\"Class Components\"]},{\"label\":\"Day 31\",\"description\":\"You know exactly how to build small js apps, but what if your application will have several pages\\/views? E.g.: Having a 'Settings' page on the Spotify clone. We need to connect different URLs to our React Components. Welcome to the world of Routing.\",\"teacher_instructions\":\"This project is all about URLs and Routing. Each student must build two views\\/pages: One List and one Single. For example: List of Space Ships and a view for a single Space Ship. The have to make sure the URL's are propery setup on the reouter and also that the information is fetch on the didmount of the respectiv view. Also, you will be using the Context API for MVC (Store, View, Actions)\",\"project\":{\"title\":\"Starwars blog with reading list\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/starwars-blog-reading-list\\/\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/starwars-blog-reading-list#readme\"},\"homework\":\"Students must finish the all replits and projects\",\"lessons\":[{\"title\":\"Using React Router\",\"slug\":\"routing-our-views-with-react-router\"},{\"title\":\"Learning about Context.API\",\"slug\":\"context-api\"}],\"assignments\":[\"starwars-blog-reading-list\"],\"key-concepts\":[\"Connecting Components to URLS (Routing)\",\"Defining Parameters on the URL Path\",\"Retrieving URL parameters with match.params\",\"Using withProps for components not connected directly to the <Route>\",\"Redirecting with history.push\",\"Fetching on didmount\"],\"technologies\":[\"FLUX & Context\"]}]}]}",
            "version": 2,
            "updated_at": "2021-09-14T23:33:08.678965Z",
            "created_at": "2021-09-14T23:33:08.678946Z",
            "slug": "full-stack",
            "name": "Full-Stack Software Developer",
            "syllabus": 41,
            "duration_in_hours": 320,
            "duration_in_days": 48,
            "week_hours": 9,
            "github_url": null,
            "logo": "https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack",
            "private": false
        },
        {
            "json": "{\"label\":\"Full-Stack Development\",\"profile\":\"full-stack\",\"description\":\"Become a full-stack web developer using the 2 most popular technologies in the world: Javascript, React and Python\",\"weeks\":[{\"label\":\"Week 1: How does the web work?\",\"topic\":\"HTML, CSS & Bootstrap\",\"summary\":\"Understanding HTTP, the browser, the Client-Server model, creating your first HTML, The head & body HTML, tables.\",\"days\":[{\"label\":\"Day 1\",\"description\":\"During the prework you learned basic HTML and CSS, but here your will learn the evolved CSS that enables amazing layouts with boxes and also a rich set of CSS Selectors\",\"instructions\":\"Students know already basic CSS and HTML, just go over the concepts really fast but stop and explain carefully the Display and Position rules. Then, start coding the project.\",\"project\":{\"title\":\"Simple Instagram\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/instagram-feed#readme\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/instagram-without-bootstrap\\/\"},\"homework\":\"Students must finish the Instagram & the Postcard.\",\"key-concepts\":[\"Everything is text!\",\"Always Be Closing\",\"Client vs Server\",\"HTTP Request vs Response\",\"Browser Interpretation\",\"HTML vs CSS\",\"CSS Selectors (basic ones)\",\"Do not use ID as CSS selectors (use specificity)\",\"::Before & ::After Selectors\",\"DRY Technique\",\"Box Model\"],\"lessons\":[{\"title\":\"Doing Layouts\",\"slug\":\"css-layouts\"},{\"title\":\"Advanced CSS Selectors\",\"slug\":\"mastering-css-selectors\"}],\"replits\":[{\"title\":\"Doing Layouts\",\"slug\":\"layouts\"},{\"title\":\"HTML Forms\",\"slug\":\"forms\"}],\"quizzes\":[{\"title\":\"Basics of HTML\",\"slug\":\"html\"},{\"title\":\"Internet Architecture\",\"slug\":\"internet-architecture\"},{\"title\":\"Basics of CSS\",\"slug\":\"css\"}],\"assignments\":[\"instagram-feed\",\"postcard\",\"instagram-post\"],\"technologies\":[\"CSS3\",\"HTML5\"]},{\"label\":\"Day 2\",\"description\":\"Bootstrap arrived to profesionalize websites, removing 99% of the layout pain. Everything is a component from now on.\",\"instructions\":\"Explain bootstrap and how it solves 99% of the pain. Everything is a component from now own.\",\"project\":{\"title\":\"Bootstrap Instagram\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/instagram-feed-bootstrap#readme\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/instagram-with-bootstrap\\/\"},\"lessons\":[{\"title\":\"Working with Bootstrap\",\"slug\":\"bootstrap-tutorial-of-bootstrap-4\"}],\"replits\":[{\"title\":\"Working with Bootstrap\",\"slug\":\"bootstrap\"}],\"assignments\":[\"instagram-feed-bootstrap\"],\"key-concepts\":[\"Bootstrap\",\"Components\",\"Workflow: Identify the components, Copy&Paste them and finally customize them\",\"Helper\\/Utility Classes that come with Bootstrap\"],\"technologies\":[\"Bootstrap\"]},{\"label\":\"Day 3\",\"description\":\"A text editor and the console - that's all you need to be a great coder. Time to master the second one.\",\"teacher_instructions\":\"Teach the command line to your students, use the CMD challenge to make it very fun! Start with a small explanation about the importance of the CMD and then explain each command after its respective challenge is completed.\",\"project\":{\"title\":\"The CMD Challenge\",\"instructions\":\"https:\\/\\/github.com\\/breatheco-de\\/exercise-terminal-challenge\\/\"},\"replits\":[{\"title\":\"Command Line Interactive Challenge\",\"slug\":\"the-command-line\"}],\"lessons\":[{\"title\":\"The Command Line\",\"slug\":\"the-command-line-the-terminal\"}],\"homework\":\"At the end of the class, present the students with the GIT project & please ask each student to start coding its corresponding part of the website.\",\"key-concepts\":[\"Most used CMD commands\",\"File Directory Hierarchy\",\"Relative .\\/ vs Absolute Paths \",\"Moving Up ..\",\"Autocomplete with TAB\",\"GIT in a general way\"],\"technologies\":[\"Command Line\"]},{\"label\":\"Weekend\",\"weekend\":true,\"description\":\"And God created the coding weekends - the perfect place to practice, share and collaborate with your classmates.\",\"instructions\":\"Students must finish all pending projects!\"}]},{\"label\":\"Week 2: The Terminal & GIT\",\"topic\":\"Pre-work done!\",\"summary\":\"Time to start having a professional workflow\",\"days\":[{\"label\":\"Day 4\",\"description\":\"The CMD Line has millions of tools, it's time to learn the first ones: GIT & Github - together they make collaboration amazing!\",\"instructions\":\"Time to explain and practice with GIT in detail, create a repository for your Landing Page GIT project and make them clone it and upload their piece of the project. Review the key concepts.\",\"project\":{\"title\":\"GIT Colaborative Landing Page\",\"instructions\":\"https:\\/\\/github.com\\/breatheco-de\\/exercise-collaborative-html-website\\/\"},\"homework\":\"If some of the students have not finished their piece of the landing page, they have to finish it by next class, also ask them to try starting to deliver all the previous projects thru the BreatheCode Platform. Lastly ask them to finish all replits and projects.\",\"key-concepts\":[\"Do not explain Git SSH credentials in detail, students must use HTTP\",\"Why using Github?\",\"It will be impossible to avoid using github\",\"The Commit Object\",\"The HEAD\",\"The Stage\",\"Branch\",\"Commit vs PUSH\",\"Resolving Conflicts\"],\"replits\":[{\"title\":\"Git interactive tutorial\",\"slug\":\"git\"}],\"lessons\":[{\"title\":\"GIT (Version Control System)\",\"slug\":\"how-to-use-git-version-control-system\"}],\"technologies\":[\"Git\",\"Github\",\"Markdown\"]},{\"label\":\"Day 5\",\"teacher_instructions\":\"Finish pending replits (all css and html related), upload student projects into their github accounts and finish the Student External Profile\",\"description\":\"Your entire time at the academy can de summarized into one landing page: The Student External Profile. It is time to start building it.\",\"homework\":\"Students must finish their student external profile and start the replits about Begin JS, Arrays and Functions\",\"project\":{\"title\":\"Student External Profile\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/learn-in-public#readme\",\"solution\":\"http:\\/\\/sep.4geeksacademy.co\\/alesanchezr\"},\"key-concepts\":[\"How to Pull Request\",\"How to use GIT\",\"What is the Student External Profile\",\"Store Using YML\"],\"technologies\":[\"git\",\"html\",\"css\"],\"assignments\":[\"learn-in-public\"]},{\"label\":\"Day 6\",\"description\":\"HTML & CSS are great, but the world needed interactive pages (not just beautiful text documents). JavaScript comes to help us generate HTML & CSS based commands after the initial text document has already loaded.  JavaScript will also re-write the website live, based on the user's activity.\",\"instructions\":\"Explain the basic coding concepts (variables, data-types, functions, loops, arrays, etc.), then start the excuse generator is a great way to explain how JavaScript and HTML\\/CSS can play together. Use the VanillaJS boilerplate, that way students will start getting used to it\",\"project\":{\"title\":\"The Excuse Generator\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/excuse-generator#readme\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/excuse-generator\\/\"},\"homework\":\"Students need to finish the Excuse Generator, make the replits about JavaScript and complete the layout for the Random Card Generator\",\"key-concepts\":[\"All datatypes in javascript\",\"What is a variable\",\"Arrays\",\"The code is a procedure from top to bottom (for now)\",\"You can skip lines with conditionals\",\"Do not explain looping yet\",\"Do not explain functions yet\",\"Null vs Undefined\",\"Generating random numbers\"],\"lessons\":[{\"title\":\"Learning to code with JS\",\"slug\":\"what-is-javascript-learn-to-code-in-javascript\"}],\"replits\":[{\"title\":\"Introduction to JS\",\"slug\":\"js-beginner\",\"vtutorial_slug\":\"begin-js\"}],\"assignments\":[\"excuse-generator\"],\"technologies\":[\"JavaScript\"]},{\"label\":\"Weekend\",\"weekend\":true,\"description\":\"It has been two crazy weeks, thank God we have another coding weekend to keep up and practice.\",\"instructions\":\"Students must finish HTML, CSS3, Layout, Bootstrap, GIT and deliver all the projects through the online platform.\"}]},{\"label\":\"Week 3: First coding skills\",\"topic\":\"Create algorithms\",\"summary\":\"Learn to loop, work with arrays, if..else and functions. Create algorithms.\",\"days\":[{\"label\":\"Day 7\",\"teacher_instructions\":\"Today we will be introducing webpack and npm for the first time, just the basics. Ask students to gather and create a flow chart on the whiteboard with the decision process behind building the html for the profile card project. Finish conditional profile card and all previous replits. \",\"description\":\"What we call \\\"thinking\\\" it's basically the process of making decitions based on some information (variables) that we have available. You can replicate the same behavior in a computer by using conditionals and logical operations.\",\"homework\":\"Finish the profile card and replits to date\",\"project\":{\"title\":\"Conditional Profile Card\",\"instructions\":\"https:\\/\\/github.com\\/breatheco-de\\/conditional-profile-card\"},\"replits\":[{\"title\":\"Working with functions\",\"slug\":\"functions\"},{\"title\":\"Mastering JS\",\"slug\":\"js-devmaker\"}],\"lessons\":[{\"title\":\"Using Conditional in Algorithms\",\"slug\":\"conditionals-in-programing-coding\"},{\"title\":\"Bundling with Webpack\",\"slug\":\"what-is-webpack\"}],\"assignments\":[\"conditional-profile-card\"],\"key-concepts\":[\"Every JavaScript code starts OnLoad\",\"String Concatenation\",\"Variable Initialization\",\"If... Else\",\"Some times else is not needed\",\"Ternaries and one case were they make sense\",\"What is compiling?\",\"Why the Javascript community decided to bundle (compatibility, ES6, performance, etc.)\",\"Please do not attempt to explain the Webpack Config.\",\"Bundling JS, CSS & Images\",\"Include your bundle on index.html\",\"We can use NPM to download popular functions (libraries)\"],\"technologies\":[\"Webpack\"]},{\"label\":\"Day 8\",\"instructions\":\"Review everything we have seen so far very quick, reiforce that we are building HTML using JS now, ask the students and ask them to strategize on the white board, before starting to code reinforce the ONLOAD function as the beginning of your application, start using the breathecode-cli and vanilla-js \",\"description\":\"Arrays are the only way to have a list of things in programming, and they are challenging because develoeprs need to master the art of getting or setting values from arrays using loops\",\"project\":{\"title\":\"Domain Name Generator\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/domain-generator#readme\"},\"homework\":\"Finish the domain name generator and work hard on the JS replits for Begin JS, Arrays, Functions and Mastering JS\",\"replits\":[{\"title\":\"Looping and Arrays\",\"slug\":\"arrays\"}],\"lessons\":[{\"title\":\"Looping and Arrays\",\"slug\":\"what-is-an-array-define-array\"}],\"assignments\":[\"domain-generator\"],\"key-concepts\":[\"Functions (anonymous vs normal)\",\"The forEach\",\"Every JavaScript code starts OnLoad\",\"String Concatenation\",\"Main website events: PreLoad & OnLoad\",\"The-Runtime (after OnLoad)\",\"Introduce the DOM\",\"Use querySelector() to select DOM Elements just like you do with CSS\",\"Add\\/Remove CSS Classes to DOM elements\",\"Please do not attempt to explain the Webpack Config.\",\"Bundling JS, CSS & Images.\",\"Include your bundle on index.html (only one scriptag from no on)\"],\"technologies\":[\"Algorithms\"]},{\"label\":\"Day 9\",\"description\":\"You have a lot of things to cach up on, finish and deliver the replit exercises and projects.\",\"teacher_instructions\":\"We are in the most sensitive part of the course, doing replits its the only way students will feel better and not drop. Please make sure all of them complete lots of exercises today\",\"project\":\"Work on the replits and projects\",\"homework\":\"Strongly encourage students to work on the replits until they finish them\",\"technologies\":[\"Algorithms\"]},{\"label\":\"Weekend\",\"weekend\":true,\"description\":\"Saturdays are a great oportunity to work all day on your coding skills with extra lessons without extra charges. You will only sacrifice 14 Saturdays and your life will change forever.\",\"instructions\":\"During the weekend, students must finish all the replits\"}]},{\"label\":\"Week 4: Mastering Vanilla JS\",\"warning\":\"Students need to be comfortable looping already\",\"topic\":\"\",\"summary\":\"Create your first React application\",\"days\":[{\"label\":\"Day 10\",\"teacher_instructions\":\"Do the Random Card using the VanillaJS template but focusing a lot on the workflow (how to plan your strategy and begin coding), reinforce the Window.onLoad event and how to change CSS styles from JS (apply rules and classes)\",\"description\":\"Ok but how do we use JavaScript to build websites? You have to interact with The DOM to create dynamic HTML\\/CSS and wait for events to occur\",\"project\":{\"title\":\"Random Card Generator\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/random-card\\/\"},\"homework\":\"Finish the Random Card and pending replits, start DOM & EVENTS replits\",\"replits\":[{\"title\":\"The DOM\",\"slug\":\"the-dom\"},{\"title\":\"Events\",\"slug\":\"events\"}],\"lessons\":[{\"title\":\"Introduction to Front-End Web Development\",\"slug\":\"what-is-front-end-development\"},{\"title\":\"The DOM\",\"slug\":\"what-is-dom-define-dom\"},{\"title\":\"Events\",\"slug\":\"event-driven-programming\"}],\"assignments\":[\"random-card\"],\"key-concepts\":[\"Main website events: PreLoad & OnLoad\",\"The-Runtime (after OnLoad)\",\"Introduce the DOM\",\"Use querySelector() to select DOM Elements just like you do with CSS\",\"Add\\/Remove CSS Classes to DOM elements\",\"Please do not attempt to explain the Webpack Config.\",\"Bundling JS, CSS & Images.\",\"Include your bundle on index.html\"],\"technologies\":[\"DOM\",\"Events\"]},{\"label\":\"Day 11\",\"description\":\"You have a lot of things to cach up on, finish and deliver the replit exercises and projects. Make sure to review the last replit of events (todo list).\",\"teacher_instructions\":\"Help students finish the replit exercises and projects. Make sure to review the last replit of events (todo list). IMPORANT: This next coding weekend will be the last before getting into react, encourage students to attend.\",\"project\":\"Work on the replits and projects\",\"homework\":\"Finished Replits and Projects\"},{\"label\":\"Day 12\",\"instructions\":\"It's the first time students will be using objects, explain the concept (without classes). Make students create their first react components and explain the use of JSX. Only talk about functinal components, class components will be explained later. Landing page project should be a code along at start, then groups at end.\",\"description\":\"But working with the DOM can get tricky and it's resource consuming, for that and many other reasons libraries like React.js got popular in the last couple of years. The let you create HTML and CSS using JS in a very intuitive way.\",\"project\":{\"title\":\"Landing Page with React\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/landing-page-with-react#readme\"},\"homework\":\"Students must finish the landing page with react for the next class\",\"lessons\":[{\"title\":\"Object Oriented Programming\",\"slug\":\"what-is-object-oriented-programming-concepts\"},{\"title\":\"Building interfaces with React\",\"slug\":\"learn-react-js-tutorial\"},{\"title\":\"Creating React.js Components\",\"slug\":\"making-react-components\"},{\"title\":\"Importing and Exporting from other JS files\",\"slug\":\"javascript-import\"}],\"replits\":[{\"title\":\"Object Oriented Programming\",\"slug\":\"object-oriented-programing\"},{\"title\":\"Using React.js as a Rendering Engine\",\"slug\":\"react-js\"}],\"assignments\":[\"simple-counter-react\",\"landing-page-with-react\"],\"key-concepts\":[\"Export -> Import modules\",\"You can create your own tags\",\"Create a Component like a Function\",\"JSX Syntax\",\"Component Properties\"],\"technologies\":[\"React\",\"O.O. Programing\"]},{\"label\":\"Weekend\",\"weekend\":true,\"description\":\"Every student, partner, teacher and alumni is invited to the academy on Saturdays, it is an oportunity to network and get some inspiration!\",\"teacher_instructions\":\"Finish the all pending projects, replits and the Project User Stories\",\"homework\":\"Finish all pending assignments and also your first draft of the project user stories\"}]},{\"label\":\"Week 5: React JS\",\"topic\":\"React, Components & Web Apps\",\"summary\":\"Time to start working on the project using Agile Methodologies\",\"days\":[{\"label\":\"Day 13\",\"description\":\"Its the first time you've heard or learn about react, we have given you a lot of exercises to practice. Please practice like crazy with all of them. Ask questions.\",\"instructions\":\"Students have now a lot of homework: The React Replits, Traffic Light, Counter and the Landing page. Work with students to help them complete the developments.\",\"project\":\"Work on the replits and projects\",\"homework\":\"Finished Replits and Projects\"},{\"label\":\"Day 14\",\"instructions\":\"Review landing page. React as rendering engine: Students need to understand that now they can finally create their own HTML tags (React Components) and how to use the State and the Props. Have the class discuss the strategy for todo-list\",\"description\":\"Finally we can create our own HTML tags and re-use them on several projects and views. The key to understand a component is understanding Props and The State. Please continue working on the Todo-List Application.\",\"project\":{\"title\":\"Todo list with React\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/todo-list\\/\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/todo-list#readme\"},\"assignments\":[\"todo-list\",\"traffic-light-react\"],\"key-concepts\":[\"Controlled Inputs\",\"Condigional Rendering\",\"The component state\",\"The state is inmutable\",\"State vs Props\",\"Using const, map, filter and concat to prevent state mutation\"],\"homework\":\"Students must finish the TodoList being able to add & delete tasks.\",\"technologies\":[\"Class Components\"]},{\"label\":\"Day 15\",\"description\":\"Most of the applications build on the internet require some king of database syncronization, normal made thru several API requests.\",\"teacher_instructions\":\"Introduce the concept of fetching help students finish the todo list and incorporate the synconization with the API\",\"project\":{\"title\":\"Todo list with React and Fetch\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/todo-list-react-with-fetch#readme\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/todolist-with-fetch\"},\"homework\":\"Students must finish the all replits and projects\",\"lessons\":[{\"title\":\"Asynchronous Scripting with Javascript\",\"slug\":\"asynchronous-algorithms-async-await\"},{\"title\":\"Javascript Fetch API\",\"slug\":\"the-fetch-javascript-api\"},{\"title\":\"Understanding REST API's\",\"slug\":\"understanding-rest-apis\"}],\"assignments\":[\"todo-list-react-with-fetch\"],\"key-concepts\":[\"Using Fetch to retrieve information from the server\",\"Asyncrunus Programing\",\"Component Did Mount its ideal to fetch info\",\"Initializations on the component contructor before fetching\",\"Displaying a 'loading' before the data arrives\",\"Reseting the state when fetch finalizes\",\"POSTing, PUTing and DELETEing data to the server\",\"Sync the state with the server\"],\"technologies\":[\"Fetch API\"]},{\"label\":\"Weekend\",\"weekend\":true,\"description\":\"Now that you are working on the final project, it is the best time to meet with your partner to work on the weekends\",\"instructions\":\"Student Projects Views must be finished by next class\"}]},{\"label\":\"Week 6: React Router & Layout\",\"topic\":\"Frontend apps\",\"summary\":\"Real life frontend apps using React Router and Context\",\"days\":[{\"label\":\"Day 16\",\"description\":\"You know exactly how to build small js apps, but what if your application will have several pages\\/views? E.g.: Having a 'Settings' page on the Spotify clone. We need to connect different URLs to our React Components. Welcome to the world of Routing.\",\"teacher_instructions\":\"This project is all about URLs and Routing. Each student must build two views\\/pages: One List and one Single. For example: List of Space Ships and a view for a single Space Ship. The have to make sure the URL's are propery setup on the reouter and also that the information is fetch on the didmount of the respectiv view. Also, you will be using the Context API for MVC (Store, View, Actions)\",\"project\":{\"title\":\"Starwars blog with reading list\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/starwars-blog-reading-list\\/\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/starwars-blog-reading-list#readme\"},\"homework\":\"Students must finish the all replits and projects\",\"lessons\":[{\"title\":\"Using React Router\",\"slug\":\"routing-our-views-with-react-router\"},{\"title\":\"Learning about Context.API\",\"slug\":\"context-api\"}],\"assignments\":[\"starwars-blog-reading-list\"],\"key-concepts\":[\"Connecting Components to URLS (Routing)\",\"Defining Parameters on the URL Path\",\"Retrieving URL parameters with match.params\",\"Using withProps for components not connected directly to the <Route>\",\"Redirecting with history.push\",\"Fetching on didmount\"],\"technologies\":[\"FLUX & Context\"]},{\"label\":\"Day 17\",\"description\":\"Lets warp the last things about the Starwars Blog because we are about to dive into and exciting journey inside the world of backend! :)\",\"teacher_instructions\":\"Help students finish the starwars blog and also any other previous exercises and project and publish them to github\",\"project\":{\"title\":\"Starwars blog with reading list\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/starwars-blog-reading-list\\/\",\"instructions\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/starwars-blog-reading-list\\/\"},\"homework\":\"Students must finish the all replits and projects\",\"lessons\":[],\"assignments\":[],\"key-concepts\":[],\"technologies\":[\"FLUX & Context\"]},{\"label\":\"Day 18\",\"teacher_instructions\":\"Now you can deep further into HTTP: Explain the other methods POST, PUT, DELETE. Present the new project that uses FLUX, Context and Fetch again, but now it lets the user to Create, Update and Delete information using an API\",\"description\":\"When your real application is almost ready, it's time to integrate with a real database. That will enable it to work with real information: Create, Update, Delete and get real data. We do HTTP Requests for that.\",\"project\":{\"title\":\"Contact List (Using Context-API)\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/contact-list-context#readme\",\"solution\":\"https:\\/\\/bitbucket.org\\/codingacademy\\/contact-list\"},\"replits\":[],\"assignments\":[\"contact-list-context\"],\"key-concepts\":[\"How to use POSTMan, set environment variables and use collections\",\"JSON is a JavaScript object but as TEXT\",\"The goal is to send\\/receive everything as JSON Serialize>Send>Unserialize\",\"What is serialization and how to do it (Parsing)\",\"Why use several request types (GET, POST, PUT, DELETE)?\",\"Explain the 3 main content-types: Form, URL-Encoded, Raw (With JSON)\"],\"homework\":\"Using POSTman, and then using React, students must consume the API to Save, Delete and Update Contacts.\",\"technologies\":[\"HTTP\",\"AJAX\",\"JSON\",\"HTTP Fetch\",\"API\",\"Serialization\"]},{\"label\":\"Weekend\",\"weekend\":true,\"description\":\"Now that you are working on the final project, it is the best time to meet with your partner to work on the weekends\"}],\"warning\":\"The students should keep working on their final project's documentation\"},{\"label\":\"Week 7: fetch(HTTP-JSON)\",\"topic\":\"Fetching API's\",\"summary\":\"Use the JavaScript Fetch native object to do API Requests and Receive the JSON Responses\",\"days\":[{\"label\":\"Day 19\",\"instructions\":\"Finish the Contact Managment API integration, focus on Debugging procedures and start the introduction to Python\",\"description\":\"Make sure to finish the contact management project\",\"project\":{\"title\":\"Finish the Contact List\"},\"homework\":\"Students must finish the Contact Management API Integration\"},{\"label\":\"Day 20\",\"instructions\":\"One last day to finish the Contact Managment Application with your students, review all the Context, React, Components and HTTP Ajax concepts and best practices\",\"description\":\"Make sure to finish the contact management project\",\"project\":{\"title\":\"Contact Management API Integration\"},\"homework\":\"Students must finish the Contact Management Application\"},{\"label\":\"Day 21\",\"teacher_instructions\":\"Time to start the Final project! Let's give the students a break and dive into User Stories and the SCRUM methodology. Students must pick their projects & partner, and start building the user stories using Github Project. Create a project with them.\",\"description\":\"Time to start the Final project! Lets review how software is built today, you'll learn and follow the same methods used by the top tech companies in the world.\",\"project\":{\"title\":\"Final Project User Stories and Wireframes\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/full-stack-project-stories-and-wireframes#readme\"},\"lessons\":[{\"title\":\"Agile Web Development\",\"slug\":\"agile-development\"},{\"title\":\"Creating User Stories\",\"slug\":\"user-stories-examples\"}],\"assignments\":[\"full-stack-project-stories-and-wireframes\"],\"key-concepts\":[\"What is a Kanban board and how does it work\",\"How to use Github's kanban automated board\",\"Adding one issue per user story\",\"Writting stories int he users point of view\",\"Acceptance Criteria\",\"You application roles & capabilities\",\"Standup Meeting\"],\"homework\":\"Students must finish the user stories by next class, remember that the student projects must meet certain conditions to be accepted.\",\"technologies\":[\"SCRUM\",\"User Stories\",\"Kanban\",\"Agile Methodologies\"]},{\"label\":\"Weekend\",\"weekend\":true,\"description\":\"And here we go again, perfect saturday to work on the project!\",\"instructions\":\"As homework students must review the Lessons and Videos about Python, Django-Rest\"}]},{\"label\":\"Week 8: Final Project Week!\",\"topic\":\"Everything together\",\"summary\":\"Work on the project and catch up with all the assignments\",\"days\":[{\"label\":\"Day 22\",\"instructions\":\"Continue working on the final project but now start building the React Views, use the FLUX boilerplate with the students and start organizing eveyrthing from Layout.jsx\",\"description\":\"Today you will be coding your final project HTML Views and making them React Views\",\"project\":{\"title\":\"Coding the Project Views\"},\"lessons\":[],\"assignments\":[\"full-stack-project-prototype\"],\"key-concepts\":[\"Reinforce the Minimum Viable Product concept\",\"Students should not get excited about npm packages, use only a handfull\",\"Usign React-Strap is a great idea to save some time\"],\"homework\":\"Sit with every project team and discuss how to split the code into Views vs Components, students must finish their project home layout by next class\",\"technologies\":[\"Wireframing\",\"React JS\"]},{\"label\":\"Day 23\",\"description\":\"Keep working on your final project final HTML\\/CSS and React Views. Link them together as a prototype and be ready to start the backend side of the web.\",\"teacher_instructions\":\"Work with students to complete the HTML\\/CSS, React Views and Components. Make sure they are on their way to complete a 'Prototipe' that is close to the front-end side of their projects\",\"project\":{\"title\":\"Build your project Views\"},\"homework\":\"Students must deliver the first views of their projects\"},{\"label\":\"Day 24\",\"teacher_instructions\":\"Help students to finish their prototype, make sure it follows best practices and unstuck them on any problems they may encounter\",\"description\":\"Please work hard with your team on completing your front-end views, this will be the last font-end only day and we will start building your Project API next monday\",\"project\":{\"title\":\"Build your project Views\"},\"homework\":\"Students (in groups) must create a 4 page website (Home, Blog, Product, Checkout-Cart) using React Router\",\"technologies\":[\"React Router\"]},{\"label\":\"Weekend\",\"weekend\":true,\"teacher_instructions\":\"Finish the assignments with students\",\"description\":\"Practice everything you've learned\"}]},{\"label\":\"Week 9: Working with databases\",\"topic\":\"Python, Databases, ORM\",\"summary\":\"Creating an database in python\",\"days\":[{\"label\":\"Day 25\",\"description\":\"The backend side of the web is all about creating API's for data storing and processing; and integrating with 3rd party API's. The first step of that process is storing the information.\",\"teacher_instructions\":\"Go back to HTTP and explain that the backend purpose is to respond to the requests with the right information the front-end wants. Work on doing the model\\/structure of previously made most important projects\",\"project\":{\"title\":\"Data Structure\\/Model Previous Projects\",\"instructions\":\"https:\\/\\/github.com\\/breatheco-de\\/exercise-data-model-previous-projects\"},\"homework\":\"Students must finish the all replits and projects\",\"lessons\":[{\"title\":\"Welcome to the world of Python\",\"slug\":\"python-syntax\"}],\"replits\":[{\"title\":\"Learn Python\",\"slug\":\"python-beginner\"},{\"title\":\"Learn Python Functions\",\"slug\":\"python-functions\"},{\"title\":\"Python Loops and Lists\",\"slug\":\"python-lists\"}],\"assignments\":[],\"key-concepts\":[\"Different Types of Data Structures (with examples)\",\"Review different approaches for the TODO List\",\"Review different approaches for the Contact List\",\"Object vs Array\",\"Example of a very complicated object\",\"Calculated properties like age\"],\"technologies\":[\"Data Structures & Model\"]},{\"label\":\"Day 26\",\"description\":\"Database engines are not related particular languages (like Python, PHP or Node) and they run on a different server than the website or application. For that reason and many others databases have their own language: SQL\",\"teacher_instructions\":\"The have done one database using SQL Alchemy, it is time to explain how SQL database work and how to write some SQL to interact with them, look at the full teacher instrutcions for more details\",\"project\":{\"title\":\"Work on SQL Replits\"},\"homework\":\"Students must finish the all replits and projects\",\"replits\":[{\"title\":\"Learn SQL\",\"slug\":\"sql\"}],\"lessons\":[{\"title\":\"Understanding SQL (Relational Databases)\",\"slug\":\"what-is-sql-database\"}],\"assignments\":[],\"key-concepts\":[\"SQL Table vs SQL Alchemy Model\",\"Table Relations: 1-1, 1-N, N-N\",\"Metadata vs Data\",\"INSER, UPDATET, DELETE, UPDATE\",\"ALTER, DROP\",\"Transactions: COMMT\"],\"technologies\":[\"SQL\"]},{\"label\":\"Day 27\",\"description\":\"The backend its all about data, structures and databases. Let's review how to createt a database model and connect it to our Python backend\",\"teacher_instructions\":\"Take the mayority of the class to draw the UML diagram of Instagram, then, explain User Stories with an example really fast, explain why they exists and the different between reuierments and stories and whay that matters. Build a couple of stories and then let the students start building the instagram stories right way.\",\"project\":{\"title\":\"Building Instagram Data Model & Stories\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/instagram-data-modeling#readme\"},\"homework\":\"Students must finish the all replits and projects\",\"lessons\":[{\"title\":\"SQL Alchemy\",\"slug\":\"everything-you-need-to-start-using-sqlalchemy\"}],\"assignments\":[\"instagram-data-modeling\"],\"key-concepts\":[\"Why do we have to draw the database first?\",\"It is hard to change the database in the middle of development\",\"UML has become the standard for diagrams\",\"SQLAlchemy is the most popular library for python database\",\"Instead of SQL We will use ORM's for 90% of our database needs\",\"ORM's translate Python Objects and Functions into SQL Language\",\"Databases have more data-types than programing languages\",\"Relationships can be 1-1 1-N or N-N\"],\"technologies\":[\"Data-Modeling\"]},{\"label\":\"Weekend\",\"weekend\":true,\"instructions\":\"From now on repetition is key, start every class reviewing the development workflow, help students finish their project and motivate them until the end!\",\"description\":\"We know you are really overwhelmed by the incredible amount of information, the next few weeks are about practice, practice, and practice! It's is time to become a master in software development\"}]},{\"label\":\"Week 10: Creating an API\",\"topic\":\"Python, Flask, ORM\",\"summary\":\"Creating an API using Django\\/Flask & Rest\",\"days\":[{\"label\":\"Day 28\",\"teacher_instructions\":\"First, run a simple Python script in the shell, explain the benefits and capabilities that it brings in the back-end. Then, install django or flask using the boilerplate and explain the sample API that comes with it (remember the contact list?), then ask the students to build the API for the TodoList they already coded on the front-end\",\"description\":\"Welcome to the back-end! The back-end side has almost no limitations, you have access to the entire computer, printers or anything you need. Your life as a back-end developer will start by doing API's because it is the most needed skill in the market. We really hope you like it as much as we do!\",\"project\":{\"title\":\"Build a Todolist API and Integrate with Todo App\",\"solution\":\"https:\\/\\/github.com\\/breatheco-de\\/python-flask-api-tutorial\"},\"lessons\":[{\"title\":\"Building REST API's\",\"slug\":\"understanding-rest-apis\"},{\"title\":\"Building REST API's with Flask\",\"slug\":\"building-apis-with-python-flask\"}],\"assignments\":[\"python-flask-api-tutorial\"],\"key-concepts\":[\"Python has access to the Entire Machine\",\"Python has packages just like NPM but it is called (Pipenv)\",\"The Pipfile is like the package.json\",\"Flask its the most popular Python Framework\",\"Workflow for Creating an endpoint in Flask (The same MVC pattern but now on the backend)\",\"Flask easily with SQLAlchemy (models.py)\",\"What is Serialization (jsonify)\"],\"homework\":\"Students must finish the todolist api\",\"technologies\":[\"Flask\",\"API's\",\"Serialization\"]},{\"label\":\"Day 29\",\"teacher_instructions\":\"Help students finish pending the todo-list api\",\"description\":\"Continue working on the todolist\",\"project\":{\"title\":\"Continue working on the todolist\"},\"homework\":\"Finish python replits and pending projects\",\"technologies\":[\"Web Framework\",\"API\"]},{\"label\":\"Day 30\",\"teacher_instructions\":\"This lessons is about data-structures + API. We are trying to make students use a class\\/data-structure to build the API around it. Lets build another API but now using a more complicated data-structures on the Backend.\",\"description\":\"Lets keep working on the backend and get more familiar with Python's dictionaries, lists and the lamdba function\",\"project\":{\"title\":\"Family Tree API\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/family-static-api#readme\"},\"assignments\":[\"family-static-api\"],\"key-concepts\":[\"Python has dictonaries instead of object literals\",\"Python has lamda instead of arrow functions\",\"Python has lists and tuples instead of arrays\",\"Explain how to map an array with lambda\"],\"homework\":\"Finish python replits and pending projects\",\"technologies\":[\"Web Framework\",\"API\"]},{\"label\":\"Weekend\",\"weekend\":true,\"instructions\":\"From now on repetition is key, start every class reviewing the development workflow, help students finish their project and motivate them until the end!\",\"description\":\"Weekds are open to students as always, keep it up with your Final Project!\"}]},{\"label\":\"Week 11: Final Project API\",\"topic\":\"Python, Web Framework, ORM\",\"summary\":\"Last week for python, start final project\",\"days\":[{\"label\":\"Day 31\",\"teacher_instructions\":\"Help students finish pending backend projects\",\"description\":\"Continue working on the family tree\",\"project\":{\"title\":\"Family Tree API\",\"instructions\":\"https:\\/\\/projects.breatheco.de\\/d\\/family-static-api#readme\"},\"homework\":\"Finish python replits and pending projects\",\"technologies\":[\"Web Framework\",\"API\"]},{\"label\":\"Day 32\",\"teacher_instructions\":\"Time to start working on your final project backend\",\"description\":\"You have built 2 different API's using python already, it is time to start working on your own. Start by building your UML diagram and setting up the flask\\/django repository\",\"project\":{\"title\":\"Students must start building their backend API\"},\"homework\":\"Finish python replits and pending projects\",\"technologies\":[\"Final Project\"]}]},{\"label\":\"Week 16\",\"topic\":\"Final Project Presentation\",\"summary\":\"Last tweeks to the project and building of the final presentation\",\"days\":[{\"label\":\"Day 46\",\"instructions\":\"Help students start their presentation, give them tips and setup a rehersal date to work with them on their presentation\",\"description\":\"Did you notice that 16 weeks had passed? Times passes fast when you are having fun, not it's time to work on the final project presentation\",\"project\":{\"title\":\"Work on the Final Project Presentation\"},\"key-concepts\":[\"Presenting my project\",\"Creating a real demo\",\"Making sure your dummy data looks great\",\"How to focus on the strengths\"],\"homework\":\"Create your project presentation\"},{\"label\":\"Day 47\",\"instructions\":\"Create a 'rehersal day' and let the students present the project to their classmates\",\"description\":\"A great way of rehearsing is by presenting the final project to your classmates\",\"project\":{\"title\":\"Final presentation rehersal\"}},{\"label\":\"Pitch Day\",\"instructions\":\"Answer any question your students may have\",\"description\":\"You have worked a lot during these weeks, it's time to present the final project and enjoy with your family and friends!\"}]}]}",
            "version": 1,
            "updated_at": "2021-09-14T23:33:08.682974Z",
            "created_at": "2021-09-14T23:33:08.682956Z",
            "slug": "full-stack",
            "name": "Full-Stack Software Developer",
            "syllabus": 41,
            "duration_in_hours": 320,
            "duration_in_days": 48,
            "week_hours": 9,
            "github_url": null,
            "logo": "https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack",
            "private": false
        },
        {
            "json": {
                "days": [
                    {
                        "id": 1,
                        "label": "HTML/CSS/Bootstrap",
                        "lessons": [
                            {
                                "slug": "intro-to-4geeks",
                                "title": "Introduction to 4Geeks Academy"
                            },
                            {
                                "slug": "what-is-html-learn-html",
                                "title": "What is HTML? It's time to learn HTML and its structure"
                            },
                            {
                                "slug": "what-is-css-learn-css",
                                "title": "Learn CSS: What is CSS Meant for?"
                            },
                            {
                                "slug": "css-layouts",
                                "title": "CSS Layouts: Create and Build Layouts with CSS"
                            },
                            {
                                "slug": "mastering-css-selectors",
                                "title": "Mastering CSS Selectors"
                            },
                            {
                                "slug": "bootstrap-tutorial-of-bootstrap-4",
                                "title": "Bootstrap Tutorial: Learn Bootstrap 4 in 10 minutes"
                            }
                        ],
                        "project": {
                            "title": "Build a Digital Postcard with HTML/CSS",
                            "instructions": "https://projects.breatheco.de/project/postcard"
                        },
                        "quizzes": [
                            {
                                "url": "https://assets.breatheco.de/apps/quiz/bootstrap",
                                "slug": "bootstrap",
                                "title": "Bootstrap"
                            }
                        ],
                        "replits": [
                            {
                                "slug": "css-exercises",
                                "title": "Learn CSS Interactively"
                            },
                            {
                                "slug": "forms-exercises",
                                "title": "Learn HTML Forms"
                            },
                            {
                                "slug": "bootstrap-exercises",
                                "title": "Learn Bootstrap Tutorial"
                            }
                        ],
                        "homework": "Students must finish their project and must remember to read the next lesson before next class.",
                        "position": 1,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-postcard",
                                "slug": "postcard",
                                "title": "Build a Digital Postcard with HTML/CSS"
                            },
                            {
                                "url": "https://github.com/breatheco-de/exercise-instagram-post",
                                "slug": "instagram-post",
                                "title": "Instagram Post"
                            },
                            {
                                "url": "https://github.com/breatheco-de/exercise-instagram-feed",
                                "slug": "instagram-feed",
                                "title": "Simple Instagram Photo Feed with HTML/CSS"
                            },
                            {
                                "url": "https://github.com/breatheco-de/exercise-instagram-feed-bootstrap",
                                "slug": "instagram-feed-bootstrap",
                                "title": "Instagram Photo Feed with Bootstrap"
                            }
                        ],
                        "description": "During the pre-work you learn some basic CSS and HTML, and hopefully how to use the flex-box to create simple layouts. The first day we will review the pre-work completion and introduce a more  evolved CSS that enables amazing layouts and the amazing Bootstrap framework that will make you life so much easier with the \"component oriented\" approach.",
                        "key-concepts": [
                            "Everything is text",
                            "Always be closing",
                            "Client vs Server",
                            "HTTP request vs response",
                            "HTML vs CSS",
                            "DRY Technique",
                            "Flex Box",
                            "Bootstrap",
                            "Component",
                            "Workflow: Identify Component, Copy&Paste, the customize it",
                            "Helper/utility Clasees that come with Bootstrap"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Students know already basic CSS and HTML, just go over the concepts really fast but stop and explain carefully the Display and Position rules, specifically talk about the FlexBox as the main tool to build layouts. Then, explain Bootstrap and how it solves 99% of the pain: everything is a component from now on\"",
                        "extended_instructions": "# The Internet, HTML, CSS and Bootstrap\n\n## `20 min` Small presentation about the bootcamp, [click here to open it](https://docs.google.com/presentation/d/1--0xX43xyfngGTWVQEgmcbLuE7QCCz-jovL2JBOEPY0/edit#slide=id.g555ffcabca_1_0).\n\n## `15 min` Play a game to get to know each other.\n\n- Everyone writes in an anonimus piece of paper with something about themselves. E.g: \"I like dogs\" or \"I work on sales\", etc.\n- Put all papers inside a cup and start the game.\n- Choose one student to start introducing himself:\n    - First name and last.\n    - What would you like to be called?\n    - What do you do now? (for work)\n    - What do you plan on doing when you become a developer?\n- Then, that student must pick one random paper from the cup and guess how is the person that wrote it.\n- After guessing, the person who wrote it must come next and introduce himself and pick another paper... etc.\n\n## `5 min` Present the team\n\nEveryone introduces himself: Chief of Admissions, Chief of Career Support, Chief of Education, Main instructor, and teacher assistant.\n\n## `15 min` Install the tools\n\nStart with Gitpod, invite all students, and make sure they are able to create workspaces and what the academy boilerplates are. \n\n## `10 min` Go over prework concepts really fast\n\nCheck if the students completed the prework, if ~70% of the students finished the prework you can continue with the rest of the class, otherwise you will have to postpone today's topics and today's focus only con starting/completing the prework projects and concepts with the students.\n\n\n## If 70% of the students completed the prework you can continue with the rest of the day:\n\n### How does the internet works?\n\n1. The world is divided between servers and clients.\n2. We call \"clients\" the computers with browsers or mobile apps.\n3. We call servers where the centralized database is.\n\n### HTTP Request vs Response**\n\n- The rules used for this client-sever communication is called HTTP, which stands for Hyper Text Transfer Protocol.\n- The way that you get the website is by sending a \"Request\" to the server. This tells the server what website or resource you are looking to view/use. The server then responds with the information.\n- The server then sends a response, which tells will confirm the receipt of the request and let your computer know that it will begin sending data.\n- This back and forth process will continue with more Request=>Response pairs until you have finished loading your remote resource.\n\n### Everything is text!\n\n- With HTTP, it’s important to focus on the first T in the acronym, which stands for `Text`. In this protocol, everything is sent back and forth as TEXT.\n- While there are other protocols out there, for now, we want to remember that with HTTP – Everything is TEXT.\n- Make students open a picture with Notepad/TextEdit they will see the text that represents the image.\n\n### Browser Interpretation\n\n- After your browser uses the HTTP protocol and receives the data as text, it then has the job of interpreting that text and converting it to the correct visual format.\n\n#### HTML\n\n- The first TEXT-based format we will see is HTML.\n- HTML its all about `<tags>` you open and close tags to give them basic format.\n- There are a lot of HTML tags but you only have to know a few and you can always google them.\n    - Explain the basic tags like `<p>`,`<div>`,`<a>`,`<span>`, headings (`<h1>`,`<h2>`,etc).\n\n[[demo]]\n| :point_up: The most important thing to remember in HTML is to ALWAYS BE CLOSING!\n\n#### Always Be Closing and Indentation Matters**\n\n- Everything is going to be done in blocks of code.\n- First you open the block, then you close the block.\n\n### CSS vs HTML\n```css\n#id_selector { property: value; }\n.class_selector { property: value; }\ntag_selector { property: value; }\n```\n\n## `20 min` Start the new content: Advanced CSS\n\n### Specificity\n\n- Do not use ID as CSS selectors (use specificity).\n- The class selector is the most used because it can be reused all over your website.\n- Show this [video that explains](https://www.youtube.com/watch?v=In78mSOHmls) specificity to the class.\n- Combine selectors to get more specific about which element you are styling\n- Ask if anyone remembers what we said DRY Programming means? Don’t repeat yourself.\nYou may think it’s funny that they call the opposite of DRY -  WET programming, which they have given the following titles to:  \"write everything twice\", \"we enjoy typing\" or \"waste everyone's time\"**\n\n\n### Box Model\n\n- Box layout means that most elements can be thought of as boxes: with margin, padding, with and height.\n- There are 4 main parts to the typical box model: (draw the following on the board or show picture from breathcode)\n    - Content: this is what is inside the box\n    - Padding: this is spacing between the border and content (inside box also)\n    - Border: this is the edge of the box\n    - Margin: this is spacing between the outside of the box and the next element over in any direction. (which could be the edge of the page, another div, a paragraph, or even an image)\n- You can also have a background color or image, this will show in the content area of your box.\n\n#### The Display Property:\n\n- Compare `display:block` vs `display:inline`: Display block its what makes an element behave like a box, inline elements have no margins.\n- Compare `display:block` vs `display:inline-block`.\n- Display: flex; its the main tool for building complex layouts because it easily allows having several divs on the same line (columns).\n- I recommend going over the CSS and HTML [cheat sheets that we have available on the breathco.de platform under Assets](https://breatheco.de/assets/).\n \n## Display Flex and how important it is.\n\nTake some time to explain display:flex and how it is used on today's project.\n\n#### The Position Property:\n\n- Position:fixed follows the user, it is mainly used for anoying modals or popups.\n- If one element has position:relative must always be companioned by one or more childs with position:absolute. Its broadly used for relating two elements to each other (one follows the other)\n- Compare `display:block` vs `display:inline-block`.\n\n## `2:30 hr` Start the project!\n\nRead the instructions out loud with the class, make sure they understand.\n\nStudents must start discussing on the whiteboard a strategy about the project.\n- From top to bottom identify the tags you will be using.\n- When to use `display:inline-block` and/or `position:absolute` or `position:relative`.\n- Setup the project with one `index.html` and one `styles.css`\n\n## `20 min` Bootstrap\n\n### What is bootstrap?\n\nJust a predefined stylesheet inveted by [a guy at twitter (Mark Otto)](https://twitter.com/mdo?lang=en).\n\n### Why?\n\n- Because doing styles is repetitive, it was about time someone did a boilerplate.\n- Its component oriented.\n- It makes websites easier and faster to build.\n\n### Bootstrap versions & download\n\nBootstrap has many versions, always check if you are using the last version of Bootstrap on your project, here you can find all the available versions: [https://getbootstrap.com/docs/versions/](https://getbootstrap.com/docs/versions/)\n\nWe recomend using a CDN to import bootstrap in your HTML like this one: [https://www.bootstrapcdn.com/](https://www.bootstrapcdn.com/)\n\n### The Most Important (Used) Components\n\n1. Navbar\n2. Card\n3. Modal: https://getbootstrap.com/docs/4.0/components/modal/#live-demo\n\n### The Basic Workflow (asuming you have a wireframe or design)\n\n1. Build your basic layout with the Grid (container, row and collumns)\n1. Identify the components you will need (use piece of paper)\n2. Copy & Paste the component code into your website.\n3. Customize the component for your specific design.\n4. Adjust anything else overriding with css styles on your own sylesheet.\n5. Remember the utility classes to avoid doing to much custom CSS.\n\n### Helper/Utility Classes that come with bootstrap*\n\nThese are classes you can attach that do things such as control margin or padding, control borders, or even float elements.\nFor example, if you wanted no margin on the left of the element, you can add the class ml-0 to the element and it will set the left margin to zero.\n\n### Layout using Grid system\n\n- Explain 12 column layout and how it works\n- every line is a Row\n- this row holds columns as immediate childs\n- every Row on a page has 12 columns\n- columns are equally measured in percentages so they are responsive.\n- the basic sizes are: col, col-xs, col-sm, col-md, col-lg, col-xl\n\n### Bootstrap does not have fonts or icons\n\nWe use google fonts and font awesome for that.\n\n## `2:30min` Have class work on bootstrap instagram.\n\n- Students gather in pairs tos strategize first (best practice)\n- Read instructions out loud and have them build a strategy\n- Have them identify the components.\n\nDo not talk more, they will not be able to process it because they are overwhelmed, just help them code.\n\nAnswer questions individually with your teacher assistants.\n"
                    },
                    {
                        "id": 2,
                        "label": "Command Line Challenge",
                        "lessons": [
                            {
                                "slug": "the-command-line-the-terminal",
                                "title": "The Command Line (a.k.a: The Terminal) "
                            }
                        ],
                        "project": {
                            "title": "Command Line Challenge",
                            "instructions": "https://projects.breatheco.de/project/exercise-terminal-challenge"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "url": "https://cmdchallenge.com/",
                                "slug": "command-line-exercises",
                                "title": "Command line exercises"
                            }
                        ],
                        "homework": "Students must remember to read the next lesson before next class.",
                        "position": 2,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-terminal-challenge",
                                "slug": "exercise-terminal-challenge",
                                "title": "Command Line Challenge"
                            }
                        ],
                        "description": "A text editor and the console - that's all you need to be a great coder. Time to master the second one.",
                        "key-concepts": [
                            "Most used CMD commands",
                            "File Directory Hierarchy",
                            "Relative vs Absolute Paths",
                            "Moving up...",
                            "Autocomplete with TAB",
                            "GIT in general"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Teach the command line to your students, use the CMD challenge to make it very fun! Start with a small explanation about the importance of the CMD and then explain each command after its respective challenge is completed\n",
                        "extended_instructions": "# Command Line Interface\n\n Check if students were able to finish the Bootstrap Instagram\n\n ## `10 min` Small theory about the command line (do not explain the commands)\n\n```md\n⚠ ️IMPORTANT:\nPlease don't explain every command, it is better if during the challenge the students find the commands in google or in the breathecode lesson.\n\nStudents can do searches like: \"How to get into a computer directory\", etc.\nForce them to start searching in google!!\n```\n\n- Computers can be entirely managed without a windows interface, you can do everything from the command line.\n- Make sure to make students understand how important the command line (developers use it every day all the time and it is impossible to avoid).\n- Relative path vs absolute path.\n- Explain that we are in Gitpod, which uses ubuntu and we have to familiarize we the ubuntu command line.\n- Talk about the file hierarchy and how is represented in the command line, what the dot  .  and double dot  ..  represents. Draw on the board a file hierarchy and show if at the same time how the command line shows it (compare both).\n- Explain the use of the autocomplete command: [using tab one time for autocomplete or two times to show options](https://www.howtogeek.com/195207/use-tab-completion-to-type-commands-faster-on-any-operating-system/).\n- This is a [very good series of videos](https://www.youtube.com/watch?v=AO0jzD1hpXc&t=267s&index=8&list=PL8A83A276F0D85E70) explaining the command line that students can **watch later.**\n- Share this [cheat sheet with the most used commands.](https://ucarecdn.com/61c6474b-5760-43db-9a2c-dfbea2ccdd76/Comandlinecheatsheet.pdf)\n\n## `1:20 hr` Start The CMD Challenge\n\n- Have students create a project in Gitpod\n- Help them to clone the repo for the project (paste it in the slack channel so they can use the link)**\n    1. git init\n    2. git clone\n- Run the react presentation\n\n```md\n📝 The command line will make students practice the most important commands, explain each command after the each challenge is completed, the student that successfully completed it can explain to other students.\n```\n\n## `1:30min` Take some time the class explaining git in a general way\n\nGit will be the first applicacion we will be using inside the command line, students must read about it and wat videos about it.\n\n### What is git?\n\nGit is an online, central code storage that allows developers to manage a code base in teams.\n\nSome of the things you can do with git include:\n\n1. You can collaborate on projects easily\n2. see a history of revisions\n3. Roll back to previous versions if a revision fails (version control)\n4. Resolve code conflicts so that 2 developers don’t overwrite each other’s code.\n\nGit is a necessity to any developer working today as it’s resolved many of the issues of working on a team or keeping version history on a project.\n\n## For Next Class\n\nNext class we will review GIT in more detail. If you haven’t already, please read the lesson on GIT in the breatheco.de platform.**Hello *World*!"
                    },
                    {
                        "id": 3,
                        "label": "Github",
                        "lessons": [
                            {
                                "slug": "learn-in-public",
                                "title": "Learn in Public"
                            },
                            {
                                "slug": "how-to-use-git-version-control-system",
                                "title": "How to use GIT: Version Control System"
                            }
                        ],
                        "project": {
                            "title": "Fix the Misspell Challenge",
                            "instructions": "https://projects.breatheco.de/project/fix-the-misspell"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "url": "https://4geeksacademy.github.io/git-interactive-tutorial/",
                                "slug": "git-interactive",
                                "title": "Interactive Github Tutorial"
                            }
                        ],
                        "homework": "Stundents should finish their project and remember to read the next lesson before next class.",
                        "position": 3,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/the-misspell-chalenge",
                                "slug": "fix-the-misspell",
                                "title": "Fix the Misspell Challenge"
                            },
                            {
                                "url": "https://github.com/4GeeksAcademy/learn-in-public",
                                "slug": "learn-in-public",
                                "title": "Learn in Public"
                            }
                        ],
                        "description": "The CMD Line has millions of tools, it's time to learn the first ones: GIT & Github - together they make collaboration amazing!",
                        "key-concepts": [
                            "Do not explain Git with SSH credentials  in detail, students must use HTTP",
                            "Why using Github?",
                            "It will be impossible to avoid using Github",
                            "Github vs Git",
                            "How to commit directly on github",
                            "How to find great repostories",
                            "Example of a great github profile",
                            "Github as a portfolio"
                        ],
                        "technologies": [
                            {
                                "slug": "github",
                                "title": "github"
                            }
                        ],
                        "teacher_instructions": "Start explaining Github as a social network, how it stores 90% of the world's codebase, how you can review all major coding projects, follow the most influential developers, and the role of open source.\n\nThen explain GIT without being very technical, the \"Github for poets\" video does a great explanation, we will get more technical the next class that we will collaborate on building a landing page.",
                        "extended_instructions": "# Welcome to Github\n\n**Welcome everyone, Check if they were able to finish all the lessons, exercises, and projects up till now.**\n\n### Explaining Github\n\n1. As we mentioned in previous classes, Github & Git have become a staple of every development workflow.\n\n2. You will use this in EVERY development job you have from here forward.\n\n3. Show the main profile screen and explain parts\n\n    - Use [https://github.com/gaearon](https://github.com/gaearon) as example.\n    - Explain about the github activity graph, how github tracks your entire activity and other developers and recruiters can see it\n\n\n4. Explain how to create a repository\n\n    - click repository tab > new repo button > fill out data\n\n5. Show what a repository looks like\n\n   - explain the contents of the repository and the importance of the Readme file in a project.\n   - Show popular repositories like react, vue, flask, etc. Show them the README files.\n   - show [the git collaboration readme](https://github.com/breatheco-de/exercise-collaborative-html-website) as an example \n\n## The role of open-source\n\n- Explain about open source, how the most important projects in the coding world are open source like: Chrome, Windows, React, Pyhton, Flask, Django, etc.\n\n- In the open source world anyone can pull request anything, there are maintainers that review and approve changes.\n- 4Geeks Academy syllabus is open source and you can Pull Request (lessons and projects)\n\n\n## `1 hr` Project: Fixing Misspells as the perfect Open Source Ice-Breaker\n\nShow students how every lesson on breathecode has the github logo on the top, and you can contrute or fix any lesson by clicking on the github logo and then editing the lesson file on github.\n    \nCreate repositories for all previous workspaces and upload all your code to their corresponding repo’s. Then submit the assignments on your student.breatheco.de  **(DUE MONDAY). Also, work on all repl’its and get caught up. Be ready for the next class which is on Wireframing and design process.**\n\n## `1hr` The student External Profile\n\nEncourage students to do their first pull request with the student external profile: [sep.4geeksacademy.co](https://sep.4geeksacademy.co)"
                    },
                    {
                        "id": 4,
                        "label": "Git & Gitflow",
                        "lessons": [],
                        "project": {
                            "title": "Building a website collaborative",
                            "instructions": "https://projects.breatheco.de/project/collaborative-html-website"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must remember to read the next lesson before next class and finish all their projects, next class they start with Javascript!",
                        "position": 4,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-collaborative-html-website",
                                "slug": "collaborative-html-website",
                                "title": "Building a website collaborative"
                            }
                        ],
                        "description": "Now you know Github & GIT and together they make collaboration amazing! ",
                        "key-concepts": [
                            "Coders collaborate with each other",
                            "team work ",
                            "In real jobs, you work in tems",
                            "Pull request",
                            "branches",
                            "Merge",
                            "The commit object",
                            "Push vs Pull",
                            "Why Pull Request instead of Push directly",
                            "All major companies use Pull Request"
                        ],
                        "technologies": [
                            {
                                "slug": "git",
                                "title": "Git"
                            }
                        ],
                        "teacher_instructions": "Time to explain and practice with GIT in detail, create a repository for your Landing Page GIT project and make them clone it and upload their piece of the project. Review the key concepts. Do a live demonstration on how to use Github, branches, resolve conflicts. Introduce students on how to contribute on Github by fixing misspells.",
                        "extended_instructions": "# First time using Git\n\nLast class you have introduced GitHub, students must have finish reading and watching videos and building their public profile with YML.\n\n### About the GIT authentication:\n\nThe academy does not want to explain much about GIT SSH Authentication because it can be a cumbersome concept for now, we strongly recomend always using HTTP during the course and let students learn about SSH later.\n\n### The Commit Object\n\nHere is the lesson that talks about that: [https://content.breatheco.de/lesson/how-to-use-git-version-control-system#commit-objects](https://content.breatheco.de/lesson/how-to-use-git-version-control-system#commit-objects) \n\nBasically, a commit is a snapshot (picture) of what your project looked at during the moment of your commit. \n\nCommits represent a change in the current code, so if you don’t have any changes, you will receive a message saying there is nothing to commit.\n\nThere are four main parts in a commit:\n\n1. Set of files which make up your snapshot at that time\n2. Instructions pointing to the Parent commit objects\n3. An SH1 (hash) name that serves as a unique identifier for that specific commit.\n4. Commits also typically have comments, which should explain what was changed or addressed in the current commit\n\n### The HEAD\n\nThe heads of the repository are like the \"revision history of the project.\"  \n\nA revision history is a list of commit objects that altogether contain all the changes that you and your other team members have made to the project files.\n\nEvery time you make a new commit, the head will move to that new commit.  (This way you are able to have access to the entire project history of commits.)\n\nIt is possible to move the head to a different commit, however, you must remember that commits made after the commit to which the head is pointing at are not possible to be reviewed.\n\n### The Stage\n\nWhen creating a commit, you select which files you wish to add to the commit. This is called \"staging\" your commit. (basically, preparing your formal commit object)\n\nTypically, you will use \"git add .\" which adds all files to your stage for the current commit, then follow it with your commit.\n\n### Branch\n\nA branch allows you to work on a specific feature of code without compromising the main code in a repository.  [http://content.breatheco.de/lesson/how-to-use-git-version-control-system#a-head-object-is-a-list-of-commits](http://content.breatheco.de/lesson/how-to-use-git-version-control-system#a-head-object-is-a-list-of-commits) \n\nThat means that each branch is a separate revision history.\n\nThe main branch of code in the repository is called \"Master\" typically\n\nYou can have as many different branches as you want in a repository/project.\n\nEach branch has it’s own head which resides on the last commit of that branch. So if you have two branches, \"Master\" and “login”, each will have their own head on the last commit.\n\nWhen you are satisfied with the feature you developed, you can merge it back in to master and it will bring all code changes, along with replace the head on master with the new head.\n\n### Typical Flow\n\n1. All new projects have to be initialized with git.  (git init)\n    - This creates a git folder with all elements that define the git project.\n    - At this point, it’s also good to set the remote for your project. This will tell the project what the address is for your repository so that you can push changes later.\n\n 2. the command for this is:  git remote add origin https://github.com/user/repo.git \n\n 3. where the address at the end is your repository address or SSH address.\n\n26. Whenever you have to stage your changes, you use \"git add\". As mentioned before, to add all file changes, “git add .” \n\n > Note: conversely, you can condense this into the git commit by adding a flag \"-a\" which means add all files to the commit stage\n\n4. Once you made changes to your code and you are ready to commit: You create a commit object by using \"git commit -m ‘commit message’\" or if you have not used git add, you can use the -a flag as mentioned before.\n\n5. At this point, you want to use ‘git push’ to upload your changes\n\n6. If you need to create a new branch:\n\n    - git checkout -b [branch name]\n\n    - next you need to switch to that branch to work on it\n\n        3. git checkout [branch name]\n\n    - when you complete your changes on a new branch, you merge the changes back in using the following:\n\n        4. git merge [other branch name]\n\n\n## Commit vs PUSH\n\nWe already discussed that a commit will allow you to create a new commit object. This is a local bundle you are preparing to upload.\n\nWhen you finish your commit, you have to attempt to upload that code to the repository.\n\nThis is where git push comes in. It allows you to attempt to upload your changes to the repository.\n\nIf there are any issues where a conflict has arisen, you will have to resolve the conflicts before pushing your changes.\n\n## Resolving Conflicts\n\nFor conflicts, git will notify you that there are issues.\n\n- this typically occurs when two people are trying to modify the same file(s).\n\nTo proceed you need to:\n\n- Get the new changes downloaded to your computer with ‘git pull’ or if you are on a branch, ‘git pull origin branch-name’\n\n- Then you will be asked to merge the changes \n\n- Here you will have to edit the files with conflicts and resolve any changes. \n\n- Once you have resolved the conflicts, you can attempt to push changes again.\n\n## Start Coding With The Students!\n\n** At this point we will start the assignment for the git collaborative portfolio project.**\n\n** Break the class into groups and assign a section of the portfolio project**\n\n** [https://github.com/breatheco-de/exercise-collaborative-html-website/blob/master/website1/designs/guide.jpg]**(https://github.com/breatheco-de/exercise-collaborative-html-website/blob/master/website1/designs/guide.jpg)\n\n* Use peer programming to complete the section quickly, then upload the changes to the repository your professor has provided.\n\nTeacher will clone the repo in a new class repository and will handle updating the name of the template parts so that the site functions properly.\n\n### Students Homework: \n\nFinish all pending projects including todays."
                    },
                    {
                        "id": 5,
                        "label": "Excuse Generator",
                        "lessons": [
                            {
                                "slug": "what-is-javascript-learn-to-code-in-javascript",
                                "title": "What is JavaScript? Learn to Code in JavaScript"
                            },
                            {
                                "slug": "conditionals-in-programing-coding",
                                "title": "Conditionals in Programming or Coding"
                            },
                            {
                                "slug": "working-with-functions",
                                "title": "Working with Functions"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "javascript-beginner-exercises",
                                "title": "Javascript Beginner Tutorial (interactive)"
                            }
                        ],
                        "homework": "Remember to read the next lesson before next class. Students should finish their project.",
                        "position": 5,
                        "assignments": [],
                        "description": "HTML & CSS are great, but the world needed interactive pages (not just beautiful text documents). JavaScript comes to help us generate HTML & CSS based commands after the initial text document has already loaded.  JavaScript will also re-write the website live, based on the user's activity.\",",
                        "key-concepts": [
                            "Data-types in Javasrcipt",
                            "what is a variable",
                            "arrays",
                            "You can skip lines with conditionals",
                            "do not explain looping yet",
                            "Null vs Undefined",
                            "Generate random numbers",
                            "The code is a procedure from top to bottom (for now)"
                        ],
                        "technologies": [
                            {
                                "slug": "js",
                                "title": "Javascript"
                            }
                        ],
                        "teacher_instructions": "Explain the basic coding concepts (variables, data-types, functions, loops, arrays, etc.), then start the excuse generator is a great way to explain how JavaScript and HTML/CSS can play together. Use the VanillaJS boilerplate, that way students will start getting used to it",
                        "extended_instructions": "# Javascript Variables, DataTypes and Arrays\n\nStart anwering any questions students may have.\n\n## `20min` Javascript Intro:\n\n**Warning**: Please do not explain the DOM or Events, also, don't explain loops or functions yet. Students will be overwhelmed.\n\n### Why Javascript?\n\nStatic websites are just blog posts, but was about interactive applications like Instagram, Facebook, etc.?\n\nJavascript lets us create dynamic HTML and CSS based on user or system interactions, for example:\n- Adding an `li` to a `ul` when the user clicks on a button.\n- Showing a banner or ad (publicity) based on the user IP address.\n- Ask for information to a database.\n- Write on a database using AJAX.\n- etc.\n\nBasically: Javascript its a programming language to generate HTML and CSS (text) based on events.\n\n## The`<script>` tag:\n\nAll javascript must be done on a separate sheet (best practice).\nYou have to import to put that tag **right before the body closing tag**.\nThe code execution starts on the `window.onload = function(){}` like this:\n```\n//index.js\n\nwindow.onload = function(){\n    //your code here\n}\n\n//you can declar other functions here, but please don't write code outside functions\n```\n\n**Warning**: Carefull explaining the windown.onload, because today we are not suppose to overwhelme them with events and functions.\n\n### Explain Variables:\n\nVariables are javascript’s version of containers that hold some information.\n\nAn example of this is:\n\n1. Let’s say we needed to store someone’s birthday for an age verification script\n2. One of our variables might be: `var day = 29;`\n3. There are three things going on here:\n    - First, the computer interprets the letters VAR as the beginnig of a variable declaration.\n    - After `VAR` it must always come the variable name: in our case is called `day`.\n    - Secondly, we are storing a value of 29 in that variable.\n    - Finally, notice the syntax. All javascript lines typically end with semicolon. There will be some cases where you don’t use semicolon and we will learn those later but for now, all lines are with semicolon.\n\n3. Given that we defined the var above, `var day = 29;` if we want to display it for testing, we can show use the javascript console:\n    - Explain how to open the google inspector console\n    - So to display the variable, you would use: `console.log(day);`\n    - will print on the console `29`\n\n### Data Types\n\nYou can store 6 differnt types of values: Strings, Integers, Booleans, Arrays, Objects, Functions, Null and Undefined.\n\n- Boolean - true/false\n- String - always in quotes\n- Number - any type of number -  integer numbers, negative numbers, decimal numbers, floats, etc.\n- Undefined - nothing was set or specified for the variable. so the variable has no value\n- Null - When a database or function returns nothing, it returns null\n- Array - data sets [2,3,4,\"cat\",242,\"d\"]\n- Object - You can explain objects like real life objects that are comprised by other datatypes, you can use the analogy with HTML Tags because the tags have properties taht describe them further. Objects behave the same way.\n\nNote: Data Types on Breatheco.de: [http://content.breatheco.de/lesson/what-is-javascript-learn-to-code-in-javascript#data-types](http://content.breatheco.de/lesson/what-is-javascript-learn-to-code-in-javascript#data-types)\n\n### String Contatenation\n\nSuming two integers its not the same as suming two strings, as web developers we are going to be creating HTML using Javascript, we will contatenate like crazy!\n\n### Arrays\n\nSince we just learned what an array is, let’s look at some basic properties of an array:\n\n1. value or item: The value stored on each position.\n2. index or position: the position of the given value in the array `note: the first position starts at 0`\n3. length - the total length of the array\n\nDeclaring an array [http://content.breatheco.de/lesson/what-is-an-array-define-array](http://content.breatheco.de/lesson/what-is-an-array-define-array#how-to-declare-an-array)\n\nTo initialize an array , you can use the following:\n```js\nlet myArray = [];\n```\nThis defines the array as an empty set so that you can add values later.\n\nNote: Don’t use, use let or const.\n\nYou can also initialize an array with a value in it**\n```js\nlet myArray = [1,2,3,4,5];\n```\nDisplaying the value of an array using console, we can show it as `console.log(myArray[0]);`\n\nUpdating a specific position: `myArray[4]=3;`\n\nGenerating a random number using `Math.rand()`\n\n## Start Coding!! Let’s work on the Excuse Generator\n\n- Read the instructions with the students, and introduce the problem: How can we create a excuse? What are the pieces that we need to build?\n- Students MUST discuss with each other how to approach the problem of creating an excuse, guide them.\n- The project does not have to be fully finished at the end of the class, some students are slower than others, but at  least tgey should be half way and with a clear idea.\n- To include the excuse into the document you can tell them tu use `document.querySelector('body').innerHTML = excuse;` but don't try to explain the DOM, that is for another class and they are already overwhelmed.\n"
                    },
                    {
                        "id": 6,
                        "label": "Practice JS",
                        "lessons": [],
                        "project": {
                            "title": "Code an Excuse Generator in Javascript",
                            "instructions": "https://projects.breatheco.de/project/excuse-generator"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "javascript-functions-exercises-tutorial",
                                "title": "Practice Javascript Functions Tutorial"
                            }
                        ],
                        "homework": "",
                        "position": 6,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/tutorial-project-excuse-generator-javascript",
                                "slug": "excuse-generator",
                                "title": "Code an Excuse Generator in Javascript"
                            }
                        ],
                        "description": "The only way to master coding is thru practice, today we'll show you how practice must be done, and we hope you continue practicing on your own time.",
                        "key-concepts": [
                            "how gitpod exercises work",
                            "how important it is to practice",
                            "how to work with strings",
                            "how to work with functions",
                            "how to work with arrays"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Coding Practice Day: Students take turns on the screen, one at a time, one student share the screen and tries completing the exercise, and the others help, every student must go around at least two times. Stop the class and explain JS concepts when needed.",
                        "extended_instructions": "# Exercise Day\n\nExplain to the students how they learnpack exercises work:\n\nThere are 4 main exercises: Begin JS, Arrays, Functions, and Mastering Javascript, and they are supposed to be done in parallel because they share the same concepts E.g: You need to know about strings to know about functions because you probably will use a string within a function.\n\n1. They can start any series of exercises by clicking on the gitpod button in GitHub (using the gitpod extensions)\n2. Once the exercise engine is loaded and the exercises are running they can click \"next\" for each exercise.\n3. If the engine is down the can type `learnpack start` to restart the engine.\n\nThey have to complete all exercises by the end of the Bootcamp and repeat some of them if possible, particularly the \"arrays\" exercises.\n\n## Start Practicing\n\nOpen the begin js exercises and have the class take turns on the screen to complete each exercise during the 3 hours.\n\nNote: You can stop the class anytime and explain a javascript concept if you see they need to re-enforce the concept."
                    },
                    {
                        "id": 7,
                        "label": "Domain Name Generator",
                        "lessons": [
                            {
                                "slug": "what-is-an-array-define-array",
                                "title": "It's Time To Learn What is an Array"
                            }
                        ],
                        "project": {
                            "title": "Domain Name Generator",
                            "instructions": "https://projects.breatheco.de/project/domain-generator"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "javascript-array-loops-exercises",
                                "title": "Learn Javascript Arrays and Loops Interactive"
                            }
                        ],
                        "homework": "Students must remember to read the next lesson before next class and finish the domain name generator and work hard on the JS replits for Begin JS, Arrays, Functions.",
                        "position": 7,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-domain-generator",
                                "slug": "domain-generator",
                                "title": "Domain Name Generator"
                            }
                        ],
                        "description": "Arrays are the only way to have a list of things in programming, and they are challenging because developers need to master the art of getting or setting values from arrays using loops\n           ",
                        "key-concepts": [
                            "Functions anonymous vs normal",
                            "forEach",
                            "Every Javascript code starts OnLoad",
                            "String concatenation",
                            "Main website events: PreLoad & OnLoad",
                            "The-runtime (after OnLoad)",
                            " Introduce the DOM",
                            " Use queryselector() to select DOM Elements just like you do with CSS",
                            " Include your bundle on index.html (only one script tag from now on)"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Review everything we have seen so far very quick, reinforce that we are building HTML using JS now, ask the students and ask them to strategize on the white board, before starting to code reinforce the ONLOAD function as the beginning of your application, start using the breathecode-cli and vanilla-js",
                        "extended_instructions": "# Looping and Arrays\n\nWelcome class.\n\n## `1 min` Remind students the importance about finishing the JS exercises\n\nStudents should be completing those exercises HARD: Begin JS, Loops, Arrays, Functions and optionally Mastering JS.\nRemind students that reading will do no help, this phase is about practice, practice and more practice.\n\n## `5 min` Review last class\n\n- We started generating HTML Strings for the first time, that is the developers ultimate goal.\n- Data Types, Variables and Arrays.\n- Algorithms run from top to bottom, line by line.\n- You can skip lines with conditionals, repeat lines with loops and reuse lines with functions.\n- Arrays have items (or values) and index (or position), they start at 0. And you can get the length with `myArray.length`.\n- Concatenate stringgs using + and the new amazing type of quotes '`' that is easier for creating big dynamic strings.\n\n## `10 min` Talk about looping: with and without arrays (for vs foreach).\n\n- The main objective for a loop is to repeat a bunch of lines of code from the openin curly brace to the closing curly brace.\n- There are several ways of looping but we will focus mainly in the `for` loop for now.\n- Here is a 12min video explaining [all the different ways of looping](https://www.youtube.com/watch?v=U3ZlQSOcOI0).\n- You can add elements to an array with `push`.\n\n## `10 min` Talk more in detail about functions\n\n- Functions are the last thing to learn about basic algorithms (encouragement).\n- You create a function when you find yourself doing the same thing all over.\n- Functions purpose is to receive an input and return an output.\n- The function stops executing after returning.\n- Functions SHOULD USE VARIABLES declared ourside of them (best practice).\n- Anonymus function vs normal function.\n- In javascript, we will only use arrow functions (no the original type of function) because they are more similar to other programming languages functions.\n\n## `2:20 min` hours Start coding with the students!\n\n- Ask students to use the boilerplate for vanila.js.\n- Read the instructions for the domain name generator and ask students to discuss and build the strategy on the whiteboard.\n\n## ⚠ ️IMPORTANT `before leaving` Invite them to the coding weekend\n\nThis is the most important coding weekend of the entire course because they have to understand JS well to be able to continue learning more stuff.\n"
                    },
                    {
                        "id": 8,
                        "label": "Catch up",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must remember to read the next lesson before next class and must finish all pending project and exercises.",
                        "position": 8,
                        "assignments": [],
                        "description": "You have a lot of things to cach up on, finish and deliver the replit exercises and projects. Make sure to review the last replit of events (todo list). Use your time wisely...",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Help students finish the replit exercises and projects. Make sure to review the last replit of events (todo list). IMPORTANT: This next coding weekend will be the last before getting into react, encourage students to attend.",
                        "extended_instructions": "# Practice Day (replits and projects)\n\n## `5 min` Take any questions about javascript\n\nRemind everyone that the all the replits about Javascript are extremelly important, the only way to become better is practicing.\n\n## `10 min` Last review about JS (really fast)\n\n- Everything starts on the window.onload\n- A non declared variable value is `undefined` (this will help them read the console errors)\n- If you forget to return, the function will return `undefined` (this will help them read the console errors)\n- Our main purpose for a front-end coder is to **generate dynamic HTML and CSS**, you will be using algorithms to do so (the need to understand that for better react.js learning curve)\n- All ways of looping are important, including the `for` loop because its the only one with total freedom and we not only loop arrays, we also loop for other reasons.\n- Map vs Foreach: In react we will map all the time because it creates a new array and that is really important.\n- Functions goal is: Receive an input and return and output. The execution stops after returning.\n- What is `myArray.find` and `myArray.filter`. In React we will use them all the time.\n\n## `2 hours` Last Repl.it/Project Intensive before The DOM!!\n\n☢ 😰 🤯 ️Students are overwhelmed!\n\nThis is the most delicate part of the course, there is a **lot of risk on students droping**. Please make sure all of them do lots of replits today.\nDo not teach new concepts!\n\n💡 Tell students that today the MUST ask questions after 5 min of being stuck, They cannot try on their own for 30 minutes before asking, not today.\nThey will have planty of challenges to keep learning on their own tomorrow.\n\n## `45 min` before the class finished, do the student exernal profile with them:\n    - Breafly explain open source and why its important, examples of great software build like that.\n    - Explain that developers like to collaborate in open source and why its important for them.\n    - Pull Request are the best mechanism for collaboration because you don't need permission to push.\n    - Students are required to do a real collaboration to a real open source project by the end of the class to an open source project.\n    - Talk about the importance of having green dots on your github activity graph.\n    - Explain YML breafly.\n    - Help them do they YML file and push a draft of their profile (don't worry about content, just structure).\n    - Once they do their PR they can see their live profile because we are [automatically merging](https://mergify.io/) and deploying.\n    - If the automatic merge does not occur, its probably because their YML has syntax problem, you can review the travis execution log on the pull request details.\n\nNote: They students don't have to worry about the content, today its just about the YML and making it work and show up on the [student list](http://sep.4geeksacademy.co/students/).\n\n5. After their `Student External Profile` is done, they may continue doing replits and finishing their previous projects."
                    },
                    {
                        "id": 9,
                        "label": "Conditional Profile Card ",
                        "lessons": [],
                        "project": {
                            "title": "Conditional Profile Card Generator",
                            "instructions": "https://projects.breatheco.de/project/conditional-profile-card"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "master-javascript-exercises",
                                "title": "Mastering Javascript"
                            }
                        ],
                        "scrollY": 2632,
                        "homework": "Students must remember to read the next lesson before next class and finish the profile card and exercises to date.",
                        "position": 9,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-conditional-profile-card",
                                "slug": "conditional-profile-card",
                                "title": "Conditional Profile Card Generator"
                            }
                        ],
                        "description": "What we call \\\"thinking\\\" is basically the process of making decisions based on some information (variables) that we have available. You can replicate the same behavior in a computer by using conditionals and logical operations.",
                        "key-concepts": [
                            "Every Javascript code starts OnLoad",
                            "String concatenation",
                            "Variable Initialization",
                            "If...else",
                            "Sometimes you don't need else",
                            "What is compiling",
                            "Why does the Javascript community decided to Bundle (compatibility, ES6, performance, etc)",
                            "Bundling JS, CSS and Images",
                            "Include your bundle on index.html"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Ask students to gather and create a flow chart on the whiteboard with the decision process behind building the html for the profile card project. Finish conditional profile card and all previous exercises. ",
                        "extended_instructions": "## Conditionally Rendering\n\n1. Rendering means printing or displaying.\n2. In HTTP you can only print text, it can be an HTML Text, CSS Text, JSON Text, Javascript Test.\n3. Basically it means generating strings dynamically.\n4. Conditional rendering is what makes your website interactive.\n\n\n### There are 2 ways of writing conditions:  \n\nUsing the `if....else`  statement.  \n\n```js\nlet canDrive = false;\nif(age > 16){\n    // do something\n    canDrive = true;\n}\nelse{\n    canDrive = false;\n}\n```\nOr using a ternary (the most popular for conditional rendering):\n\n```js\nlet canDrive = (age > 16) ? true : false;\n```\nNote: as you can see the ternary is smaller, it's a great and agile resource.\n\n## What is conditional rendering?\n\nIt means using conditions to generate HTML dynamically. Basically, your HTML will be different depending on certain **conditions** that you determine.\n\nFor example, using the same condition before:\n```js\nlet canDrive = (age > 16) ? \"can\" : \"cannot\";\nlet myHTML = 'I ' + canDrive + \" drive\";\n\n// myHTML will be either \"I can drive\" or \"I cannot drive\"\n```\n\nWith the javascript template literrals is even easier to generate strings dynamically.\n\n```js\n\nlet person = {\n    name: \"Alejandro\",\n    age: 17\n}\nlet myHTML = `\n    <div>\n          <p>My name is ${person.name}</p>\n          <p>and I am ${person.age > 21 ? \"capable\" : \"not capable\"} to drink</p>\n    </div>\n`;\n```\nThis javascript code will output the following HTML:\n\n```html\n    <div>\n          <p>My name is Alejandro</p>\n          <p>and I am capable to drink</p>\n    </div>\n```\n\n"
                    },
                    {
                        "id": 10,
                        "label": "The DOM",
                        "lessons": [
                            {
                                "slug": "what-is-front-end-development",
                                "title": "What is Front-End Development"
                            },
                            {
                                "slug": "what-is-dom-define-dom",
                                "title": "What is DOM: Document Object Model"
                            },
                            {
                                "slug": "event-driven-programming",
                                "title": "Event Driven Programming"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "the-dom-exercises",
                                "title": "Learn how to manipulate The DOM with JS"
                            },
                            {
                                "slug": "javascript-events-exercises",
                                "title": "Javascript Events"
                            }
                        ],
                        "scrollY": 2824,
                        "homework": "Students must remember to read the next lesson before next class and finish the random card and the dom and events exercises.",
                        "position": 10,
                        "assignments": [],
                        "description": "Ok but how do we use JavaScript to build websites? You have to interact with The DOM to create dynamic HTML/CSS and wait for events to occur.",
                        "key-concepts": [
                            "Main website events: Preload & OnLoad",
                            "The-Runtime (after download)",
                            "Instroduce the DOM",
                            "Use queryselector() to select DOM Elements just like you do with CSS",
                            "Add/remove CSS classes to DOM elements",
                            "Please do not attempt to explain Webpack config.",
                            "Bundling JS, CSS and Images",
                            "Include your bundle on index.html"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Explain the DOM in detail and do the exercises about the DOM with the students, students take turns on the screen to complete each exercise.",
                        "extended_instructions": "# Day 10 -  The DOM\n\nBefore the class, teacher assistants can sti with students and responde eny coding questions.\n\n## `30 min` Introduction about the DOM\n\nNo we are goign to be using Javascript to create or change HTML code: The DOM.\n\n- Once the browser recieves the server response it starts building The DOM until `window.onload` gets triggered.\n- The DOM is a LIVE hierarchy that represents the HTML document.\n- The DOM its not the same as the source code, the source code will be the first version of the DOM ants its quickly overriten by the LIVE changes.\n- Draw a DOM example on the whiteboard vs a its corresponding HTML code.\n- Show on the browser the google inspector with the DOM opened (the elements tab).\n- Show how it changes live based on the user/system activity clicks/mouseover/etc.\n- The `querySelector` and `querySelectorAll` will be our main way to use The DOM, the other methods are deprecated: getElementById, byTagName, etc.\n- Once you select DOM element and store it on a variable you can change any of its properties: Styles, Classes, Values, etc. ANY PROPERTY!\n- Code on the google inspector console a small 2 line script showing a querySelector and changing a style:\n\n```js  \nconst anyDOMElement = document.querySelector(‘.anyClass’);\n//changing a background\nanyDOMElement.style.backgroundColor = ‘black’;\n//adding a class\nanyDOMElement.addClass('d-none');\nanyDOMElement.removeClass('d-none');\n// inner html\nanyDOMElement.innerHTML = \"html string that will be included inside the selector\"\n```\n\n## `10 min` Reinforce what is webpack and npm\n\nJust a brief reminder about bundling, `npm install`, `npm run build`, etc.\n\n## `2:20min ` Start the DOM exercises\n\nEach student rotates the screan, one at a time."
                    },
                    {
                        "id": 11,
                        "label": "Random Card Generator",
                        "lessons": [],
                        "project": {
                            "title": "Random Card Generator",
                            "instructions": "https://projects.breatheco.de/project/random-card"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 2886,
                        "homework": "",
                        "position": 11,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-random-card",
                                "slug": "random-card",
                                "title": "Random Card Generator"
                            }
                        ],
                        "description": "Let's build our first project using the DOM, manipulate syles, classes and HTML code using Javascript during the runtime.",
                        "key-concepts": [
                            "Main website events: Preload & OnLoad",
                            "The-Runtime (after download)",
                            "Instroduce the DOM",
                            "Use queryselector() to select DOM Elements just like you do with CSS",
                            "Add/remove CSS classes to DOM elements",
                            "Please do not attempt to explain Webpack config",
                            "Bundling JS, CSS and Images",
                            "Include your bundle on index.html"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Focus ",
                        "extended_instructions": "## Answer questions\n\nThe first 15min of the class are ideal to answer questions while the students connect.\n\n## `10 min` Review the DOM again\n\n- Once the browser recieves the server response it starts building The DOM until `window.onload` gets triggered.\n- The DOM is a LIVE hierarchy that represents the HTML document.\n- The DOM its not the same as the source code, the source code will be the first version of the DOM ants its quickly overriten by the LIVE changes.\n- Draw a DOM example on the whiteboard vs a its corresponding HTML code.\n- Show on the browser the google inspector with the DOM opened (the elements tab).\n- Show how it changes live based on the user/system activity clicks/mouseover/etc.\n- The `querySelector` and `querySelectorAll` will be our main way to use The DOM, the other methods are deprecated: getElementById, byTagName, etc.\n- Once you select DOM element and store it on a variable you can change any of its properties: Styles, Classes, Values, etc. ANY PROPERTY!\n- Code on the google inspector console a small 2 line script showing a querySelector and changing a style:\n- \n```js  \nconst anyDOMElement = document.querySelector(‘.anyClass’);\n//changing a background\nanyDOMElement.style.backgroundColor = ‘black’;\n//adding a class\nanyDOMElement.addClass('d-none');\nanyDOMElement.removeClass('d-none');\n// inner html\nanyDOMElement.innerHTML = \"html string that will be included inside the selector\"\n```\n\n## `20 min` Reinforce what is webpack and the vanilla js boilerplate\n\n1. Explain how to start using the boilerplate.\n2. Show students that the README.md has everything they need to start coding.\n3. Show how to see errors on the terminal.\n4. Show how to see errors on the INSPECTOR.\n\n## `20` Strategize the project!\n\nReact instructions carefully with students and plan a strategy!\n\n- Start strategizing the HTML/CSS.\n- After having one hard coded card and suite, how can you change it dynamically?: \n    - Approach A: Dynamically changing the card css classes. E.g: havin a class `card` and 4 classes `diamons`, `club`, `spade` and `heart`.\n    - Approach B: Using `domElement.styles.color = 'red';` instead of using classes.\n- Use the whiteboard with the students.\n- Every student must participate.\n\n## `2:20` Code the project\n\nOnce the strategy is clear in written down, help students implement it.\n\n## Ask students to finish replits about the DOM."
                    },
                    {
                        "id": 12,
                        "label": "Unit Testing with Jest",
                        "lessons": [
                            {
                                "slug": "how-to-create-unit-testing-with-Javascript-and-Jest",
                                "title": "How to create unit testing with JEST"
                            }
                        ],
                        "project": {
                            "title": "Your first unit tests with Javascript's Jest Framework",
                            "instructions": "https://projects.breatheco.de/project/unit-test-with-jest"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Finish pending JS exercises and jest project.",
                        "position": 12,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-unit-test-with-jest",
                                "slug": "unit-test-with-jest",
                                "title": "Your first unit tests with Javascript's Jest Framework"
                            }
                        ],
                        "description": "Quality Assurance is one of the most valued skills in big tech major companies, today we are learning how you can write code that tests your previously written code in an automated way. Welcome to unit testing!",
                        "key-concepts": [
                            "What is a unit test",
                            "Very simple test case",
                            "Some times there are several correct answers",
                            "What is an assertion",
                            "Jest Framework",
                            "You have to test succes AND failure"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Explain how unit testing works with a very simple example (sum function) and then show the students how the exercises are auto-graded with unite tests, open one of the simplest JS exercises, and show how the tests work. Then start with today's project.",
                        "extended_instructions": "# `20min` Unit testing\n\nWhat is a unit test and why do we need it? Explan a simple function like the `sum` function that sums two numbers and how to test it:\n\n\n```js\n\nfunction sum(a,b){\n     // leave the function without implementation\n}\n\n```\n\nWhat should this function return? a+b\n\nIf I pass `5` and `7` to this function, what should the function return? `12`\n\nUnit tests are HARD CODED tests with very specific inputs to function and very specific expectations about the result of those functions.\n\n## How can you assert?\n\nThe word \"assert\" is used in many programming languages testing frameworks, asserting basically means comparing.\n\nWe are going to be learning in Javascript and Jest, instead of `assert` you have to say `expect`.\n\nDepending on the framework the syntax varies, but in javascript we assert with Jest like this:\n```js\nexpect(something).toBe(somehitngElse)\n```\n\nFor example: \n```js\ntest(\"If 5 and.7 are passed, then the function must return 12\", function(){\n    const sum  = require('./sum.js');\n    const total = sum(5,7);\n    expect(total).toBe(12);\n});\n```\n\nYou can find all the [jest expect functions here](https://jestjs.io/docs/en/expect.html).\n\n## Testing for failure instead of success\n\n1. Try testing your functions for weird scenarios\n2. Try to break your functions with the wrong parameters.\n3. Think about all the possible scenarios.\n\n## `2hr` Start the interactive project\n\nThere is an interactive project available that will explain a lot to the students, start the project with them and let them finish it on their own."
                    },
                    {
                        "id": 13,
                        "label": "Landing Page with React",
                        "lessons": [
                            {
                                "slug": "javascript-import",
                                "title": "JavaScript Import and Export of Modules"
                            },
                            {
                                "slug": "learn-react-js-tutorial",
                                "title": "Learn React Here : React Js Tutorial"
                            },
                            {
                                "slug": "making-react-components",
                                "title": "Creating React Components"
                            }
                        ],
                        "project": {
                            "title": "Landing Page with React",
                            "instructions": "https://projects.breatheco.de/project/landing-page-with-react"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "react-js-exercises",
                                "title": "Learn React.js Interactively"
                            }
                        ],
                        "homework": "Students must remember to read the next lesson before nest class and finish their landing page with react.",
                        "position": 13,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-landing-page-with-react",
                                "slug": "landing-page-with-react",
                                "title": "Landing Page with React"
                            }
                        ],
                        "description": "But working with the DOM can get tricky and it's resource consuming, for that and many other reasons libraries like React.js got popular in the last couple of years. The let you create HTML and CSS using JS in a very intuitive way",
                        "key-concepts": [
                            "Export -> Import Modules",
                            "You can create your own tags",
                            "Create a component as a function",
                            "JSX Syntax",
                            "Component properties",
                            "You will find on the internet syntax for class components (legacy)"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Make students create their first react components and explain the use of JSX. Only talk about functional components, class components are deprecated and we will be using only hooks. ",
                        "extended_instructions": "# Introduction to React.js\n\n## `5 min` Take any theorical questions about DOM/Javascript\n\n## `30 min` Beginnin of todays new topic\n\nToday we will be covering the beginning of creating our first React.js Applications!\nThis topic will be broken up in a few lessons with the overview being today and more detail over the coming days.\nPLEASE DON’T MISS CLASS and make sure to go to catch up and your own time and saturdays.\n\n### Export -> Import variables among your files\n\nThanks to webpack we can split our code in many files now.\nAll we have to do is expecify what variables we want to share with other files using the `export` sentence.\nOn the other file we can `import` the variable like this:\n```js\n//on file2.js we can declare a function and store it on a variable\nexport let sum = (a,b) => (\n  return a + b;\n);\n\n//on file1.js we can import that function and use it like this:\nimport { sum } from 'path/to/file2.js';\n\nconsole.log(sum(2,7));\n```\n\n\n### React JS Introduction\n\nA front end javascript library that is used to create advanced HTML/CSS/JS projects.\nIt’s highly in demand in the job market right now and growing.\n\n#### Why React?\n\n- No more DOM. React handles all of that. You will create your own components and tell react what component to render and when; react handles all interaction with DOM on the front end.\n- Now its all about component based, its a lot easier to re-use your code int he future.\n- It’s much faster than traditional javascript. Instead of re-rendering the whole page when a single change occurs, React renders individual items that change. \n\n#### You can create your own tags\n\n- Before, you learned that HTML Tags are set functions that the browser knows how to interpret.\n- Now in React, You can create your own tags by creating usable components.\n- Just create a function that returns HTML and that will become its own tag.\n- JSX its like HTML+JS you have to get use to it.\n- You have to use braces in the middle of your HTML to include dynamic JS.\n```jsx\nconst Alert = function(props){\n    return (<div className=\"any-class-name\">{props.children}</div>);\n}\n\nReactDOM.render(<div className=\"any-class-name\">{props.children}</div>)\n```\n- You have to use [proptypes](https://reactjs.org/docs/typechecking-with-proptypes.html) (best practice).\n```js\nAlert.propTypes = {\n  children: PropTypes.node,\n  // any other property...\n};\n```\n\n## `1:25 min` Do the React Exercises with the students\n\nThe transition to react its hard for the students, that is why we will be doing the react exercises with them.\n\n## `60 min before class ends` Start the class project (Landing Page)\n\n- This project will be do in groups of two. \n- Every team must share the same git repository.\n- Take some time to read the instructions with the students and have them setup they boilerplate and repository.\n- Each group will strategize privatly how to approach the exercise."
                    },
                    {
                        "id": 14,
                        "label": "Simple Counter",
                        "lessons": [],
                        "project": {
                            "title": "Simple Counter",
                            "instructions": "https://projects.breatheco.de/project/simple-counter-react"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must work on their simple counter.",
                        "position": 14,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-simple-counter-react",
                                "slug": "simple-counter-react",
                                "title": "Simple Counter"
                            }
                        ],
                        "description": "Its the first time you've heard or learn about react, we have given you a lot of exercises to practice. Please practice like crazy with all of them. Ask questions",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Use half of the class to explain Hooks. Students have now a lot of homework: The React Replits,, Counter and the Landing page. Work with students to help them complete the developments.\",\n",
                        "extended_instructions": "# Continue working on the Landing Page\n\n## `5 min` Take any questions about javascript/react/bootstrap/html/css\n\nRemind everyone that doing the replits about Javascript is extremelly important, the only way to become better is practicing, not reading or waching videos.\n\n## `20 min` Review React.js again.\n\n- React is about components (component names MUST be written in PascalCase)\n- You build components by creating functions (the only function in the worls of JS that MUST start in capital letters)\n- Functions must return HTML.\n- Those functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n\n```\n🔥  We are not using component classes\n\nClass Componets are legacy, we recommend to ignore them as they will disappear in the next 1-2 years.\n```\n\n## `15min` Show the class again how to create a component\n\n- Create a simple component like the bootstrap card or the bootrap modal.\n- Make sure the component does not have a state, only props.\n- Explain the props in detail.\n\n\n☢ 😰 🤯 ️Students are overwhelmed ! Don't talk to much because they won't listen.\n\n💡 Tell students that today its not the day to be brave and find your own solutions, today its about asking questions after 5 minutes."
                    },
                    {
                        "id": 15,
                        "label": "Component State",
                        "lessons": [
                            {
                                "slug": "react-hooks-explained",
                                "title": "React Hooks Explained"
                            }
                        ],
                        "project": {
                            "title": "Traffic Light",
                            "instructions": "https://projects.breatheco.de/project/traffic-light-react"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 5486,
                        "homework": "Students must finish all their pending projects and exercises.",
                        "position": 15,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-traffic-light-react",
                                "slug": "traffic-light-react",
                                "title": "Traffic Light"
                            }
                        ],
                        "description": "So far you know that React components have properties (props), but there is one more important concept in react components: The State. ",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Do not explain react components with classes, it's still being used in the industry but less every day. Let's focus on mastering the useState function.",
                        "extended_instructions": "# Creating Components with States\n\n## `10 min` Take any questions about javascript/react/bootstrap/html/css\n\nRemind everyone that doing the replits about Javascript is extremelly important, the only way to become better is practicing, not reading or waching videos.\n\n## `10 min` Review React.js\n\n- React is about components (component names MUST be named in `PascalCase` notation)\n- You build components by creating functions that later will become `<Tags>` (with capital first letter)\n- Component Functions must **always** return HTML.\n- Those component functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n\n## `20 min` The state\n\n- The function useState must be used when information inside the component o website changes over time, for Example: \n    - A timer: the current time changes every second (or even milisec).\n    - Todo list: the array of todos grows over time.\n    - Fetch requests: When information comes from a nother server it was empty first and then it changes.\n\n- State vs Props:\n      1. State is declared inside the component.\n      2. Props are declared outside of the component and are read only within the inside of the component.\n\n- Show an example os using the useState.\n```js\n\n//            ⬇ value  ⬇ modifier                  ⬇ default\nconst [ value, setValue ] = useState(defaultValue);\n```\n- you can have as many states as you want\n\n### The state is inmutable:\n\nThis is wrong:\n```jsx\nconst [ todos, setTodos ] = useState([]);\n\n// ⬇  WRONG!!!!!  ⬇\nconst addTodo = (text) => {\n  todos.push(text)\n  setTodos(todos);\n}\n\n\n// ⬇  GOOD!!!!!  ⬇\nconst addTodo = (text) => {\n const newTodos =  todos.concat([text])\n  setTodos(newTodos);\n}\n```"
                    },
                    {
                        "id": 16,
                        "label": "Todo List",
                        "lessons": [
                            {
                                "slug": "controlled-vs-uncontrolled-inputs-react-js",
                                "title": "What are controlled and/or uncontrolled inputs in React.js"
                            }
                        ],
                        "project": {
                            "title": "Todolist Application Using React",
                            "instructions": "https://projects.breatheco.de/project/todo-list"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must remember to read the next lesson before next class and must finish their Todo List.\n\n",
                        "position": 16,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-todo-list",
                                "slug": "todo-list",
                                "title": "Todolist Application Using React"
                            }
                        ],
                        "description": "Finally we can create our own HTML tags and re-use them on several projects and views. The key to understand a component is understanding Props and The State. Please start working on the Todo-List Application. This project will be useful in your future as a coder!",
                        "key-concepts": [
                            "Controlled inputs",
                            "Coditional rendering",
                            "the component state",
                            "the state is inmutable",
                            "state vs props",
                            "Using const, map, filter and concat to prevent state mutation",
                            "deleting and addig  Todos"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Review landing page. React as rendering engine: Students need to understand that now they can finally create their own HTML tags (React Components) and how to use the State and the Props. Have the class discuss the strategy for todo-list.IMPORTANT: Students should be able to add & delete tasks from their Todolist(or at least have some notion).\n           ",
                        "extended_instructions": "# Creating Components with States\n\n## `10 min` Take any questions publicly\n\nRemind everyone that doing the exercises about Javascript is extremely important, the only way to become better is practicing, not reading or watching videos.\n\n## `10 min` Review React.js (yes, again)\n\n- React is about components (component names MUST be named in `PascalCase` notation)\n- You build components by creating functions (the only function in the worls of JS that MUST start in capital letters)\n- Functions must return HTML.\n- Those functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n\n## `20min` Go over the component `useState` hook again\n\n- Properties are defined **ouside** of the component.\n- The State is defined **inside** of the component.\n- The state is needed when information inside the component will **change over time**.\n- You can have as many states as you want.\n- Talk about controlled inputs with an example.\n\n\n## `2:25 min` Start the todolist with the students\n\nAny other project the student may have until this day (like the Traffic Light) is supposed to be done on their own time.\n\n- You can help them a lot on this exercise, but always do it on the whiteboard.\n- Help them do the strategy first and later help them complete the exercise.\n- This exercise is challenging for the majority of the students, but you will be able to manage if you continue helping them individually."
                    },
                    {
                        "id": 17,
                        "label": "Todo List with React and Fetch",
                        "lessons": [
                            {
                                "slug": "asynchronous-algorithms-async-await",
                                "title": "Creating asynchronous algorithms"
                            },
                            {
                                "slug": "the-fetch-javascript-api",
                                "title": "The Fetch API"
                            },
                            {
                                "slug": "understanding-rest-apis",
                                "title": " Understanding Rest APIs"
                            }
                        ],
                        "project": {
                            "title": "Todolist Application Using React and Fetch",
                            "instructions": "https://projects.breatheco.de/project/todo-list-react-with-fetch"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 5241,
                        "homework": "Students must continue to work in their project.",
                        "position": 17,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-todo-list-react-with-fetch",
                                "slug": "todo-list-react-with-fetch",
                                "title": "Todolist Application Using React and Fetch"
                            }
                        ],
                        "description": "Most of the applications build on the internet require some king of database syncronization, normal made through several API requests",
                        "key-concepts": [
                            "çusing fetch to retrieve information from the server",
                            "Displaying a 'loading' before the data arrives",
                            "Reseting the state when fetch finalizes",
                            "POSTing, PUTing and DELETEing data to the server",
                            "Sync the stae with the server",
                            "asynchrounous programming",
                            "HTTP ",
                            "How to use POSTMAN (set environment variables and use collections)",
                            "JSON is a Javascript object but as a TEXT",
                            "The goal is to send / recieve everything as JSON ",
                            "Serialize>send>Unserialize",
                            "What is serialization and how to do it",
                            "Why use several request types: GET, POST, PUT, DELETE"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Introduce the concept of fetching help students finish the todo list(unstuck them) and incorporate the synconization with the API. Then, introduce the new Todo List with React and Fetch.\n",
                        "extended_instructions": "# Using Fetch to request information from API's\n\n## `5 min` Take any questions about javascript/react\n\nRemind everyone that doing the replits extremelly important, the only way to become better is practicing, not reading or waching videos.\n\n## `10 min` Review React.js\n\n- React is about components (component names MUST have the first letter written in caps)\n- You build components by creating functions (the only function in the world of JS that MUST start in capital letters)\n- Functions must return HTML.\n- Those functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n- Props vs State (props are external, state is internal)\n\n## `20 min` Review the Basics of HTTP and segway to API concepts\n\n- Client and Servers interact in the form of text\n- As a client, your job is to setup and send `Requests` with these 4 properties: \n    Method: GET=Read POST=Create PUT=Update DELETE=DELETE\n    Body: the payload (only applies to POST and PUT) and must be formated in csv,json,xml or similar.\n    Content-Type: the format that the payload will have.\n    URL: Where the request is going to be sent.\n- Go over the concept of serialization (form json string -> to real object in javascript)\n- You have to wait for the response using Promises (do not explain async/await yet)\n- This is how a typical [API documentation looks](http://assets.breatheco.de/apis/fake/todos/), next project we will be using a real life Starwars API.\n\n## `20 min` Consuming API's using the Fetch method in Javascript\n\nNow, for the first time, we have a way of askin for aditional information during runtime\n\n```js\nfetch('url/to/fetch', additionalSettings)\n    .then(resp => {\n        console.log(resp.ok); // will be tru if the response is successfull\n        console.log(resp.status); // the status code = 200 or code = 400 etc.\n        console.log(resp.text()); // will try return the exact result as string\n        return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results\n    })\n    .then(data => {\n        //here is were your code should start after the fetch finishes\n        console.log(data); //this will print on the console the exact object received from the server\n    })\n    .catch(error => {\n        //error handling\n        console.log(error);\n    })\n```\n# Consuming REST API's to GET, POST, PUT and DELETE\n\nToday we will be using the Fetch API to create POST/PUT/DELETE methods.\n\n## Explain how to code a fetch request to successfully implemente the GET/POST/PUT/DELETE with JS\n\nIn the following example, the `additionalSettings` variable has the key to everything, you can specify the Content-Type, Method, and Body of the request.\n\n```js\n\nconst additionalSettings = {\n    \"headers\": {\n        \"method\": \"POST\",\n        \"Content-Type\": \"application/json\",\n        \"body\": JSON.stringify(someObject)\n    }\n}\n\nfetch('url/to/fetch', additionalSettings)\n    .then(resp => {\n        console.log(resp.ok); // will be tru if the response is successfull\n        console.log(resp.status); // the status code = 200 or code = 400 etc.\n        console.log(resp.text()); // will try return the exact result as string\n        return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results\n    })\n    .then(data => {\n        //here is were your code should start after the fetch finishes\n        console.log(data); //this will print on the console the exact object received from the server\n    })\n    .catch(error => {\n        //error handling\n        console.log(error);\n    })\n```\n\n## `2:30min` Start Todo list with React and Fetch\n\nThis project uses everything we have seen so far: The Context API, Fetch, HTML/CSS, etc.\nThe idea is to practice everything but the only new concept will be doing POST/PUT/DELETE.\n\n\n"
                    },
                    {
                        "id": 18,
                        "label": "Catch up",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must remember to read the next lesson before next class and must finish the all replits and projects.",
                        "position": 18,
                        "assignments": [],
                        "description": "You have a lot of things to cach up on, finish your exercises and deliver your Todo lists!",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Encourage to finish their projects and exercises and to to ask questions (create a safe environment).",
                        "extended_instructions": "# Continue Todo list with React and Fetch\n\nThis project might be hard, take some time to review the questions from the students and go over any concept you feel that needs reinforcement.\n\n## Important concepts to reinfoce:\n\n- Props vs State\n- React Router (passing variables on the URL)\n- Context API\n- FLUX (action and store)"
                    },
                    {
                        "id": 19,
                        "label": "Star wars blog reading list",
                        "lessons": [
                            {
                                "slug": "routing-our-views-with-react-router",
                                "title": "Routing our Views with React Router"
                            }
                        ],
                        "project": {
                            "title": "Starwars blog reading list",
                            "instructions": "https://projects.breatheco.de/project/starwars-blog-reading-list"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students should continue with the project and prepare their questions for next class, encourage them to. Recomend them to read the lesson on \"How to make questions\".",
                        "position": 19,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-starwars-blog-reading-list",
                                "slug": "starwars-blog-reading-list",
                                "title": "Starwars blog reading list"
                            }
                        ],
                        "description": "This project is all about URLs and Routing. Each student must build two views/pages: One List and one Single. For example: List of Space Ships and a view for a single Space Ship. The have to make sure the URL's are propery setup on the reouter and also that the information is fetch on the didmount of the respectiv view. Also, you will be using the Context API for MVC (Store, View, Actions)",
                        "key-concepts": [
                            "Connecting components to URLs (routing)",
                            "Defining parameters on the URL path",
                            "Retrieving URL parameters with match.params",
                            "Using Props for components not connected directly to the <Route>",
                            "Redirecting history.push"
                        ],
                        "technologies": [],
                        "teacher_instructions": "You know exactly how to build small js apps, but what if your application will have several pages/views? E.g.: Having a 'Settings' page on the Spotify clone. We need to connect different URLs to our React Components. Welcome to the world of Routing.",
                        "extended_instructions": "# Using Context.API (with fetch)\n\n## Time for some motivation!\n\nIt is probable that students don't understand things entirely. The probably feel overwhelmed.\n\nGood encouragment ideas:\n\n- Today is the last class we are introducing new concepts for front end.\n- This is everything your need to succeed as a developer for the next 5 years.\n- The next time you will have to study so much, you will do it with a great sallary!!\n\n## `5 min` Take any questions about fetch.js or any other theorical concept.\n\n## `10 min` Review React.js and Fetch\n\n- React is about components (component names MUST be written in caps)\n- You build components by creating functions or classes (both MUST start in capital letters)\n- Review how to create a class vs functional component\n- The component objective is to create HTML.\n- You can pass props to compoentns `<Tag property={value}>`\n- You can persist those variables to the DOM using `this.setState`\n- API Calls (fetch) should be done on `componentDidMount`\n- Review how to code a fetch\n\n```js\nfetch('url/to/fetch', additionalSettings)\n    .then(resp => {\n        console.log(resp.ok); // will be tru if the response is successfull\n        console.log(resp.status); // the status code = 200 or code = 400 etc.\n        console.log(resp.text()); // will try return the exact result as string\n        return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results\n    })\n    .then(data => {\n        //here is were your code should start after the fetch finishes\n        console.log(data); //this will print on the console the exact object received from the server\n    })\n    .catch(error => {\n        //error handling\n        console.log(error);\n    })\n```\n\n# `20 min` Introduce FLUX\n\n- React created a way to share a store within the entire application.\n- Flux can be seen as an implementation of MVC on the front end side.\n- MVC = Model View Controller\n- Instead of Model View Controller here it is called: Model, View, Actions\n- The context-api will take care of propagating the store to all the views (re-render)\n\n![Context API](https://ucarecdn.com/051c4b0f-1c52-4cbe-a1b0-1d5fb074b8c4/)\n\n⚠️ Its a great idea to install the [react-hello-webapp boilerplate](https://github.com/4GeeksAcademy/react-hello-webapp) and show/explain the demonstration that comes with it.\n\nInstall it with the class.\n\n### The Views\n\n- The views are your components that you don't re-use, like `<AboutUs />` or `<Home />`.\n- You other componets are not called views because they are meant to be reused in several projects like: `<Card />`, `<Carousel />` or `<Navbar />`\n\n```jsx\n    //example render method accessin the store and actions\n    render(){\n\t\treturn <Context.Consumer>\n            {({ actions, store }) => {\n\t\t\t\treturn (\n\t\t\t\t    <ul>\n\t\t\t\t    {\n\t\t\t\t        store.favorites.map(f => \n\t\t\t\t            <li onClick={() => actions.someAction(f)}>\n\t\t\t\t                {f.name}\n\t\t\t\t            </li>\n\t\t\t\t        )\n\t\t\t\t    }\n\t\t\t\t    </ul>\n\t\t\t\t)\n\t\t\t}}\n\t\t</Context.Consumer>\n\t}\n```\n\n### The Actions\n\n- Actions are triggered by the views onClick, onMouseOver or any other event.\n- Actions have only two purposes: \n    - Call API's to update the database.  \n    - Update the store for any particular purpose (add, update, delete).\n- Examples of actions can be: login, createStudent, removeStudent, etc. Actions names should be descriptive about the business.\n\n```js\n\tconst addToFavorites = elm => {\n\t\tconst store = getStore();\n\t\tsetStore({ favorites: store.favorites.concat([elm]) });\n\t};\n```\n\n### The Store\n\nIts a container of information shared on your entire application:\n\n- You have to initilize the store with `null` or `[]` or `''` depending on your the data-type your are storing.\n- The biggest challenge on the store is modeling your data: What structures should y use? What is better to store like an array than an object?\n- You can access your store from your views in a read-only mode.\n\n```js\n\tlet exampleStoreObject = {\n\t    favorites: [\n\t        { name: 'Luke Sky Walker', age: 32 },\n\t        { name: 'Chiwawa', age: 12 },\n\t        ...\n\t    ]\n\t};\n```\n\n\n## `2 hr` Project Time!\n\nReact the instructions for the starwars blog and strategize with the students:\n\n- How many views are needed?\n- What components you should create?\n- What are the actions that will be coded?\n- What data-struture do we need for the store?"
                    },
                    {
                        "id": 20,
                        "label": "Star Wars blog - Live Coding ",
                        "lessons": [
                            {
                                "slug": "what-is-react-flux",
                                "title": "Learn What is React Flux"
                            },
                            {
                                "slug": "context-api",
                                "title": "Global state with the Context API"
                            }
                        ],
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 5816,
                        "homework": "Students must remember to read the next lesson before next class and they should finish all exercises and projects.",
                        "position": 20,
                        "assignments": [],
                        "description": "It's time for some real live coding! Ask all the questions you have prepared and wrap the last things about the Star Wars blog reading list because we are about to dive into an exiting journey inside the world of backend! :)",
                        "key-concepts": [
                            "Routing",
                            "Connecting components"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Do a live demonstration on how you would solve the Star Wars Blog project. Encourage students to ask questions. Help students finish the starwars blog and also any other previous exercises and project and publish them to github (be patient some of them may be overwhelmed)",
                        "extended_instructions": "# React Router \n\n## Time for some motivation!\n\nIt is probable that students don't understand things entirely. The probably feel overwhelmed. \nGood encouragement ideas:\n\n- Today is the last class we are introducing new concepts for the front end.\n- This is everything your need to succeed as a developer for the next 5 years.\n- The next time you will have to study so much, you will do it with a great sallary!!\n\n## `5 min` Take any questions about fetch.js or any other theorical concept.\n\n## `10 min` Review React.js and Fetch\n\n- React is about components (component names MUST be written in caps)\n- You build components by creating functions or classes (both MUST start in capital letters)\n- Review how to create a class vs functional component\n- The component objective is to create HTML.\n- You can pass props to compoentns `<Tag property={value}>`\n- You can persist those variables to the DOM using `this.setState`\n- API Calls (fetch) should be done on `componentDidMount`\n- Review how to code a fetch\n\n```js\nfetch('url/to/fetch', additionalSettings)\n    .then(resp => {\n        console.log(resp.ok); // will be tru if the response is successfull\n        console.log(resp.status); // the status code = 200 or code = 400 etc.\n        console.log(resp.text()); // will try return the exact result as string\n        return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results\n    })\n    .then(data => {\n        //here is were your code should start after the fetch finishes\n        console.log(data); //this will print on the console the exact object received from the server\n    })\n    .catch(error => {\n        //error handling\n        console.log(error);\n    })\n```\n\n# `20 min` Introduce React Router\n\n- Most applications have multiple views, or urls.\n- You don't want the server to take care of \"routing\", all traffic must be redirected to index.html\n- The fronn't end will take care of routing the URL path with a particular View (a react component)\n- Views are react components that you don't typically re-use, like: contact-us, about-us, home, dashboard, etc.\n- React Router is the most popular library to \"route\" in React.\n\n## How to route\n\n- You need to create a parent component that will be instanciated first and take care of routing.\n- That component must use `<BrowserRouter>` and several `<Route>`'s inside like this:\n\n```jsx\n<BrowserRouter>\n     <Switch>\n          <Route path=\"/home\"><AnyView /></Route>\n          <Route path=\"/Dashboard\"><AnyOtherView /></Route>\n     </Switch>\n</BrowserRouter>\n```\n\nNote: We also need a `<Switch>` because we only one to display one route at time.\n\n### Passing arguments between views using the querystring\n\n- HTTP has something call a `queryString` \n- QueryStrings are a way to pass more information to a URL like this: [google.com/?q=what is react router](google.com/?q=what%20is%20react%20router)\n\nAs you can see there is a question mark `?` at the end of the URL and then there is a variable `q` equal to `what is react router`.\n\nBasically you can tell google.com that you want to query for \"what is react router\" thru the querystring.\n\nThe query string always starts with a question mark and then you add unlimited variables and values separated by amperson `&`, for example:\n\n`https://www.google.com/search?q=what+is+react+router&start=20`\n\nIn this case we are passing two variables: `q` and `start`, we are telling google.com that we want to search for \"what is react router\" and we want to display from the result number 20 instead of 1, we are skipping the first 20 results.\n\n#### Retreiving the querystring\n\nYou can access the querystring from any react component like this:\n\n```jsx\nconst MyComponent = () => {\n    const urlParams = new URLSearchParams(window.location.search);\n    const q = urlParams.get('q');\n    const start = urlParams.get('start');\n\n    return <p>You want to query in google {q} starting from result {start}</p>\n}\n```\n\n### Passing arguments to views using params\n\nAside from the queryString there is another tool to pass information to views in react router, The Params.\n\n```jsx\n<BrowserRouter>\n     <Switch>\n          <Route path=\"/planets\"><AnyView /></Route>\n          <Route path=\"/single_planet/:planet_name\"><SinglePlanet /></Route>\n     </Switch>\n</BrowserRouter>\n```\n\nWe have two views in this example: `/planets` and `/single_planet/:planet_name`, the first one is going to render a list with all the planets in the solar system, the second one is going to display information about just ONE specific planet. At the end of the `/single_planet/:planet_name` URL you can see there is a color `:` like this: `:planet_name`, this means that `planet_name` will become a variable that will be replaced later with a value, for example:\n\n```txt\n/single_planet/earth\n/single_planet/mars\n/single_planet/neptune\n/single_planet/jupiter\n/single_planet/mercury\n```\n\nThe last part of that URL can vary with different planet_name's, and we can retrieve that information from the component view like this:\n\n```jsx\n\nimport { useParams } from \"react-router\";\n\nconst SinglePlanet = () => {\n    const { planet_name } = useParams();\n\n    return <p>You are displaying currently the planet {planetName}</p>\n}\n```\n\n## `2 hr` Project Time!\n\nReact the instructions for the starwars blog and strategize with the students:\n\n- How many views are needed?\n- What components you should create?\n- What are the actions that will be coded?\n- Today we don't care about the store or actions, lets focus on building the HTML views and the URL paths using react router."
                    },
                    {
                        "id": 21,
                        "label": "Work on SQL exercises",
                        "lessons": [
                            {
                                "slug": "what-is-sql-database",
                                "title": "Mastering Databases: What is SQL Database"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "url": "https://sqlbolt.com/",
                                "slug": "sql",
                                "title": "SQL Bolt Interactive"
                            }
                        ],
                        "homework": "Students must remember to read the next lesson before next class and should finish all their project and exercises.",
                        "position": 21,
                        "assignments": [],
                        "description": "Database engines are not related particular languages (like Python, PHP or Node) and they run on a different server than the website or application. For that reason and many others databases have their own language: SQL",
                        "key-concepts": [
                            "SQL table",
                            "Table relations: 1-1 1-N N-N",
                            "Metadata vs data",
                            "INSERT, UPDATE, DELETE",
                            "ALTER, DROP",
                            "Transactions",
                            "COMMIT, ROLLBACK, SAVEPOINT",
                            "CREATE"
                        ],
                        "technologies": [],
                        "teacher_instructions": "It is time to explain how SQL database work and how to write some SQL to interact with them, look at the full teacher instrutcions for more details",
                        "extended_instructions": "# First backend day! (Data-structures)\n\nThe front end is all about rendering and requesting for data.\nThe backend is all about databases/structures and responding the data.\n\nToday we are starting backend by going over all the previous exercises we have done and thinking about how the data was structured on those exercises.\n\n## Data structures\n\nDifferent Types of Data Structures (with examples):\n\n### Structuring with Primitive values\n\nThese are the most basic structures of data: Amost no structure, you cannot even have list of things.\n\n### Structuring with Arrays\n\nIs the first read structure we saw, its ideal to store lists of `anything`:\n\n```js\nlet todos = [];\n//add a task\ntodos.push(value);\n//remove a task\ntodos = task.filter(t => t != value);\n```\n\n### Object Literals\n\nThanks to object literals our tasks can now have status instead of just the task name.\n```js\nlet todos = [];\n//add a task\ntodos.push({\n    status: 'pending',\n    name: value\n});\n//remove a task\ntodos = task.filter(t => t.value != value);\n```\n\n### Classes (Object Orienetd)\n\nIts very formal, but thanks to classes now we can validate our task creation:\n\n```js\nclass TodoList{\n    constructor(){\n        this.tasks = [];\n    }\n    add(task){\n        if(valtaskue.status != 'pending' || task.status != 'done') throw new Error('The task status must be pending or done');\n        if(typeof task.name != 'string' || task.name == '') throw new Error('The task name must be a not empty string');\n        this.tasks.push(value);\n    }\n    remove(name){\n        this.tasks = this.tasks.filter(t => t.name != name);\n    }\n}\n\nlet todos = new TodoList();\n//now if you try adding a task with the wrong status if will give you an error\ntodos.add({\n    status: 'pending',\n    name: 'Make the bed'\n});\ntodos.remove('Make the bed');\n```\n\n## `5 min` Take 5 minutes to explain the difference beween data-structures and data-models\n\nYou can think about data-structures like he RAM Memory repersentation of data-models, for example:\n\n- Data structures are stuff like: Arrays, Queues (FIFO, FILO), Classes, etc.\n- Data models are ways of structuring the database.\n\nThe data-structure of your Reac.tjs projects will: The Store (RAM Memory).\nBut the data-model is only represented on the backend database.\n\n## `60min` Data Structuring Previous Projects\n\nStudents must discuss and finish recognizing the data structures use don previous projects.\n\n## `Rest of the class` Work on the SQL Exercises (the link is at the end of the lesson)."
                    },
                    {
                        "id": 22,
                        "label": "Building Starwars Data Model",
                        "lessons": [
                            {
                                "slug": "everything-you-need-to-start-using-sqlalchemy",
                                "title": "Everything you need to know about SQLAlchemy"
                            }
                        ],
                        "project": {
                            "title": "Data Modeling a StarWars Blog",
                            "instructions": "https://projects.breatheco.de/project/data-modeling-starwars"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 6413,
                        "homework": "Students must remember to read the next lesson before next class and finish their project.",
                        "position": 22,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-starwars-data-modeling",
                                "slug": "data-modeling-starwars",
                                "title": "Data Modeling a StarWars Blog"
                            },
                            {
                                "url": "https://github.com/breatheco-de/exercise-instagram-data-modeling",
                                "slug": "instagram-data-modeling",
                                "title": "Building Instagram.com Database Model"
                            }
                        ],
                        "description": "The backend its all about data, structures and databases. Let's review how to createt a database model.",
                        "key-concepts": [
                            "Why do we have to draw the database first?",
                            "It is hard to change the database in the middle of development",
                            "UML has become the standard for diagrams",
                            "SQL Alchemy is the most popular library for python database",
                            "Insstead of SQL we will use ORM's for 90% of our data needs",
                            "Databases have more data-types tha programming languages"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Take some time to go over how to model your data using Entity Relationship Diagram, use Intagram example with the entire class and then let the students do the Startwars Entity Relationship Diagram in groups of 2-3 students.",
                        "extended_instructions": "# Data Modeling whith UML\n\n## `5 min` Take 5 minutes to explain the difference between data-structures and data-models\n\nYou can think about data-structures like he RAM Memory repersentation of data-models, for example:\n\n- Data structures are stuff like: Arrays, Trees, Queues (FIFO, FILO), Classes, etc.\n- Data models are ways of structuring the database data.\n\nThe data-structure of your Reac.tjs projects will: The Store (RAM Memory).\nBut the data-model is only represented on the backend database.\n\n## `20 min` Today it is about: Data Modeling\n\n[This video](https://www.youtube.com/watch?v=UI6lqHOVHic&list=PLUoebdZqEHTxNC7hWPPwLsBmWI0KEhZOd) shows how to create a UML diagram, make students watch the video.\nExplain the basics of UML with a simple Car dealer example: Vehicle, Client, Purchase.\n\n- What are the possible data-types in a car dealer? Number, Boolean, String, etc.\n- What properties can a Vehicle, Client or Purchase have?\n- What are tthe relationships between the models (one-to-one, one-to-many, many-to-many)?\n    - How many Vehicles a Client can have?\n    - How many y Purchases a Client can do?\n    - How many Vehicles can a Purchase contain?\n\n## `2:30` Data-Modeling projects\n\nHelp students model the StarWars Blog using SQLAlchemy model diagram generator. Read the project instructions with them."
                    },
                    {
                        "id": 23,
                        "label": "Intro to Python",
                        "lessons": [
                            {
                                "slug": "backend-developer",
                                "title": "Knowing What is Behind a Back-End Developer"
                            },
                            {
                                "slug": "python-syntax",
                                "title": "Understanding Python Syntax"
                            },
                            {
                                "slug": "conditionals-in-programing-python",
                                "title": "Logical conditions in Python explained"
                            },
                            {
                                "slug": "what-is-a-python-list",
                                "title": "Working with Lists in Python"
                            },
                            {
                                "slug": "working-with-functions-python",
                                "title": "Working with Functions in Python"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "python-beginner-exercises",
                                "title": "Learn Python Interactively (beginner)"
                            },
                            {
                                "slug": "python-function-exercises",
                                "title": "Learn Python Functions Interactively"
                            },
                            {
                                "slug": "python-loops-lists-exercises",
                                "title": "Learn Python Loops and lists Interactively"
                            },
                            {
                                "slug": "master-python-exercises",
                                "title": "Master Python by practice (interactive)"
                            }
                        ],
                        "scrollY": 7004,
                        "homework": "Students must remember to read the next lesson before next class and they must finish the all replits and projects.",
                        "position": 23,
                        "assignments": [],
                        "description": "The backend side of the web is all about creating API's for data storing and processing; and integrating with 3rd party API's. The first step of that process is storing the information.",
                        "key-concepts": [
                            "Different types of Data Structures (with examples)",
                            "Object vs Array",
                            "calculated properties like age",
                            "lamda function"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Now that students finished the data-model for the StarWars blog its time they dive into python, start explaining the difference between back-end and front-end, all the things you could do with Python backends, then go over the syntax differences between python and javascript and what thi",
                        "extended_instructions": "# Introduction to Python\n\nStudents only know about JS and the Browser, today is important they understand:\n\n- That backend programs have access to the entire computer (not just the browser).\n- Backend programs don't need to bundle or use webpack.\n- Backend programs are compiled into C++ and Assembly.\n\n## Python Introduction\n\n- Show students how you can just create a file.py and run it using the command line `$ python file.py`\n- Compare javascript with python: `console.log` vs `print`\n- How variables work and what are de datatypes\n- Looping with python (for and foreach, loop, while loop)\n- Python dictionaries are like javascript objects but we call them dictionaries and they use `[` instead of `.` to access keys, for example:  `person['name']` instead of `person.name`.\n\n## Take the rest of the class for python exercises\n"
                    },
                    {
                        "id": 24,
                        "label": "Star Wars blog - Building endpoints",
                        "lessons": [
                            {
                                "slug": "building-apis-with-python-flask",
                                "title": "Building RESTful API's using Flask"
                            }
                        ],
                        "project": {
                            "title": "Todo List API with Python Flask Interactive",
                            "instructions": "https://projects.breatheco.de/project/python-flask-api-tutorial"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 7117,
                        "homework": "",
                        "position": 24,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/python-flask-api-tutorial",
                                "slug": "python-flask-api-tutorial",
                                "title": "Todo List API with Python Flask Interactive"
                            },
                            {
                                "url": "https://github.com/breatheco-de/exercise-starwars-blog-api",
                                "slug": "exercise-starwars-blog-api",
                                "title": "Build a StarWars REST API"
                            }
                        ],
                        "description": "The back-end side has almost no limitations, you have access to the entire computer, printers or anything you need. Your life as a back-end developer will start by doing API's because it is the most needed skill in the market. We really hope you like it as much as we do!",
                        "key-concepts": [
                            "Python has access to the entire machine",
                            "Python has packages just like NPM but it is calles Pipenv",
                            "The pipfile is like the package.json",
                            "Flask is the most popular Python Framework",
                            "workflow for creating and enpoint in Flask (same MVC pattern but now on the backend)",
                            "Flask easily works with SQLAlchemy (models.py)",
                            "what is serialization (jsonify)"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Explain API concepts and how to build an API using flask, follow with the students the interactive Flask tutorial and explain the sample API that comes with it (Todo List API), then ask the students to build the API for the Star Wars blog they already coded on the front-end.",
                        "extended_instructions": "## Building an API with Flask\n\n## `10min` Intro to backend API's\n\n- Go over HTTP, request vs response.\n- Open postman and review with students how to create requests with postman:\n     1. How to choose your method GET, PUT, POST, DELETE\n     2. How to set the URL\n    3. How to set the content-type JSON\n    4. where to look for the response\n- Postman will be our main way to test our API until we have a front-end.\n- The two most important API frameworks in Python are Django and Flask.\n- Flask is increasing in popularity because is meant for microservices and that it's very lightweight.\n\n### What is a server?\n\n- A server is just a script that waits for requests, it never ends.\n- When a server receives a request it maps the request with a function that we call the \"request handler\".\n- Basically building an API is mapping a bunch of endpoints with functions. One endpoint ==> One function\n\n```py\n@app.route('/')\ndef hello_world():\n    return 'Hello, World!'\n```\n\nExplain the rest of the process on building an API:  \nhttps://content.breatheco.de/en/lesson/building-apis-with-python-flask\n\n## `1hr` Follow the Interactive Flask API Tutorial\n\nHave the class work on following the API tutorial with Flask (todo list).\n\n## `1:30min` Start the StarWars with the class\n\n- The academy is providing documentation for the Flask Boilerplate here: [start.4geeksacademy.com](https://start.4geeksacademy.com)\n- Explain the backend boilerplate before starting the project\n- The models.py (based on the database diagram)\n- Where to add your endpoints\n- How to communicate between Python and your database using SQLAlchemy:\n   - How to query information.\n   - How to add, delete and update new records.\n- Build the first endpoint with the class\n- How to test your endpoints with postman\n\nThe class must continue working on the API until next day (homework)\n\n\n\n\n"
                    },
                    {
                        "id": 25,
                        "label": "Authentication JWT",
                        "lessons": [
                            {
                                "slug": "token-based-api-authentication",
                                "title": "Token Based Authentication in your API"
                            },
                            {
                                "slug": "what-is-JWT-and-how-to-implement-with-Flask",
                                "title": "Understanding JWT and how to implement a simple JWT with Flask"
                            }
                        ],
                        "project": {
                            "title": "Authentication sistem with Python Flask and React.js",
                            "instructions": "https://projects.breatheco.de/project/jwt-authentication-with-flask-react"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 7656,
                        "homework": "",
                        "position": 25,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/jwt-authentication-with-flask-react",
                                "slug": "jwt-authentication-with-flask-react",
                                "title": "Authentication sistem with Python Flask and React.js"
                            }
                        ],
                        "description": "Almost every application in the world has an authentication system, usually, you choose a username and password and those become your \"credentials\", you use them every time you want to identify yourself.\nTody we learn how to implement an authentication system using Tokens and JWT, one of the most modern standards for token based API Authentication.",
                        "key-concepts": [
                            "What is a Token",
                            "Token Based Authentication",
                            "What is a session",
                            "HTTP has no sessions",
                            "The Auth Token travels on the headers (usually)",
                            "API's have private and public endpoints",
                            "Every request to a private method must contain the Authorization Header",
                            "Types of Authentication (JWT, Bearer, Basic, etc.)",
                            "Benefits of JWT (no token storate)",
                            "How to use Postman",
                            "How to send authenticated request in postman",
                            "About the authorization header"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Explain how authentication works, what is a hash, and how HTTP has no persistent session and we need to generate tokens to simulate the concept of a session, show the documentation of the JWT Extended and help students implement it on their StarWars blog to save favorites on their user account.",
                        "extended_instructions": "## Authentication\n\n- Start with explaning how HTTP works: request vs response\n- We have done request anonymously during the entire course, its time to include authentication in our requests.\n- Every request must be \"signed\" to be able to execute.\n- There are many ways to sign requests, usually you do it by appending a unique number (hash/token) that only the authenticated user should know.\n- Usually authentication information travels on the header of the request.\n- If authentication is invalid the server must returns status code 401 (invalid auth) or 403 (missing auth info).\n- What is a token? A unique number that represents the \"session\".\n- How big is the token? Enough to be unique for everyone else.\n\n## Go over the lessons with the student\n\nTake some time to scroll through the lessons and review each of the concepts.\n\n## Use postman to demonstrate an authentication:\n\n  - Start with login (wrong and success credentials)\n  - Append the header token to the request.\n  - What is the response code we are getting?\n  - What happens if I add the wrong headers or token? What status code?\n\n## Documentation for JWT Extended\n\n- Show students the documentation for the [JWT Extended package](https://flask-jwt-extended.readthedocs.io/en/stable/basic_usage/).\n- Help students understand how to read a documentation.\n  - What to look first? The quickstart?\n  - How many weekly downloads the package has?\n  - How actively maintained it is?\n  - Are there a lot of pending issues?\n  - Has anyone else tried the package?\n- Write on the board the 4 steps to implement it: \n\n## Allow students to implement the login and protected routs on the API\n\nAsk students to follow the documentation steps on their own and ask for questions.\n\n## Front-end:\n\n- Implementing the fetch function to post `/token` and get a new token.\n- Storing the token on the localStorage\n- Appending the token to the fetch headers on every private request \n\n## The Startwars API should have authentication for next class\n"
                    },
                    {
                        "id": 26,
                        "label": " Front-Back Star Wars API integration",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 9649,
                        "homework": "",
                        "position": 26,
                        "assignments": [],
                        "description": "Let's finish all of our pending projects and exercises.",
                        "key-concepts": [
                            "Async/Await",
                            "Insomnia",
                            "Postman"
                        ],
                        "technologies": [],
                        "teacher_instructions": "The last day to finish the StarWars project.",
                        "extended_instructions": "Work with students on finishing pending projects."
                    },
                    {
                        "id": 27,
                        "label": "Family API",
                        "lessons": [],
                        "project": {
                            "title": "Family Static API with Flask",
                            "instructions": "https://projects.breatheco.de/project/family-static-api"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 8576,
                        "homework": "Students must finish python exercises and pending projects.",
                        "position": 27,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-family-static-api",
                                "slug": "family-static-api",
                                "title": "Family Static API with Flask",
                                "mandatory": true
                            }
                        ],
                        "description": "Lets keep working on the backend and get more familiar with Python's dictionaries, lists and the lamdba function",
                        "key-concepts": [
                            "Python has dictionaries instead of literal objects",
                            "Python has lambda instead of arrow functions",
                            "Python has lists and tuples instead of arrays",
                            "Explain how to map an array with lambda"
                        ],
                        "technologies": [
                            {
                                "slug": "queue",
                                "title": "queue"
                            },
                            {
                                "slug": "python",
                                "title": "python"
                            },
                            {
                                "slug": "pytest",
                                "title": "Pytest"
                            },
                            {
                                "slug": "flask",
                                "title": "flask"
                            }
                        ],
                        "teacher_instructions": "This lesson is about data-structures + API. We are trying to make students use a class/data-structure to build the API around it. Lets build another API but now using more complicated data-structures on the Backend",
                        "extended_instructions": "# Data-Structures and Family Tree\n\nToday's objective is to start introducing students with the concept of data-structures:\n\n- These are [the available python data-structures](https://github.com/breatheco-de/content/blob/master/src/assets/images/data-structures-python.png?raw=true).\n- Mainly divided in primitive and non-primitive.\n- We already know all primitives and some of the non-primitives.\n- Today we focus on the Tree.\n\n## About Tree's (data-structure)\n\n- Tree are not sequential data-structures like the arrays or lists.\n- Trees only have connections between its nodes (items) thru parent->chid links.\n- Trees are useful to represent things with hierarchies like the computer file structure, or organizational charts or families.\n\n## Work with the students on the project\n\nWe are doing another API to continue practicing Flask but without a database model, only ram memory.\nUse dictonaries and try representing a Tree structure (you cannot have all the family members in one array, you must use parent->child connectors.\n\n"
                    },
                    {
                        "id": 28,
                        "label": "Family tree",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must remember to read the next lesson before next class and finish all pending projects.\n",
                        "position": 28,
                        "assignments": [],
                        "description": "Continue working on the family tree...",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Help students finish pending backend projects and unstuck them.",
                        "extended_instructions": "# Continue working and finish all pending Projects\n\nTake some time to review the questions form the students and go over any concept you feel that needs reinforcement.\n\n\n\n## `5 last min` Warning about the final project\n\nThe next class students must come with a clear idea on what will be their final project about, they have to group in teams of 3 (prefered) or 2 people.\n- [Here are](https://projects.breatheco.de/d/full-stack-project-stories-and-wireframes#readme) the requirements on the final project.\n- Ask publicly what projects ideas they have and write them on the whiteboard, that will help other students to join the ideas.\n- If a student doesn't have a project maybe he can talk to other students and join them on their project.\n- As a teach, make sure the teams are good-enough to have something done by the end of the cohort.Hello *World*!"
                    },
                    {
                        "id": 29,
                        "label": "User Stories ",
                        "lessons": [
                            {
                                "slug": "user-stories-examples",
                                "title": "Creating User Stories: Learn with User Stories Examples"
                            },
                            {
                                "slug": "agile-development",
                                "title": "Intro to Professional and Agile Development"
                            }
                        ],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must finish the user stories by next class, remember that the student projects must meet certain conditions to be accepted.",
                        "position": 29,
                        "assignments": [],
                        "description": "Time to start the Final project! Lets review how software is built today, you'll learn and follow the same methods used by the top tech companies in the world",
                        "key-concepts": [
                            "What is a Kanban board and how does it work",
                            "How to use Github's kanban automated board",
                            "Adding an issue per user story",
                            "Writting stories from the user's point of view",
                            "Acceptance criteria",
                            "Your application scope: roles and capabilities",
                            "Standup meeting"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Time to start the Final project! Let's give the students a break and dive into User Stories and the SCRUM methodology. Students must pick their projects & partner, and start building the user stories using Github Project. Create a project with them.",
                        "extended_instructions": "# Time To Start the Final Project\n\nWe are going to use github for SCRUM project management, that way students get more green points on the activity graph and they get more familiar with github.\n\n## `10min` Creating user stories\n\nThis video is great about user stories: https://www.youtube.com/watch?v=LGeDZmrWwsw\nThis is the lesson: http://content.breatheco.de/lesson/user-stories-examples\n\n- Don't undermine stories: 70% of the projects fail because the requirements are not clear enough.\n- User stories have to be worded on the user point of view.\n- They need to have a clear **Acceptance Criteria**.\n- You application roles & capabilities, make sure the stories involve them: `as a students I would like to sort my lessons by difficulty`\n- SPRINT: Its a coding iteration (Every week maybe?) from start to finish: Write the stories -> Prioritize -> Code -> Test -> Deliver.\n- Velocity: How many points are being delivered per sprint.\n- SCRUM Meeting: Its when the team strategizes and plans a new sprint: decides what features are going to be included into the sprint.\n- Standup Meeting: Every day, the group gathers for 10 minutes and answers 2 questions:\n    1. Are you stuck?\n    2. What do you need from me?\n\n## `10min` Using Github for Agile: Issues and Projects\n\n- There are plenty of agile methodologies but we decided to use Kanban as it is one of the most popular ones.\n- Explain github issues and how you can create one issue for eavery feature/bug/problem/etc.\n- Github issues can connect to github projects automatically.\n- Create a github project with the students: What is a Kanban board and how does it work: 4 Columns (Backlog, Selected for Development, In Progress, Done).\n- How to use Github's kanban automated board: Issues will automatically opened and closed.\n\n## `20min` Students must pick their final project\n\n- Have a brainstorming on the project, here are some examples:\n    1. Doing an SMS based todo list application.\n    2. Doing a real-time polling platform like pollanywhere: https://www.polleverywhere.com/\n    3. Doing a Markdown editor to take notes and save them in the cloud.\n    4. Doing a detting platform where games can bet on anyone playing a video game.\n    5. Online store.\n- Once you ahve teams and ideas ready the teams must gather up and one of each team must create their repository.\n- Each team must start adding github issues with their user stories.\n\n## `2:20min` Build project stories\n\nStudents must work in group with their teams to finish the first batch of user stories and wireframes and publish them into github.\n\n"
                    },
                    {
                        "id": 30,
                        "label": "UI/UX and MOCKUPS",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Sit with every project team and discuss how to split the code into Views vs Components, students must finish their project home layout by next class.",
                        "position": 30,
                        "assignments": [],
                        "description": "Today you will be coding your final project HTML Views and making them React Views",
                        "key-concepts": [
                            "Reinforce the Minimum Viable Product concept",
                            "Students should not get excited about npm packages, use only a handfull",
                            "Using React-Strap is a great idea to save some time"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Continue working on the final project but now start building the React Views, use the FLUX boilerplate with the students and start organizing eveyrthing from Layout.jsx",
                        "extended_instructions": "# Help Students Start coding their React Views\n\nToday we should start coding the final project, but first:\n\n## `20min` Final Review to Project Requirements\n\n- Students have a clear idea on what they will be developing: User stories and Wireframes almost done.\n- Make sure they have a small project, its hard to finish a project with more than 3-4 views.\n- Make sure also that their database is small (3-5 tables at the most) or it will be imposible to finish.\n- Sit down with each group and give your feedback.\n\n## `20min` Help students setup the project code\n\n- Start the boilerplate with them.\n- Make sure they understand the Layour.js and are able to add their routes.\n- Make sure they know how to add styles.\n- Make sure they have properly planned their components and views and are ready to start coding the wireframe si very good for that).\n\n## `2:20min` Students start coding their views\n\nLets students start coding, help with one-on-one mentorships.\n\n\n\n"
                    },
                    {
                        "id": 31,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must deliver the first views of their projects.",
                        "position": 31,
                        "assignments": [],
                        "description": "Keep working on your final project final HTML/CSS and React Views. Link them together as a prototype and be ready to start the backend side of the web.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Work with students to complete the HTML/CSS, React Views and Components. Make sure they are on their way to complete a 'Prototype' that is close to the front-end side of their projects.",
                        "extended_instructions": "# Coach students on their development\n\nIt is the first time students code a big project, they are probably making lots of mistakes, they have probably ugly designs or maybe they don;t event know what they are doing.\n\n## Sit with each team separately and help them with the following:\n\n#### Were to look for mistakes\n\n- The overcomplicate things.\n- They spend too much time on non-important stuff.\n- They use libraries that don't work.\n- They want to add so many features to their projects that they forget its going to be impossible to finish.\n\n#### Were to look for bad UX/UI designs:\n\n- Use a maximum of 3 colors on your projects.\n- Use bootstrap components all the way: Reactstrap or Materialize is a great recomendation.\n- Someone form the team should focus on little details a lot, like a full time job.\n\n### Make sure they are following SCRUM\n\n- Are they using github project?\n- Are they moving the ard in the Kanban board?"
                    },
                    {
                        "id": 32,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students (in groups) must create a 4 page website (Home, Blog, Product, Checkout-Cart) using React Router.",
                        "position": 32,
                        "assignments": [],
                        "description": "Please work hard with your team on completing your front-end views, this will be the last font-end only day and we will start building your Project API next class.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Help students to finish their prototype, make sure it follows best practices and unstuck them on any problems they may encounter.",
                        "extended_instructions": "# Repeat last class coaching session again with every student\n\nIt is the first time students code a big project, they are probably making lots of mistakes, they have probably ugly designs or maybe they don;t event know what they are doing.\n\n## Sit with each team separately and help them with the following:\n\n#### Were to look for mistakes\n\n- The overcomplicate things.\n- They spend too much time on non-important stuff.\n- They use libraries that don't work.\n- They want to add so many features to their projects that they forget its going to be impossible to finish.\n\n#### Were to look for bad UX/UI designs:\n\n- Use a maximum of 3 colors on your projects.\n- Use bootstrap components all the way: Reactstrap or Materialize is a great recomendation.\n- Someone form the team should focus on little details a lot, like a full time job.\n\n### Make sure they are following SCRUM\n\n- Are they using github project?\n- Are they moving the ard in the Kanban board?"
                    },
                    {
                        "id": 33,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 33,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "",
                        "extended_instructions": "# Repeat last class coaching session again with every student\n\nIt is the first time students code a big project, they are probably making lots of mistakes, they have probably ugly designs or maybe they don;t event know what they are doing.\n\n## Sit with each team separately and help them with the following:\n\n#### Were to look for mistakes\n\n- The overcomplicate things.\n- They spend too much time on non-important stuff.\n- They use libraries that don't work.\n- They want to add so many features to their projects that they forget its going to be impossible to finish.\n\n#### Were to look for bad UX/UI designs:\n\n- Use a maximum of 3 colors on your projects.\n- Use bootstrap components all the way: Reactstrap or Materialize is a great recomendation.\n- Someone form the team should focus on little details a lot, like a full time job.\n\n### Make sure they are following SCRUM\n\n- Are they using github project?\n- Are they moving the ard in the Kanban board?"
                    },
                    {
                        "id": 34,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 34,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 35,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 35,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 36,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 36,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 37,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 37,
                        "assignments": [],
                        "description": "You have built 2 different API's using python already, it is time to start working on your own. Start by building your UML diagram and setting up the repository.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Time to start working on your final project backend"
                    },
                    {
                        "id": 38,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 38,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 39,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 39,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 40,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 40,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 41,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 41,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 42,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 42,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 43,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 43,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 44,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 44,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 45,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 45,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 46,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 46,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 47,
                        "label": "Final presentation rehersal",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 47,
                        "assignments": [],
                        "description": "A great way of rehearsing is by presenting the final project to your classmates",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Create a 'rehersal day' and let the students present the project to their classmates."
                    },
                    {
                        "id": 48,
                        "label": "Pitch day",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 48,
                        "assignments": [],
                        "description": "You have worked a lot during these weeks, it's time to present the final project and enjoy with your family and friends!",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Answer any question students may have,"
                    }
                ],
                "slug": "full-stack",
                "label": "Full Stack PT",
                "profile": "full-stack",
                "version": "4",
                "description": "",
                "academy_author": "4"
            },
            "version": 4,
            "updated_at": "2021-09-14T23:33:08.688356Z",
            "created_at": "2021-09-14T23:33:08.688336Z",
            "slug": "full-stack",
            "name": "Full-Stack Software Developer",
            "syllabus": 41,
            "duration_in_hours": 320,
            "duration_in_days": 48,
            "week_hours": 9,
            "github_url": null,
            "logo": "https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack",
            "private": false
        },
        {
            "json": {
                "days": [
                    {
                        "id": 1,
                        "label": "HTML/CSS/Bootstrap",
                        "lessons": [
                            {
                                "slug": "intro-to-4geeks",
                                "title": "Introduction to 4Geeks Academy"
                            },
                            {
                                "slug": "what-is-html-learn-html",
                                "title": "What is HTML? It's time to learn HTML and its structure"
                            },
                            {
                                "slug": "what-is-css-learn-css",
                                "title": "Learn CSS: What is CSS Meant for?"
                            },
                            {
                                "slug": "css-layouts",
                                "title": "CSS Layouts: Create and Build Layouts with CSS"
                            },
                            {
                                "slug": "mastering-css-selectors",
                                "title": "Mastering CSS Selectors"
                            },
                            {
                                "slug": "bootstrap-tutorial-of-bootstrap-4",
                                "title": "Bootstrap Tutorial: Learn Bootstrap 4 in 10 minutes"
                            }
                        ],
                        "project": {
                            "title": "Build a Digital Postcard with HTML/CSS",
                            "instructions": "https://projects.breatheco.de/project/postcard"
                        },
                        "quizzes": [
                            {
                                "url": "https://assets.breatheco.de/apps/quiz/bootstrap",
                                "slug": "bootstrap",
                                "title": "Bootstrap"
                            }
                        ],
                        "replits": [
                            {
                                "slug": "css-exercises",
                                "title": "Learn CSS Interactively"
                            },
                            {
                                "slug": "forms-exercises",
                                "title": "Learn HTML Forms"
                            },
                            {
                                "slug": "bootstrap-exercises",
                                "title": "Learn Bootstrap Tutorial"
                            }
                        ],
                        "homework": "Students must finish their project and must remember to read the next lesson before next class.",
                        "position": 1,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-postcard",
                                "slug": "postcard",
                                "title": "Build a Digital Postcard with HTML/CSS"
                            },
                            {
                                "url": "https://github.com/breatheco-de/exercise-instagram-post",
                                "slug": "instagram-post",
                                "title": "Instagram Post"
                            },
                            {
                                "url": "https://github.com/breatheco-de/exercise-instagram-feed",
                                "slug": "instagram-feed",
                                "title": "Simple Instagram Photo Feed with HTML/CSS"
                            },
                            {
                                "url": "https://github.com/breatheco-de/exercise-instagram-feed-bootstrap",
                                "slug": "instagram-feed-bootstrap",
                                "title": "Instagram Photo Feed with Bootstrap"
                            }
                        ],
                        "description": "During the pre-work you learn some basic CSS and HTML, and hopefully how to use the flex-box to create simple layouts. The first day we will review the pre-work completion and introduce a more  evolved CSS that enables amazing layouts and the amazing Bootstrap framework that will make you life so much easier with the \"component oriented\" approach.",
                        "key-concepts": [
                            "Everything is text",
                            "Always be closing",
                            "Client vs Server",
                            "HTTP request vs response",
                            "HTML vs CSS",
                            "DRY Technique",
                            "Flex Box",
                            "Bootstrap",
                            "Component",
                            "Workflow: Identify Component, Copy&Paste, the customize it",
                            "Helper/utility Clasees that come with Bootstrap"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Students know already basic CSS and HTML, just go over the concepts really fast but stop and explain carefully the Display and Position rules, specifically talk about the FlexBox as the main tool to build layouts. Then, explain Bootstrap and how it solves 99% of the pain: everything is a component from now on\"",
                        "extended_instructions": "# The Internet, HTML, CSS and Bootstrap\n\n## `20 min` Small presentation about the bootcamp, [click here to open it](https://docs.google.com/presentation/d/1--0xX43xyfngGTWVQEgmcbLuE7QCCz-jovL2JBOEPY0/edit#slide=id.g555ffcabca_1_0).\n\n## `15 min` Play a game to get to know each other.\n\n- Everyone writes in an anonimus piece of paper with something about themselves. E.g: \"I like dogs\" or \"I work on sales\", etc.\n- Put all papers inside a cup and start the game.\n- Choose one student to start introducing himself:\n    - First name and last.\n    - What would you like to be called?\n    - What do you do now? (for work)\n    - What do you plan on doing when you become a developer?\n- Then, that student must pick one random paper from the cup and guess how is the person that wrote it.\n- After guessing, the person who wrote it must come next and introduce himself and pick another paper... etc.\n\n## `5 min` Present the team\n\nEveryone introduces himself: Chief of Admissions, Chief of Career Support, Chief of Education, Main instructor, and teacher assistant.\n\n## `15 min` Install the tools\n\nStart with Gitpod, invite all students, and make sure they are able to create workspaces and what the academy boilerplates are. \n\n## `10 min` Go over prework concepts really fast\n\nCheck if the students completed the prework, if ~70% of the students finished the prework you can continue with the rest of the class, otherwise you will have to postpone today's topics and today's focus only con starting/completing the prework projects and concepts with the students.\n\n\n## If 70% of the students completed the prework you can continue with the rest of the day:\n\n### How does the internet works?\n\n1. The world is divided between servers and clients.\n2. We call \"clients\" the computers with browsers or mobile apps.\n3. We call servers where the centralized database is.\n\n### HTTP Request vs Response**\n\n- The rules used for this client-sever communication is called HTTP, which stands for Hyper Text Transfer Protocol.\n- The way that you get the website is by sending a \"Request\" to the server. This tells the server what website or resource you are looking to view/use. The server then responds with the information.\n- The server then sends a response, which tells will confirm the receipt of the request and let your computer know that it will begin sending data.\n- This back and forth process will continue with more Request=>Response pairs until you have finished loading your remote resource.\n\n### Everything is text!\n\n- With HTTP, it’s important to focus on the first T in the acronym, which stands for `Text`. In this protocol, everything is sent back and forth as TEXT.\n- While there are other protocols out there, for now, we want to remember that with HTTP – Everything is TEXT.\n- Make students open a picture with Notepad/TextEdit they will see the text that represents the image.\n\n### Browser Interpretation\n\n- After your browser uses the HTTP protocol and receives the data as text, it then has the job of interpreting that text and converting it to the correct visual format.\n\n#### HTML\n\n- The first TEXT-based format we will see is HTML.\n- HTML its all about `<tags>` you open and close tags to give them basic format.\n- There are a lot of HTML tags but you only have to know a few and you can always google them.\n    - Explain the basic tags like `<p>`,`<div>`,`<a>`,`<span>`, headings (`<h1>`,`<h2>`,etc).\n\n[[demo]]\n| :point_up: The most important thing to remember in HTML is to ALWAYS BE CLOSING!\n\n#### Always Be Closing and Indentation Matters**\n\n- Everything is going to be done in blocks of code.\n- First you open the block, then you close the block.\n\n### CSS vs HTML\n```css\n#id_selector { property: value; }\n.class_selector { property: value; }\ntag_selector { property: value; }\n```\n\n## `20 min` Start the new content: Advanced CSS\n\n### Specificity\n\n- Do not use ID as CSS selectors (use specificity).\n- The class selector is the most used because it can be reused all over your website.\n- Show this [video that explains](https://www.youtube.com/watch?v=In78mSOHmls) specificity to the class.\n- Combine selectors to get more specific about which element you are styling\n- Ask if anyone remembers what we said DRY Programming means? Don’t repeat yourself.\nYou may think it’s funny that they call the opposite of DRY -  WET programming, which they have given the following titles to:  \"write everything twice\", \"we enjoy typing\" or \"waste everyone's time\"**\n\n\n### Box Model\n\n- Box layout means that most elements can be thought of as boxes: with margin, padding, with and height.\n- There are 4 main parts to the typical box model: (draw the following on the board or show picture from breathcode)\n    - Content: this is what is inside the box\n    - Padding: this is spacing between the border and content (inside box also)\n    - Border: this is the edge of the box\n    - Margin: this is spacing between the outside of the box and the next element over in any direction. (which could be the edge of the page, another div, a paragraph, or even an image)\n- You can also have a background color or image, this will show in the content area of your box.\n\n#### The Display Property:\n\n- Compare `display:block` vs `display:inline`: Display block its what makes an element behave like a box, inline elements have no margins.\n- Compare `display:block` vs `display:inline-block`.\n- Display: flex; its the main tool for building complex layouts because it easily allows having several divs on the same line (columns).\n- I recommend going over the CSS and HTML [cheat sheets that we have available on the breathco.de platform under Assets](https://breatheco.de/assets/).\n \n## Display Flex and how important it is.\n\nTake some time to explain display:flex and how it is used on today's project.\n\n#### The Position Property:\n\n- Position:fixed follows the user, it is mainly used for anoying modals or popups.\n- If one element has position:relative must always be companioned by one or more childs with position:absolute. Its broadly used for relating two elements to each other (one follows the other)\n- Compare `display:block` vs `display:inline-block`.\n\n## `2:30 hr` Start the project!\n\nRead the instructions out loud with the class, make sure they understand.\n\nStudents must start discussing on the whiteboard a strategy about the project.\n- From top to bottom identify the tags you will be using.\n- When to use `display:inline-block` and/or `position:absolute` or `position:relative`.\n- Setup the project with one `index.html` and one `styles.css`\n\n## `20 min` Bootstrap\n\n### What is bootstrap?\n\nJust a predefined stylesheet inveted by [a guy at twitter (Mark Otto)](https://twitter.com/mdo?lang=en).\n\n### Why?\n\n- Because doing styles is repetitive, it was about time someone did a boilerplate.\n- Its component oriented.\n- It makes websites easier and faster to build.\n\n### Bootstrap versions & download\n\nBootstrap has many versions, always check if you are using the last version of Bootstrap on your project, here you can find all the available versions: [https://getbootstrap.com/docs/versions/](https://getbootstrap.com/docs/versions/)\n\nWe recomend using a CDN to import bootstrap in your HTML like this one: [https://www.bootstrapcdn.com/](https://www.bootstrapcdn.com/)\n\n### The Most Important (Used) Components\n\n1. Navbar\n2. Card\n3. Modal: https://getbootstrap.com/docs/4.0/components/modal/#live-demo\n\n### The Basic Workflow (asuming you have a wireframe or design)\n\n1. Build your basic layout with the Grid (container, row and collumns)\n1. Identify the components you will need (use piece of paper)\n2. Copy & Paste the component code into your website.\n3. Customize the component for your specific design.\n4. Adjust anything else overriding with css styles on your own sylesheet.\n5. Remember the utility classes to avoid doing to much custom CSS.\n\n### Helper/Utility Classes that come with bootstrap*\n\nThese are classes you can attach that do things such as control margin or padding, control borders, or even float elements.\nFor example, if you wanted no margin on the left of the element, you can add the class ml-0 to the element and it will set the left margin to zero.\n\n### Layout using Grid system\n\n- Explain 12 column layout and how it works\n- every line is a Row\n- this row holds columns as immediate childs\n- every Row on a page has 12 columns\n- columns are equally measured in percentages so they are responsive.\n- the basic sizes are: col, col-xs, col-sm, col-md, col-lg, col-xl\n\n### Bootstrap does not have fonts or icons\n\nWe use google fonts and font awesome for that.\n\n## `2:30min` Have class work on bootstrap instagram.\n\n- Students gather in pairs tos strategize first (best practice)\n- Read instructions out loud and have them build a strategy\n- Have them identify the components.\n\nDo not talk more, they will not be able to process it because they are overwhelmed, just help them code.\n\nAnswer questions individually with your teacher assistants.\n"
                    },
                    {
                        "id": 2,
                        "label": "Command Line Challenge",
                        "lessons": [
                            {
                                "slug": "the-command-line-the-terminal",
                                "title": "The Command Line (a.k.a: The Terminal) "
                            }
                        ],
                        "project": {
                            "title": "Command Line Challenge",
                            "instructions": "https://projects.breatheco.de/project/exercise-terminal-challenge"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "url": "https://cmdchallenge.com/",
                                "slug": "command-line-exercises",
                                "title": "Command line exercises"
                            }
                        ],
                        "homework": "Students must remember to read the next lesson before next class.",
                        "position": 2,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-terminal-challenge",
                                "slug": "exercise-terminal-challenge",
                                "title": "Command Line Challenge"
                            }
                        ],
                        "description": "A text editor and the console - that's all you need to be a great coder. Time to master the second one.",
                        "key-concepts": [
                            "Most used CMD commands",
                            "File Directory Hierarchy",
                            "Relative vs Absolute Paths",
                            "Moving up...",
                            "Autocomplete with TAB",
                            "GIT in general"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Teach the command line to your students, use the CMD challenge to make it very fun! Start with a small explanation about the importance of the CMD and then explain each command after its respective challenge is completed\n",
                        "extended_instructions": "# Command Line Interface\n\n Check if students were able to finish the Bootstrap Instagram\n\n ## `10 min` Small theory about the command line (do not explain the commands)\n\n```md\n⚠ ️IMPORTANT:\nPlease don't explain every command, it is better if during the challenge the students find the commands in google or in the breathecode lesson.\n\nStudents can do searches like: \"How to get into a computer directory\", etc.\nForce them to start searching in google!!\n```\n\n- Computers can be entirely managed without a windows interface, you can do everything from the command line.\n- Make sure to make students understand how important the command line (developers use it every day all the time and it is impossible to avoid).\n- Relative path vs absolute path.\n- Explain that we are in Gitpod, which uses ubuntu and we have to familiarize we the ubuntu command line.\n- Talk about the file hierarchy and how is represented in the command line, what the dot  .  and double dot  ..  represents. Draw on the board a file hierarchy and show if at the same time how the command line shows it (compare both).\n- Explain the use of the autocomplete command: [using tab one time for autocomplete or two times to show options](https://www.howtogeek.com/195207/use-tab-completion-to-type-commands-faster-on-any-operating-system/).\n- This is a [very good series of videos](https://www.youtube.com/watch?v=AO0jzD1hpXc&t=267s&index=8&list=PL8A83A276F0D85E70) explaining the command line that students can **watch later.**\n- Share this [cheat sheet with the most used commands.](https://ucarecdn.com/61c6474b-5760-43db-9a2c-dfbea2ccdd76/Comandlinecheatsheet.pdf)\n\n## `1:20 hr` Start The CMD Challenge\n\n- Have students create a project in Gitpod\n- Help them to clone the repo for the project (paste it in the slack channel so they can use the link)**\n    1. git init\n    2. git clone\n- Run the react presentation\n\n```md\n📝 The command line will make students practice the most important commands, explain each command after the each challenge is completed, the student that successfully completed it can explain to other students.\n```\n\n## `1:30min` Take some time the class explaining git in a general way\n\nGit will be the first applicacion we will be using inside the command line, students must read about it and wat videos about it.\n\n### What is git?\n\nGit is an online, central code storage that allows developers to manage a code base in teams.\n\nSome of the things you can do with git include:\n\n1. You can collaborate on projects easily\n2. see a history of revisions\n3. Roll back to previous versions if a revision fails (version control)\n4. Resolve code conflicts so that 2 developers don’t overwrite each other’s code.\n\nGit is a necessity to any developer working today as it’s resolved many of the issues of working on a team or keeping version history on a project.\n\n## For Next Class\n\nNext class we will review GIT in more detail. If you haven’t already, please read the lesson on GIT in the breatheco.de platform.**Hello *World*!"
                    },
                    {
                        "id": 3,
                        "label": "Github",
                        "lessons": [
                            {
                                "slug": "learn-in-public",
                                "title": "Learn in Public"
                            },
                            {
                                "slug": "how-to-use-git-version-control-system",
                                "title": "How to use GIT: Version Control System"
                            }
                        ],
                        "project": {
                            "title": "Fix the Misspell Challenge",
                            "instructions": "https://projects.breatheco.de/project/fix-the-misspell"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "url": "https://4geeksacademy.github.io/git-interactive-tutorial/",
                                "slug": "git-interactive",
                                "title": "Interactive Github Tutorial"
                            }
                        ],
                        "homework": "Stundents should finish their project and remember to read the next lesson before next class.",
                        "position": 3,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/the-misspell-chalenge",
                                "slug": "fix-the-misspell",
                                "title": "Fix the Misspell Challenge"
                            },
                            {
                                "url": "https://github.com/4GeeksAcademy/learn-in-public",
                                "slug": "learn-in-public",
                                "title": "Learn in Public"
                            }
                        ],
                        "description": "The CMD Line has millions of tools, it's time to learn the first ones: GIT & Github - together they make collaboration amazing!",
                        "key-concepts": [
                            "Do not explain Git with SSH credentials  in detail, students must use HTTP",
                            "Why using Github?",
                            "It will be impossible to avoid using Github",
                            "Github vs Git",
                            "How to commit directly on github",
                            "How to find great repostories",
                            "Example of a great github profile",
                            "Github as a portfolio"
                        ],
                        "technologies": [
                            {
                                "slug": "github",
                                "title": "github"
                            }
                        ],
                        "teacher_instructions": "Start explaining Github as a social network, how it stores 90% of the world's codebase, how you can review all major coding projects, follow the most influential developers, and the role of open source.\n\nThen explain GIT without being very technical, the \"Github for poets\" video does a great explanation, we will get more technical the next class that we will collaborate on building a landing page.",
                        "extended_instructions": "# Welcome to Github\n\n**Welcome everyone, Check if they were able to finish all the lessons, exercises, and projects up till now.**\n\n### Explaining Github\n\n1. As we mentioned in previous classes, Github & Git have become a staple of every development workflow.\n\n2. You will use this in EVERY development job you have from here forward.\n\n3. Show the main profile screen and explain parts\n\n    - Use [https://github.com/gaearon](https://github.com/gaearon) as example.\n    - Explain about the github activity graph, how github tracks your entire activity and other developers and recruiters can see it\n\n\n4. Explain how to create a repository\n\n    - click repository tab > new repo button > fill out data\n\n5. Show what a repository looks like\n\n   - explain the contents of the repository and the importance of the Readme file in a project.\n   - Show popular repositories like react, vue, flask, etc. Show them the README files.\n   - show [the git collaboration readme](https://github.com/breatheco-de/exercise-collaborative-html-website) as an example \n\n## The role of open-source\n\n- Explain about open source, how the most important projects in the coding world are open source like: Chrome, Windows, React, Pyhton, Flask, Django, etc.\n\n- In the open source world anyone can pull request anything, there are maintainers that review and approve changes.\n- 4Geeks Academy syllabus is open source and you can Pull Request (lessons and projects)\n\n\n## `1 hr` Project: Fixing Misspells as the perfect Open Source Ice-Breaker\n\nShow students how every lesson on breathecode has the github logo on the top, and you can contrute or fix any lesson by clicking on the github logo and then editing the lesson file on github.\n    \nCreate repositories for all previous workspaces and upload all your code to their corresponding repo’s. Then submit the assignments on your student.breatheco.de  **(DUE MONDAY). Also, work on all repl’its and get caught up. Be ready for the next class which is on Wireframing and design process.**\n\n## `1hr` The student External Profile\n\nEncourage students to do their first pull request with the student external profile: [sep.4geeksacademy.co](https://sep.4geeksacademy.co)"
                    },
                    {
                        "id": 4,
                        "label": "Git & Gitflow",
                        "lessons": [],
                        "project": {
                            "title": "Building a website collaborative",
                            "instructions": "https://projects.breatheco.de/project/collaborative-html-website"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must remember to read the next lesson before next class and finish all their projects, next class they start with Javascript!",
                        "position": 4,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-collaborative-html-website",
                                "slug": "collaborative-html-website",
                                "title": "Building a website collaborative"
                            }
                        ],
                        "description": "Now you know Github & GIT and together they make collaboration amazing! ",
                        "key-concepts": [
                            "Coders collaborate with each other",
                            "team work ",
                            "In real jobs, you work in tems",
                            "Pull request",
                            "branches",
                            "Merge",
                            "The commit object",
                            "Push vs Pull",
                            "Why Pull Request instead of Push directly",
                            "All major companies use Pull Request"
                        ],
                        "technologies": [
                            {
                                "slug": "git",
                                "title": "Git"
                            }
                        ],
                        "teacher_instructions": "Time to explain and practice with GIT in detail, create a repository for your Landing Page GIT project and make them clone it and upload their piece of the project. Review the key concepts. Do a live demonstration on how to use Github, branches, resolve conflicts. Introduce students on how to contribute on Github by fixing misspells.",
                        "extended_instructions": "# First time using Git\n\nLast class you have introduced GitHub, students must have finish reading and watching videos and building their public profile with YML.\n\n### About the GIT authentication:\n\nThe academy does not want to explain much about GIT SSH Authentication because it can be a cumbersome concept for now, we strongly recomend always using HTTP during the course and let students learn about SSH later.\n\n### The Commit Object\n\nHere is the lesson that talks about that: [https://content.breatheco.de/lesson/how-to-use-git-version-control-system#commit-objects](https://content.breatheco.de/lesson/how-to-use-git-version-control-system#commit-objects) \n\nBasically, a commit is a snapshot (picture) of what your project looked at during the moment of your commit. \n\nCommits represent a change in the current code, so if you don’t have any changes, you will receive a message saying there is nothing to commit.\n\nThere are four main parts in a commit:\n\n1. Set of files which make up your snapshot at that time\n2. Instructions pointing to the Parent commit objects\n3. An SH1 (hash) name that serves as a unique identifier for that specific commit.\n4. Commits also typically have comments, which should explain what was changed or addressed in the current commit\n\n### The HEAD\n\nThe heads of the repository are like the \"revision history of the project.\"  \n\nA revision history is a list of commit objects that altogether contain all the changes that you and your other team members have made to the project files.\n\nEvery time you make a new commit, the head will move to that new commit.  (This way you are able to have access to the entire project history of commits.)\n\nIt is possible to move the head to a different commit, however, you must remember that commits made after the commit to which the head is pointing at are not possible to be reviewed.\n\n### The Stage\n\nWhen creating a commit, you select which files you wish to add to the commit. This is called \"staging\" your commit. (basically, preparing your formal commit object)\n\nTypically, you will use \"git add .\" which adds all files to your stage for the current commit, then follow it with your commit.\n\n### Branch\n\nA branch allows you to work on a specific feature of code without compromising the main code in a repository.  [http://content.breatheco.de/lesson/how-to-use-git-version-control-system#a-head-object-is-a-list-of-commits](http://content.breatheco.de/lesson/how-to-use-git-version-control-system#a-head-object-is-a-list-of-commits) \n\nThat means that each branch is a separate revision history.\n\nThe main branch of code in the repository is called \"Master\" typically\n\nYou can have as many different branches as you want in a repository/project.\n\nEach branch has it’s own head which resides on the last commit of that branch. So if you have two branches, \"Master\" and “login”, each will have their own head on the last commit.\n\nWhen you are satisfied with the feature you developed, you can merge it back in to master and it will bring all code changes, along with replace the head on master with the new head.\n\n### Typical Flow\n\n1. All new projects have to be initialized with git.  (git init)\n    - This creates a git folder with all elements that define the git project.\n    - At this point, it’s also good to set the remote for your project. This will tell the project what the address is for your repository so that you can push changes later.\n\n 2. the command for this is:  git remote add origin https://github.com/user/repo.git \n\n 3. where the address at the end is your repository address or SSH address.\n\n26. Whenever you have to stage your changes, you use \"git add\". As mentioned before, to add all file changes, “git add .” \n\n > Note: conversely, you can condense this into the git commit by adding a flag \"-a\" which means add all files to the commit stage\n\n4. Once you made changes to your code and you are ready to commit: You create a commit object by using \"git commit -m ‘commit message’\" or if you have not used git add, you can use the -a flag as mentioned before.\n\n5. At this point, you want to use ‘git push’ to upload your changes\n\n6. If you need to create a new branch:\n\n    - git checkout -b [branch name]\n\n    - next you need to switch to that branch to work on it\n\n        3. git checkout [branch name]\n\n    - when you complete your changes on a new branch, you merge the changes back in using the following:\n\n        4. git merge [other branch name]\n\n\n## Commit vs PUSH\n\nWe already discussed that a commit will allow you to create a new commit object. This is a local bundle you are preparing to upload.\n\nWhen you finish your commit, you have to attempt to upload that code to the repository.\n\nThis is where git push comes in. It allows you to attempt to upload your changes to the repository.\n\nIf there are any issues where a conflict has arisen, you will have to resolve the conflicts before pushing your changes.\n\n## Resolving Conflicts\n\nFor conflicts, git will notify you that there are issues.\n\n- this typically occurs when two people are trying to modify the same file(s).\n\nTo proceed you need to:\n\n- Get the new changes downloaded to your computer with ‘git pull’ or if you are on a branch, ‘git pull origin branch-name’\n\n- Then you will be asked to merge the changes \n\n- Here you will have to edit the files with conflicts and resolve any changes. \n\n- Once you have resolved the conflicts, you can attempt to push changes again.\n\n## Start Coding With The Students!\n\n** At this point we will start the assignment for the git collaborative portfolio project.**\n\n** Break the class into groups and assign a section of the portfolio project**\n\n** [https://github.com/breatheco-de/exercise-collaborative-html-website/blob/master/website1/designs/guide.jpg]**(https://github.com/breatheco-de/exercise-collaborative-html-website/blob/master/website1/designs/guide.jpg)\n\n* Use peer programming to complete the section quickly, then upload the changes to the repository your professor has provided.\n\nTeacher will clone the repo in a new class repository and will handle updating the name of the template parts so that the site functions properly.\n\n### Students Homework: \n\nFinish all pending projects including todays."
                    },
                    {
                        "id": 5,
                        "label": "Excuse Generator",
                        "lessons": [
                            {
                                "slug": "what-is-javascript-learn-to-code-in-javascript",
                                "title": "What is JavaScript? Learn to Code in JavaScript"
                            },
                            {
                                "slug": "conditionals-in-programing-coding",
                                "title": "Conditionals in Programming or Coding"
                            },
                            {
                                "slug": "working-with-functions",
                                "title": "Working with Functions"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "javascript-beginner-exercises",
                                "title": "Javascript Beginner Tutorial (interactive)"
                            }
                        ],
                        "homework": "Remember to read the next lesson before next class. Students should finish their project.",
                        "position": 5,
                        "assignments": [],
                        "description": "HTML & CSS are great, but the world needed interactive pages (not just beautiful text documents). JavaScript comes to help us generate HTML & CSS based commands after the initial text document has already loaded.  JavaScript will also re-write the website live, based on the user's activity.\",",
                        "key-concepts": [
                            "Data-types in Javasrcipt",
                            "what is a variable",
                            "arrays",
                            "You can skip lines with conditionals",
                            "do not explain looping yet",
                            "Null vs Undefined",
                            "Generate random numbers",
                            "The code is a procedure from top to bottom (for now)"
                        ],
                        "technologies": [
                            {
                                "slug": "js",
                                "title": "Javascript"
                            }
                        ],
                        "teacher_instructions": "Explain the basic coding concepts (variables, data-types, functions, loops, arrays, etc.), then start the excuse generator is a great way to explain how JavaScript and HTML/CSS can play together. Use the VanillaJS boilerplate, that way students will start getting used to it",
                        "extended_instructions": "# Javascript Variables, DataTypes and Arrays\n\nStart anwering any questions students may have.\n\n## `20min` Javascript Intro:\n\n**Warning**: Please do not explain the DOM or Events, also, don't explain loops or functions yet. Students will be overwhelmed.\n\n### Why Javascript?\n\nStatic websites are just blog posts, but was about interactive applications like Instagram, Facebook, etc.?\n\nJavascript lets us create dynamic HTML and CSS based on user or system interactions, for example:\n- Adding an `li` to a `ul` when the user clicks on a button.\n- Showing a banner or ad (publicity) based on the user IP address.\n- Ask for information to a database.\n- Write on a database using AJAX.\n- etc.\n\nBasically: Javascript its a programming language to generate HTML and CSS (text) based on events.\n\n## The`<script>` tag:\n\nAll javascript must be done on a separate sheet (best practice).\nYou have to import to put that tag **right before the body closing tag**.\nThe code execution starts on the `window.onload = function(){}` like this:\n```\n//index.js\n\nwindow.onload = function(){\n    //your code here\n}\n\n//you can declar other functions here, but please don't write code outside functions\n```\n\n**Warning**: Carefull explaining the windown.onload, because today we are not suppose to overwhelme them with events and functions.\n\n### Explain Variables:\n\nVariables are javascript’s version of containers that hold some information.\n\nAn example of this is:\n\n1. Let’s say we needed to store someone’s birthday for an age verification script\n2. One of our variables might be: `var day = 29;`\n3. There are three things going on here:\n    - First, the computer interprets the letters VAR as the beginnig of a variable declaration.\n    - After `VAR` it must always come the variable name: in our case is called `day`.\n    - Secondly, we are storing a value of 29 in that variable.\n    - Finally, notice the syntax. All javascript lines typically end with semicolon. There will be some cases where you don’t use semicolon and we will learn those later but for now, all lines are with semicolon.\n\n3. Given that we defined the var above, `var day = 29;` if we want to display it for testing, we can show use the javascript console:\n    - Explain how to open the google inspector console\n    - So to display the variable, you would use: `console.log(day);`\n    - will print on the console `29`\n\n### Data Types\n\nYou can store 6 differnt types of values: Strings, Integers, Booleans, Arrays, Objects, Functions, Null and Undefined.\n\n- Boolean - true/false\n- String - always in quotes\n- Number - any type of number -  integer numbers, negative numbers, decimal numbers, floats, etc.\n- Undefined - nothing was set or specified for the variable. so the variable has no value\n- Null - When a database or function returns nothing, it returns null\n- Array - data sets [2,3,4,\"cat\",242,\"d\"]\n- Object - You can explain objects like real life objects that are comprised by other datatypes, you can use the analogy with HTML Tags because the tags have properties taht describe them further. Objects behave the same way.\n\nNote: Data Types on Breatheco.de: [http://content.breatheco.de/lesson/what-is-javascript-learn-to-code-in-javascript#data-types](http://content.breatheco.de/lesson/what-is-javascript-learn-to-code-in-javascript#data-types)\n\n### String Contatenation\n\nSuming two integers its not the same as suming two strings, as web developers we are going to be creating HTML using Javascript, we will contatenate like crazy!\n\n### Arrays\n\nSince we just learned what an array is, let’s look at some basic properties of an array:\n\n1. value or item: The value stored on each position.\n2. index or position: the position of the given value in the array `note: the first position starts at 0`\n3. length - the total length of the array\n\nDeclaring an array [http://content.breatheco.de/lesson/what-is-an-array-define-array](http://content.breatheco.de/lesson/what-is-an-array-define-array#how-to-declare-an-array)\n\nTo initialize an array , you can use the following:\n```js\nlet myArray = [];\n```\nThis defines the array as an empty set so that you can add values later.\n\nNote: Don’t use, use let or const.\n\nYou can also initialize an array with a value in it**\n```js\nlet myArray = [1,2,3,4,5];\n```\nDisplaying the value of an array using console, we can show it as `console.log(myArray[0]);`\n\nUpdating a specific position: `myArray[4]=3;`\n\nGenerating a random number using `Math.rand()`\n\n## Start Coding!! Let’s work on the Excuse Generator\n\n- Read the instructions with the students, and introduce the problem: How can we create a excuse? What are the pieces that we need to build?\n- Students MUST discuss with each other how to approach the problem of creating an excuse, guide them.\n- The project does not have to be fully finished at the end of the class, some students are slower than others, but at  least tgey should be half way and with a clear idea.\n- To include the excuse into the document you can tell them tu use `document.querySelector('body').innerHTML = excuse;` but don't try to explain the DOM, that is for another class and they are already overwhelmed.\n"
                    },
                    {
                        "id": 6,
                        "label": "Practice JS",
                        "lessons": [],
                        "project": {
                            "title": "Code an Excuse Generator in Javascript",
                            "instructions": "https://projects.breatheco.de/project/excuse-generator"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "javascript-functions-exercises-tutorial",
                                "title": "Practice Javascript Functions Tutorial"
                            }
                        ],
                        "homework": "",
                        "position": 6,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/tutorial-project-excuse-generator-javascript",
                                "slug": "excuse-generator",
                                "title": "Code an Excuse Generator in Javascript"
                            }
                        ],
                        "description": "The only way to master coding is thru practice, today we'll show you how practice must be done, and we hope you continue practicing on your own time.",
                        "key-concepts": [
                            "how gitpod exercises work",
                            "how important it is to practice",
                            "how to work with strings",
                            "how to work with functions",
                            "how to work with arrays"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Coding Practice Day: Students take turns on the screen, one at a time, one student share the screen and tries completing the exercise, and the others help, every student must go around at least two times. Stop the class and explain JS concepts when needed.",
                        "extended_instructions": "# Exercise Day\n\nExplain to the students how they learnpack exercises work:\n\nThere are 4 main exercises: Begin JS, Arrays, Functions, and Mastering Javascript, and they are supposed to be done in parallel because they share the same concepts E.g: You need to know about strings to know about functions because you probably will use a string within a function.\n\n1. They can start any series of exercises by clicking on the gitpod button in GitHub (using the gitpod extensions)\n2. Once the exercise engine is loaded and the exercises are running they can click \"next\" for each exercise.\n3. If the engine is down the can type `learnpack start` to restart the engine.\n\nThey have to complete all exercises by the end of the Bootcamp and repeat some of them if possible, particularly the \"arrays\" exercises.\n\n## Start Practicing\n\nOpen the begin js exercises and have the class take turns on the screen to complete each exercise during the 3 hours.\n\nNote: You can stop the class anytime and explain a javascript concept if you see they need to re-enforce the concept."
                    },
                    {
                        "id": 7,
                        "label": "Domain Name Generator",
                        "lessons": [
                            {
                                "slug": "what-is-an-array-define-array",
                                "title": "It's Time To Learn What is an Array"
                            }
                        ],
                        "project": {
                            "title": "Domain Name Generator",
                            "instructions": "https://projects.breatheco.de/project/domain-generator"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "javascript-array-loops-exercises",
                                "title": "Learn Javascript Arrays and Loops Interactive"
                            }
                        ],
                        "homework": "Students must remember to read the next lesson before next class and finish the domain name generator and work hard on the JS replits for Begin JS, Arrays, Functions.",
                        "position": 7,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-domain-generator",
                                "slug": "domain-generator",
                                "title": "Domain Name Generator"
                            }
                        ],
                        "description": "Arrays are the only way to have a list of things in programming, and they are challenging because developers need to master the art of getting or setting values from arrays using loops\n           ",
                        "key-concepts": [
                            "Functions anonymous vs normal",
                            "forEach",
                            "Every Javascript code starts OnLoad",
                            "String concatenation",
                            "Main website events: PreLoad & OnLoad",
                            "The-runtime (after OnLoad)",
                            " Introduce the DOM",
                            " Use queryselector() to select DOM Elements just like you do with CSS",
                            " Include your bundle on index.html (only one script tag from now on)"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Review everything we have seen so far very quick, reinforce that we are building HTML using JS now, ask the students and ask them to strategize on the white board, before starting to code reinforce the ONLOAD function as the beginning of your application, start using the breathecode-cli and vanilla-js",
                        "extended_instructions": "# Looping and Arrays\n\nWelcome class.\n\n## `1 min` Remind students the importance about finishing the JS exercises\n\nStudents should be completing those exercises HARD: Begin JS, Loops, Arrays, Functions and optionally Mastering JS.\nRemind students that reading will do no help, this phase is about practice, practice and more practice.\n\n## `5 min` Review last class\n\n- We started generating HTML Strings for the first time, that is the developers ultimate goal.\n- Data Types, Variables and Arrays.\n- Algorithms run from top to bottom, line by line.\n- You can skip lines with conditionals, repeat lines with loops and reuse lines with functions.\n- Arrays have items (or values) and index (or position), they start at 0. And you can get the length with `myArray.length`.\n- Concatenate stringgs using + and the new amazing type of quotes '`' that is easier for creating big dynamic strings.\n\n## `10 min` Talk about looping: with and without arrays (for vs foreach).\n\n- The main objective for a loop is to repeat a bunch of lines of code from the openin curly brace to the closing curly brace.\n- There are several ways of looping but we will focus mainly in the `for` loop for now.\n- Here is a 12min video explaining [all the different ways of looping](https://www.youtube.com/watch?v=U3ZlQSOcOI0).\n- You can add elements to an array with `push`.\n\n## `10 min` Talk more in detail about functions\n\n- Functions are the last thing to learn about basic algorithms (encouragement).\n- You create a function when you find yourself doing the same thing all over.\n- Functions purpose is to receive an input and return an output.\n- The function stops executing after returning.\n- Functions SHOULD USE VARIABLES declared ourside of them (best practice).\n- Anonymus function vs normal function.\n- In javascript, we will only use arrow functions (no the original type of function) because they are more similar to other programming languages functions.\n\n## `2:20 min` hours Start coding with the students!\n\n- Ask students to use the boilerplate for vanila.js.\n- Read the instructions for the domain name generator and ask students to discuss and build the strategy on the whiteboard.\n\n## ⚠ ️IMPORTANT `before leaving` Invite them to the coding weekend\n\nThis is the most important coding weekend of the entire course because they have to understand JS well to be able to continue learning more stuff.\n"
                    },
                    {
                        "id": 8,
                        "label": "Catch up",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must remember to read the next lesson before next class and must finish all pending project and exercises.",
                        "position": 8,
                        "assignments": [],
                        "description": "You have a lot of things to cach up on, finish and deliver the replit exercises and projects. Make sure to review the last replit of events (todo list). Use your time wisely...",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Help students finish the replit exercises and projects. Make sure to review the last replit of events (todo list). IMPORTANT: This next coding weekend will be the last before getting into react, encourage students to attend.",
                        "extended_instructions": "# Practice Day (replits and projects)\n\n## `5 min` Take any questions about javascript\n\nRemind everyone that the all the replits about Javascript are extremelly important, the only way to become better is practicing.\n\n## `10 min` Last review about JS (really fast)\n\n- Everything starts on the window.onload\n- A non declared variable value is `undefined` (this will help them read the console errors)\n- If you forget to return, the function will return `undefined` (this will help them read the console errors)\n- Our main purpose for a front-end coder is to **generate dynamic HTML and CSS**, you will be using algorithms to do so (the need to understand that for better react.js learning curve)\n- All ways of looping are important, including the `for` loop because its the only one with total freedom and we not only loop arrays, we also loop for other reasons.\n- Map vs Foreach: In react we will map all the time because it creates a new array and that is really important.\n- Functions goal is: Receive an input and return and output. The execution stops after returning.\n- What is `myArray.find` and `myArray.filter`. In React we will use them all the time.\n\n## `2 hours` Last Repl.it/Project Intensive before The DOM!!\n\n☢ 😰 🤯 ️Students are overwhelmed!\n\nThis is the most delicate part of the course, there is a **lot of risk on students droping**. Please make sure all of them do lots of replits today.\nDo not teach new concepts!\n\n💡 Tell students that today the MUST ask questions after 5 min of being stuck, They cannot try on their own for 30 minutes before asking, not today.\nThey will have planty of challenges to keep learning on their own tomorrow.\n\n## `45 min` before the class finished, do the student exernal profile with them:\n    - Breafly explain open source and why its important, examples of great software build like that.\n    - Explain that developers like to collaborate in open source and why its important for them.\n    - Pull Request are the best mechanism for collaboration because you don't need permission to push.\n    - Students are required to do a real collaboration to a real open source project by the end of the class to an open source project.\n    - Talk about the importance of having green dots on your github activity graph.\n    - Explain YML breafly.\n    - Help them do they YML file and push a draft of their profile (don't worry about content, just structure).\n    - Once they do their PR they can see their live profile because we are [automatically merging](https://mergify.io/) and deploying.\n    - If the automatic merge does not occur, its probably because their YML has syntax problem, you can review the travis execution log on the pull request details.\n\nNote: They students don't have to worry about the content, today its just about the YML and making it work and show up on the [student list](http://sep.4geeksacademy.co/students/).\n\n5. After their `Student External Profile` is done, they may continue doing replits and finishing their previous projects."
                    },
                    {
                        "id": 9,
                        "label": "Conditional Profile Card ",
                        "lessons": [],
                        "project": {
                            "title": "Conditional Profile Card Generator",
                            "instructions": "https://projects.breatheco.de/project/conditional-profile-card"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "master-javascript-exercises",
                                "title": "Mastering Javascript"
                            }
                        ],
                        "scrollY": 2632,
                        "homework": "Students must remember to read the next lesson before next class and finish the profile card and exercises to date.",
                        "position": 9,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-conditional-profile-card",
                                "slug": "conditional-profile-card",
                                "title": "Conditional Profile Card Generator"
                            }
                        ],
                        "description": "What we call \\\"thinking\\\" is basically the process of making decisions based on some information (variables) that we have available. You can replicate the same behavior in a computer by using conditionals and logical operations.",
                        "key-concepts": [
                            "Every Javascript code starts OnLoad",
                            "String concatenation",
                            "Variable Initialization",
                            "If...else",
                            "Sometimes you don't need else",
                            "What is compiling",
                            "Why does the Javascript community decided to Bundle (compatibility, ES6, performance, etc)",
                            "Bundling JS, CSS and Images",
                            "Include your bundle on index.html"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Ask students to gather and create a flow chart on the whiteboard with the decision process behind building the html for the profile card project. Finish conditional profile card and all previous exercises. ",
                        "extended_instructions": "## Conditionally Rendering\n\n1. Rendering means printing or displaying.\n2. In HTTP you can only print text, it can be an HTML Text, CSS Text, JSON Text, Javascript Test.\n3. Basically it means generating strings dynamically.\n4. Conditional rendering is what makes your website interactive.\n\n\n### There are 2 ways of writing conditions:  \n\nUsing the `if....else`  statement.  \n\n```js\nlet canDrive = false;\nif(age > 16){\n    // do something\n    canDrive = true;\n}\nelse{\n    canDrive = false;\n}\n```\nOr using a ternary (the most popular for conditional rendering):\n\n```js\nlet canDrive = (age > 16) ? true : false;\n```\nNote: as you can see the ternary is smaller, it's a great and agile resource.\n\n## What is conditional rendering?\n\nIt means using conditions to generate HTML dynamically. Basically, your HTML will be different depending on certain **conditions** that you determine.\n\nFor example, using the same condition before:\n```js\nlet canDrive = (age > 16) ? \"can\" : \"cannot\";\nlet myHTML = 'I ' + canDrive + \" drive\";\n\n// myHTML will be either \"I can drive\" or \"I cannot drive\"\n```\n\nWith the javascript template literrals is even easier to generate strings dynamically.\n\n```js\n\nlet person = {\n    name: \"Alejandro\",\n    age: 17\n}\nlet myHTML = `\n    <div>\n          <p>My name is ${person.name}</p>\n          <p>and I am ${person.age > 21 ? \"capable\" : \"not capable\"} to drink</p>\n    </div>\n`;\n```\nThis javascript code will output the following HTML:\n\n```html\n    <div>\n          <p>My name is Alejandro</p>\n          <p>and I am capable to drink</p>\n    </div>\n```\n\n"
                    },
                    {
                        "id": 10,
                        "label": "The DOM",
                        "lessons": [
                            {
                                "slug": "what-is-front-end-development",
                                "title": "What is Front-End Development"
                            },
                            {
                                "slug": "what-is-dom-define-dom",
                                "title": "What is DOM: Document Object Model"
                            },
                            {
                                "slug": "event-driven-programming",
                                "title": "Event Driven Programming"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "the-dom-exercises",
                                "title": "Learn how to manipulate The DOM with JS"
                            },
                            {
                                "slug": "javascript-events-exercises",
                                "title": "Javascript Events"
                            }
                        ],
                        "scrollY": 2824,
                        "homework": "Students must remember to read the next lesson before next class and finish the random card and the dom and events exercises.",
                        "position": 10,
                        "assignments": [],
                        "description": "Ok but how do we use JavaScript to build websites? You have to interact with The DOM to create dynamic HTML/CSS and wait for events to occur.",
                        "key-concepts": [
                            "Main website events: Preload & OnLoad",
                            "The-Runtime (after download)",
                            "Instroduce the DOM",
                            "Use queryselector() to select DOM Elements just like you do with CSS",
                            "Add/remove CSS classes to DOM elements",
                            "Please do not attempt to explain Webpack config.",
                            "Bundling JS, CSS and Images",
                            "Include your bundle on index.html"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Explain the DOM in detail and do the exercises about the DOM with the students, students take turns on the screen to complete each exercise.",
                        "extended_instructions": "# Day 10 -  The DOM\n\nBefore the class, teacher assistants can sti with students and responde eny coding questions.\n\n## `30 min` Introduction about the DOM\n\nNo we are goign to be using Javascript to create or change HTML code: The DOM.\n\n- Once the browser recieves the server response it starts building The DOM until `window.onload` gets triggered.\n- The DOM is a LIVE hierarchy that represents the HTML document.\n- The DOM its not the same as the source code, the source code will be the first version of the DOM ants its quickly overriten by the LIVE changes.\n- Draw a DOM example on the whiteboard vs a its corresponding HTML code.\n- Show on the browser the google inspector with the DOM opened (the elements tab).\n- Show how it changes live based on the user/system activity clicks/mouseover/etc.\n- The `querySelector` and `querySelectorAll` will be our main way to use The DOM, the other methods are deprecated: getElementById, byTagName, etc.\n- Once you select DOM element and store it on a variable you can change any of its properties: Styles, Classes, Values, etc. ANY PROPERTY!\n- Code on the google inspector console a small 2 line script showing a querySelector and changing a style:\n\n```js  \nconst anyDOMElement = document.querySelector(‘.anyClass’);\n//changing a background\nanyDOMElement.style.backgroundColor = ‘black’;\n//adding a class\nanyDOMElement.addClass('d-none');\nanyDOMElement.removeClass('d-none');\n// inner html\nanyDOMElement.innerHTML = \"html string that will be included inside the selector\"\n```\n\n## `10 min` Reinforce what is webpack and npm\n\nJust a brief reminder about bundling, `npm install`, `npm run build`, etc.\n\n## `2:20min ` Start the DOM exercises\n\nEach student rotates the screan, one at a time."
                    },
                    {
                        "id": 11,
                        "label": "Random Card Generator",
                        "lessons": [],
                        "project": {
                            "title": "Random Card Generator",
                            "instructions": "https://projects.breatheco.de/project/random-card"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 2886,
                        "homework": "",
                        "position": 11,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-random-card",
                                "slug": "random-card",
                                "title": "Random Card Generator"
                            }
                        ],
                        "description": "Let's build our first project using the DOM, manipulate syles, classes and HTML code using Javascript during the runtime.",
                        "key-concepts": [
                            "Main website events: Preload & OnLoad",
                            "The-Runtime (after download)",
                            "Instroduce the DOM",
                            "Use queryselector() to select DOM Elements just like you do with CSS",
                            "Add/remove CSS classes to DOM elements",
                            "Please do not attempt to explain Webpack config",
                            "Bundling JS, CSS and Images",
                            "Include your bundle on index.html"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Focus ",
                        "extended_instructions": "## Answer questions\n\nThe first 15min of the class are ideal to answer questions while the students connect.\n\n## `10 min` Review the DOM again\n\n- Once the browser recieves the server response it starts building The DOM until `window.onload` gets triggered.\n- The DOM is a LIVE hierarchy that represents the HTML document.\n- The DOM its not the same as the source code, the source code will be the first version of the DOM ants its quickly overriten by the LIVE changes.\n- Draw a DOM example on the whiteboard vs a its corresponding HTML code.\n- Show on the browser the google inspector with the DOM opened (the elements tab).\n- Show how it changes live based on the user/system activity clicks/mouseover/etc.\n- The `querySelector` and `querySelectorAll` will be our main way to use The DOM, the other methods are deprecated: getElementById, byTagName, etc.\n- Once you select DOM element and store it on a variable you can change any of its properties: Styles, Classes, Values, etc. ANY PROPERTY!\n- Code on the google inspector console a small 2 line script showing a querySelector and changing a style:\n- \n```js  \nconst anyDOMElement = document.querySelector(‘.anyClass’);\n//changing a background\nanyDOMElement.style.backgroundColor = ‘black’;\n//adding a class\nanyDOMElement.addClass('d-none');\nanyDOMElement.removeClass('d-none');\n// inner html\nanyDOMElement.innerHTML = \"html string that will be included inside the selector\"\n```\n\n## `20 min` Reinforce what is webpack and the vanilla js boilerplate\n\n1. Explain how to start using the boilerplate.\n2. Show students that the README.md has everything they need to start coding.\n3. Show how to see errors on the terminal.\n4. Show how to see errors on the INSPECTOR.\n\n## `20` Strategize the project!\n\nReact instructions carefully with students and plan a strategy!\n\n- Start strategizing the HTML/CSS.\n- After having one hard coded card and suite, how can you change it dynamically?: \n    - Approach A: Dynamically changing the card css classes. E.g: havin a class `card` and 4 classes `diamons`, `club`, `spade` and `heart`.\n    - Approach B: Using `domElement.styles.color = 'red';` instead of using classes.\n- Use the whiteboard with the students.\n- Every student must participate.\n\n## `2:20` Code the project\n\nOnce the strategy is clear in written down, help students implement it.\n\n## Ask students to finish replits about the DOM."
                    },
                    {
                        "id": 12,
                        "label": "Unit Testing with Jest",
                        "lessons": [
                            {
                                "slug": "how-to-create-unit-testing-with-Javascript-and-Jest",
                                "title": "How to create unit testing with JEST"
                            }
                        ],
                        "project": {
                            "title": "Your first unit tests with Javascript's Jest Framework",
                            "instructions": "https://projects.breatheco.de/project/unit-test-with-jest"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Finish pending JS exercises and jest project.",
                        "position": 12,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-unit-test-with-jest",
                                "slug": "unit-test-with-jest",
                                "title": "Your first unit tests with Javascript's Jest Framework"
                            }
                        ],
                        "description": "Quality Assurance is one of the most valued skills in big tech major companies, today we are learning how you can write code that tests your previously written code in an automated way. Welcome to unit testing!",
                        "key-concepts": [
                            "What is a unit test",
                            "Very simple test case",
                            "Some times there are several correct answers",
                            "What is an assertion",
                            "Jest Framework",
                            "You have to test succes AND failure"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Explain how unit testing works with a very simple example (sum function) and then show the students how the exercises are auto-graded with unite tests, open one of the simplest JS exercises, and show how the tests work. Then start with today's project.",
                        "extended_instructions": "# `20min` Unit testing\n\nWhat is a unit test and why do we need it? Explan a simple function like the `sum` function that sums two numbers and how to test it:\n\n\n```js\n\nfunction sum(a,b){\n     // leave the function without implementation\n}\n\n```\n\nWhat should this function return? a+b\n\nIf I pass `5` and `7` to this function, what should the function return? `12`\n\nUnit tests are HARD CODED tests with very specific inputs to function and very specific expectations about the result of those functions.\n\n## How can you assert?\n\nThe word \"assert\" is used in many programming languages testing frameworks, asserting basically means comparing.\n\nWe are going to be learning in Javascript and Jest, instead of `assert` you have to say `expect`.\n\nDepending on the framework the syntax varies, but in javascript we assert with Jest like this:\n```js\nexpect(something).toBe(somehitngElse)\n```\n\nFor example: \n```js\ntest(\"If 5 and.7 are passed, then the function must return 12\", function(){\n    const sum  = require('./sum.js');\n    const total = sum(5,7);\n    expect(total).toBe(12);\n});\n```\n\nYou can find all the [jest expect functions here](https://jestjs.io/docs/en/expect.html).\n\n## Testing for failure instead of success\n\n1. Try testing your functions for weird scenarios\n2. Try to break your functions with the wrong parameters.\n3. Think about all the possible scenarios.\n\n## `2hr` Start the interactive project\n\nThere is an interactive project available that will explain a lot to the students, start the project with them and let them finish it on their own."
                    },
                    {
                        "id": 13,
                        "label": "Landing Page with React",
                        "lessons": [
                            {
                                "slug": "javascript-import",
                                "title": "JavaScript Import and Export of Modules"
                            },
                            {
                                "slug": "learn-react-js-tutorial",
                                "title": "Learn React Here : React Js Tutorial"
                            },
                            {
                                "slug": "making-react-components",
                                "title": "Creating React Components"
                            }
                        ],
                        "project": {
                            "title": "Landing Page with React",
                            "instructions": "https://projects.breatheco.de/project/landing-page-with-react"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "react-js-exercises",
                                "title": "Learn React.js Interactively"
                            }
                        ],
                        "homework": "Students must remember to read the next lesson before nest class and finish their landing page with react.",
                        "position": 13,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-landing-page-with-react",
                                "slug": "landing-page-with-react",
                                "title": "Landing Page with React"
                            }
                        ],
                        "description": "But working with the DOM can get tricky and it's resource consuming, for that and many other reasons libraries like React.js got popular in the last couple of years. The let you create HTML and CSS using JS in a very intuitive way",
                        "key-concepts": [
                            "Export -> Import Modules",
                            "You can create your own tags",
                            "Create a component as a function",
                            "JSX Syntax",
                            "Component properties",
                            "You will find on the internet syntax for class components (legacy)"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Make students create their first react components and explain the use of JSX. Only talk about functional components, class components are deprecated and we will be using only hooks. ",
                        "extended_instructions": "# Introduction to React.js\n\n## `5 min` Take any theorical questions about DOM/Javascript\n\n## `30 min` Beginnin of todays new topic\n\nToday we will be covering the beginning of creating our first React.js Applications!\nThis topic will be broken up in a few lessons with the overview being today and more detail over the coming days.\nPLEASE DON’T MISS CLASS and make sure to go to catch up and your own time and saturdays.\n\n### Export -> Import variables among your files\n\nThanks to webpack we can split our code in many files now.\nAll we have to do is expecify what variables we want to share with other files using the `export` sentence.\nOn the other file we can `import` the variable like this:\n```js\n//on file2.js we can declare a function and store it on a variable\nexport let sum = (a,b) => (\n  return a + b;\n);\n\n//on file1.js we can import that function and use it like this:\nimport { sum } from 'path/to/file2.js';\n\nconsole.log(sum(2,7));\n```\n\n\n### React JS Introduction\n\nA front end javascript library that is used to create advanced HTML/CSS/JS projects.\nIt’s highly in demand in the job market right now and growing.\n\n#### Why React?\n\n- No more DOM. React handles all of that. You will create your own components and tell react what component to render and when; react handles all interaction with DOM on the front end.\n- Now its all about component based, its a lot easier to re-use your code int he future.\n- It’s much faster than traditional javascript. Instead of re-rendering the whole page when a single change occurs, React renders individual items that change. \n\n#### You can create your own tags\n\n- Before, you learned that HTML Tags are set functions that the browser knows how to interpret.\n- Now in React, You can create your own tags by creating usable components.\n- Just create a function that returns HTML and that will become its own tag.\n- JSX its like HTML+JS you have to get use to it.\n- You have to use braces in the middle of your HTML to include dynamic JS.\n```jsx\nconst Alert = function(props){\n    return (<div className=\"any-class-name\">{props.children}</div>);\n}\n\nReactDOM.render(<div className=\"any-class-name\">{props.children}</div>)\n```\n- You have to use [proptypes](https://reactjs.org/docs/typechecking-with-proptypes.html) (best practice).\n```js\nAlert.propTypes = {\n  children: PropTypes.node,\n  // any other property...\n};\n```\n\n## `1:25 min` Do the React Exercises with the students\n\nThe transition to react its hard for the students, that is why we will be doing the react exercises with them.\n\n## `60 min before class ends` Start the class project (Landing Page)\n\n- This project will be do in groups of two. \n- Every team must share the same git repository.\n- Take some time to read the instructions with the students and have them setup they boilerplate and repository.\n- Each group will strategize privatly how to approach the exercise."
                    },
                    {
                        "id": 14,
                        "label": "Simple Counter",
                        "lessons": [],
                        "project": {
                            "title": "Simple Counter",
                            "instructions": "https://projects.breatheco.de/project/simple-counter-react"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must work on their simple counter.",
                        "position": 14,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-simple-counter-react",
                                "slug": "simple-counter-react",
                                "title": "Simple Counter"
                            }
                        ],
                        "description": "Its the first time you've heard or learn about react, we have given you a lot of exercises to practice. Please practice like crazy with all of them. Ask questions",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Use half of the class to explain Hooks. Students have now a lot of homework: The React Replits,, Counter and the Landing page. Work with students to help them complete the developments.\",\n",
                        "extended_instructions": "# Continue working on the Landing Page\n\n## `5 min` Take any questions about javascript/react/bootstrap/html/css\n\nRemind everyone that doing the replits about Javascript is extremelly important, the only way to become better is practicing, not reading or waching videos.\n\n## `20 min` Review React.js again.\n\n- React is about components (component names MUST be written in PascalCase)\n- You build components by creating functions (the only function in the worls of JS that MUST start in capital letters)\n- Functions must return HTML.\n- Those functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n\n```\n🔥  We are not using component classes\n\nClass Componets are legacy, we recommend to ignore them as they will disappear in the next 1-2 years.\n```\n\n## `15min` Show the class again how to create a component\n\n- Create a simple component like the bootstrap card or the bootrap modal.\n- Make sure the component does not have a state, only props.\n- Explain the props in detail.\n\n\n☢ 😰 🤯 ️Students are overwhelmed ! Don't talk to much because they won't listen.\n\n💡 Tell students that today its not the day to be brave and find your own solutions, today its about asking questions after 5 minutes."
                    },
                    {
                        "id": 15,
                        "label": "Component State",
                        "lessons": [
                            {
                                "slug": "react-hooks-explained",
                                "title": "React Hooks Explained"
                            }
                        ],
                        "project": {
                            "title": "Traffic Light",
                            "instructions": "https://projects.breatheco.de/project/traffic-light-react"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 5486,
                        "homework": "Students must finish all their pending projects and exercises.",
                        "position": 15,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-traffic-light-react",
                                "slug": "traffic-light-react",
                                "title": "Traffic Light"
                            }
                        ],
                        "description": "So far you know that React components have properties (props), but there is one more important concept in react components: The State. ",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Do not explain react components with classes, it's still being used in the industry but less every day. Let's focus on mastering the useState function.",
                        "extended_instructions": "# Creating Components with States\n\n## `10 min` Take any questions about javascript/react/bootstrap/html/css\n\nRemind everyone that doing the replits about Javascript is extremelly important, the only way to become better is practicing, not reading or waching videos.\n\n## `10 min` Review React.js\n\n- React is about components (component names MUST be named in `PascalCase` notation)\n- You build components by creating functions that later will become `<Tags>` (with capital first letter)\n- Component Functions must **always** return HTML.\n- Those component functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n\n## `20 min` The state\n\n- The function useState must be used when information inside the component o website changes over time, for Example: \n    - A timer: the current time changes every second (or even milisec).\n    - Todo list: the array of todos grows over time.\n    - Fetch requests: When information comes from a nother server it was empty first and then it changes.\n\n- State vs Props:\n      1. State is declared inside the component.\n      2. Props are declared outside of the component and are read only within the inside of the component.\n\n- Show an example os using the useState.\n```js\n\n//            ⬇ value  ⬇ modifier                  ⬇ default\nconst [ value, setValue ] = useState(defaultValue);\n```\n- you can have as many states as you want\n\n### The state is inmutable:\n\nThis is wrong:\n```jsx\nconst [ todos, setTodos ] = useState([]);\n\n// ⬇  WRONG!!!!!  ⬇\nconst addTodo = (text) => {\n  todos.push(text)\n  setTodos(todos);\n}\n\n\n// ⬇  GOOD!!!!!  ⬇\nconst addTodo = (text) => {\n const newTodos =  todos.concat([text])\n  setTodos(newTodos);\n}\n```"
                    },
                    {
                        "id": 16,
                        "label": "Todo List",
                        "lessons": [
                            {
                                "slug": "controlled-vs-uncontrolled-inputs-react-js",
                                "title": "What are controlled and/or uncontrolled inputs in React.js"
                            }
                        ],
                        "project": {
                            "title": "Todolist Application Using React",
                            "instructions": "https://projects.breatheco.de/project/todo-list"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must remember to read the next lesson before next class and must finish their Todo List.\n\n",
                        "position": 16,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-todo-list",
                                "slug": "todo-list",
                                "title": "Todolist Application Using React"
                            }
                        ],
                        "description": "Finally we can create our own HTML tags and re-use them on several projects and views. The key to understand a component is understanding Props and The State. Please start working on the Todo-List Application. This project will be useful in your future as a coder!",
                        "key-concepts": [
                            "Controlled inputs",
                            "Coditional rendering",
                            "the component state",
                            "the state is inmutable",
                            "state vs props",
                            "Using const, map, filter and concat to prevent state mutation",
                            "deleting and addig  Todos"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Review landing page. React as rendering engine: Students need to understand that now they can finally create their own HTML tags (React Components) and how to use the State and the Props. Have the class discuss the strategy for todo-list.IMPORTANT: Students should be able to add & delete tasks from their Todolist(or at least have some notion).\n           ",
                        "extended_instructions": "# Creating Components with States\n\n## `10 min` Take any questions publicly\n\nRemind everyone that doing the exercises about Javascript is extremely important, the only way to become better is practicing, not reading or watching videos.\n\n## `10 min` Review React.js (yes, again)\n\n- React is about components (component names MUST be named in `PascalCase` notation)\n- You build components by creating functions (the only function in the worls of JS that MUST start in capital letters)\n- Functions must return HTML.\n- Those functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n\n## `20min` Go over the component `useState` hook again\n\n- Properties are defined **ouside** of the component.\n- The State is defined **inside** of the component.\n- The state is needed when information inside the component will **change over time**.\n- You can have as many states as you want.\n- Talk about controlled inputs with an example.\n\n\n## `2:25 min` Start the todolist with the students\n\nAny other project the student may have until this day (like the Traffic Light) is supposed to be done on their own time.\n\n- You can help them a lot on this exercise, but always do it on the whiteboard.\n- Help them do the strategy first and later help them complete the exercise.\n- This exercise is challenging for the majority of the students, but you will be able to manage if you continue helping them individually."
                    },
                    {
                        "id": 17,
                        "label": "Todo List with React and Fetch",
                        "lessons": [
                            {
                                "slug": "asynchronous-algorithms-async-await",
                                "title": "Creating asynchronous algorithms"
                            },
                            {
                                "slug": "the-fetch-javascript-api",
                                "title": "The Fetch API"
                            },
                            {
                                "slug": "understanding-rest-apis",
                                "title": " Understanding Rest APIs"
                            }
                        ],
                        "project": {
                            "title": "Todolist Application Using React and Fetch",
                            "instructions": "https://projects.breatheco.de/project/todo-list-react-with-fetch"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 5241,
                        "homework": "Students must continue to work in their project.",
                        "position": 17,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-todo-list-react-with-fetch",
                                "slug": "todo-list-react-with-fetch",
                                "title": "Todolist Application Using React and Fetch"
                            }
                        ],
                        "description": "Most of the applications build on the internet require some king of database syncronization, normal made through several API requests",
                        "key-concepts": [
                            "çusing fetch to retrieve information from the server",
                            "Displaying a 'loading' before the data arrives",
                            "Reseting the state when fetch finalizes",
                            "POSTing, PUTing and DELETEing data to the server",
                            "Sync the stae with the server",
                            "asynchrounous programming",
                            "HTTP ",
                            "How to use POSTMAN (set environment variables and use collections)",
                            "JSON is a Javascript object but as a TEXT",
                            "The goal is to send / recieve everything as JSON ",
                            "Serialize>send>Unserialize",
                            "What is serialization and how to do it",
                            "Why use several request types: GET, POST, PUT, DELETE"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Introduce the concept of fetching help students finish the todo list(unstuck them) and incorporate the synconization with the API. Then, introduce the new Todo List with React and Fetch.\n",
                        "extended_instructions": "# Using Fetch to request information from API's\n\n## `5 min` Take any questions about javascript/react\n\nRemind everyone that doing the replits extremelly important, the only way to become better is practicing, not reading or waching videos.\n\n## `10 min` Review React.js\n\n- React is about components (component names MUST have the first letter written in caps)\n- You build components by creating functions (the only function in the world of JS that MUST start in capital letters)\n- Functions must return HTML.\n- Those functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n- Props vs State (props are external, state is internal)\n\n## `20 min` Review the Basics of HTTP and segway to API concepts\n\n- Client and Servers interact in the form of text\n- As a client, your job is to setup and send `Requests` with these 4 properties: \n    Method: GET=Read POST=Create PUT=Update DELETE=DELETE\n    Body: the payload (only applies to POST and PUT) and must be formated in csv,json,xml or similar.\n    Content-Type: the format that the payload will have.\n    URL: Where the request is going to be sent.\n- Go over the concept of serialization (form json string -> to real object in javascript)\n- You have to wait for the response using Promises (do not explain async/await yet)\n- This is how a typical [API documentation looks](http://assets.breatheco.de/apis/fake/todos/), next project we will be using a real life Starwars API.\n\n## `20 min` Consuming API's using the Fetch method in Javascript\n\nNow, for the first time, we have a way of askin for aditional information during runtime\n\n```js\nfetch('url/to/fetch', additionalSettings)\n    .then(resp => {\n        console.log(resp.ok); // will be tru if the response is successfull\n        console.log(resp.status); // the status code = 200 or code = 400 etc.\n        console.log(resp.text()); // will try return the exact result as string\n        return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results\n    })\n    .then(data => {\n        //here is were your code should start after the fetch finishes\n        console.log(data); //this will print on the console the exact object received from the server\n    })\n    .catch(error => {\n        //error handling\n        console.log(error);\n    })\n```\n# Consuming REST API's to GET, POST, PUT and DELETE\n\nToday we will be using the Fetch API to create POST/PUT/DELETE methods.\n\n## Explain how to code a fetch request to successfully implemente the GET/POST/PUT/DELETE with JS\n\nIn the following example, the `additionalSettings` variable has the key to everything, you can specify the Content-Type, Method, and Body of the request.\n\n```js\n\nconst additionalSettings = {\n    \"headers\": {\n        \"method\": \"POST\",\n        \"Content-Type\": \"application/json\",\n        \"body\": JSON.stringify(someObject)\n    }\n}\n\nfetch('url/to/fetch', additionalSettings)\n    .then(resp => {\n        console.log(resp.ok); // will be tru if the response is successfull\n        console.log(resp.status); // the status code = 200 or code = 400 etc.\n        console.log(resp.text()); // will try return the exact result as string\n        return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results\n    })\n    .then(data => {\n        //here is were your code should start after the fetch finishes\n        console.log(data); //this will print on the console the exact object received from the server\n    })\n    .catch(error => {\n        //error handling\n        console.log(error);\n    })\n```\n\n## `2:30min` Start Todo list with React and Fetch\n\nThis project uses everything we have seen so far: The Context API, Fetch, HTML/CSS, etc.\nThe idea is to practice everything but the only new concept will be doing POST/PUT/DELETE.\n\n\n"
                    },
                    {
                        "id": 18,
                        "label": "Catch up",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must remember to read the next lesson before next class and must finish the all replits and projects.",
                        "position": 18,
                        "assignments": [],
                        "description": "You have a lot of things to cach up on, finish your exercises and deliver your Todo lists!",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Encourage to finish their projects and exercises and to to ask questions (create a safe environment).",
                        "extended_instructions": "# Continue Todo list with React and Fetch\n\nThis project might be hard, take some time to review the questions from the students and go over any concept you feel that needs reinforcement.\n\n## Important concepts to reinfoce:\n\n- Props vs State\n- React Router (passing variables on the URL)\n- Context API\n- FLUX (action and store)"
                    },
                    {
                        "id": 19,
                        "label": "Star wars blog reading list",
                        "lessons": [
                            {
                                "slug": "routing-our-views-with-react-router",
                                "title": "Routing our Views with React Router"
                            }
                        ],
                        "project": {
                            "title": "Starwars blog reading list",
                            "instructions": "https://projects.breatheco.de/project/starwars-blog-reading-list"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students should continue with the project and prepare their questions for next class, encourage them to. Recomend them to read the lesson on \"How to make questions\".",
                        "position": 19,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-starwars-blog-reading-list",
                                "slug": "starwars-blog-reading-list",
                                "title": "Starwars blog reading list"
                            }
                        ],
                        "description": "This project is all about URLs and Routing. Each student must build two views/pages: One List and one Single. For example: List of Space Ships and a view for a single Space Ship. The have to make sure the URL's are propery setup on the reouter and also that the information is fetch on the didmount of the respectiv view. Also, you will be using the Context API for MVC (Store, View, Actions)",
                        "key-concepts": [
                            "Connecting components to URLs (routing)",
                            "Defining parameters on the URL path",
                            "Retrieving URL parameters with match.params",
                            "Using Props for components not connected directly to the <Route>",
                            "Redirecting history.push"
                        ],
                        "technologies": [],
                        "teacher_instructions": "You know exactly how to build small js apps, but what if your application will have several pages/views? E.g.: Having a 'Settings' page on the Spotify clone. We need to connect different URLs to our React Components. Welcome to the world of Routing.",
                        "extended_instructions": "# Using Context.API (with fetch)\n\n## Time for some motivation!\n\nIt is probable that students don't understand things entirely. The probably feel overwhelmed.\n\nGood encouragment ideas:\n\n- Today is the last class we are introducing new concepts for front end.\n- This is everything your need to succeed as a developer for the next 5 years.\n- The next time you will have to study so much, you will do it with a great sallary!!\n\n## `5 min` Take any questions about fetch.js or any other theorical concept.\n\n## `10 min` Review React.js and Fetch\n\n- React is about components (component names MUST be written in caps)\n- You build components by creating functions or classes (both MUST start in capital letters)\n- Review how to create a class vs functional component\n- The component objective is to create HTML.\n- You can pass props to compoentns `<Tag property={value}>`\n- You can persist those variables to the DOM using `this.setState`\n- API Calls (fetch) should be done on `componentDidMount`\n- Review how to code a fetch\n\n```js\nfetch('url/to/fetch', additionalSettings)\n    .then(resp => {\n        console.log(resp.ok); // will be tru if the response is successfull\n        console.log(resp.status); // the status code = 200 or code = 400 etc.\n        console.log(resp.text()); // will try return the exact result as string\n        return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results\n    })\n    .then(data => {\n        //here is were your code should start after the fetch finishes\n        console.log(data); //this will print on the console the exact object received from the server\n    })\n    .catch(error => {\n        //error handling\n        console.log(error);\n    })\n```\n\n# `20 min` Introduce FLUX\n\n- React created a way to share a store within the entire application.\n- Flux can be seen as an implementation of MVC on the front end side.\n- MVC = Model View Controller\n- Instead of Model View Controller here it is called: Model, View, Actions\n- The context-api will take care of propagating the store to all the views (re-render)\n\n![Context API](https://ucarecdn.com/051c4b0f-1c52-4cbe-a1b0-1d5fb074b8c4/)\n\n⚠️ Its a great idea to install the [react-hello-webapp boilerplate](https://github.com/4GeeksAcademy/react-hello-webapp) and show/explain the demonstration that comes with it.\n\nInstall it with the class.\n\n### The Views\n\n- The views are your components that you don't re-use, like `<AboutUs />` or `<Home />`.\n- You other componets are not called views because they are meant to be reused in several projects like: `<Card />`, `<Carousel />` or `<Navbar />`\n\n```jsx\n    //example render method accessin the store and actions\n    render(){\n\t\treturn <Context.Consumer>\n            {({ actions, store }) => {\n\t\t\t\treturn (\n\t\t\t\t    <ul>\n\t\t\t\t    {\n\t\t\t\t        store.favorites.map(f => \n\t\t\t\t            <li onClick={() => actions.someAction(f)}>\n\t\t\t\t                {f.name}\n\t\t\t\t            </li>\n\t\t\t\t        )\n\t\t\t\t    }\n\t\t\t\t    </ul>\n\t\t\t\t)\n\t\t\t}}\n\t\t</Context.Consumer>\n\t}\n```\n\n### The Actions\n\n- Actions are triggered by the views onClick, onMouseOver or any other event.\n- Actions have only two purposes: \n    - Call API's to update the database.  \n    - Update the store for any particular purpose (add, update, delete).\n- Examples of actions can be: login, createStudent, removeStudent, etc. Actions names should be descriptive about the business.\n\n```js\n\tconst addToFavorites = elm => {\n\t\tconst store = getStore();\n\t\tsetStore({ favorites: store.favorites.concat([elm]) });\n\t};\n```\n\n### The Store\n\nIts a container of information shared on your entire application:\n\n- You have to initilize the store with `null` or `[]` or `''` depending on your the data-type your are storing.\n- The biggest challenge on the store is modeling your data: What structures should y use? What is better to store like an array than an object?\n- You can access your store from your views in a read-only mode.\n\n```js\n\tlet exampleStoreObject = {\n\t    favorites: [\n\t        { name: 'Luke Sky Walker', age: 32 },\n\t        { name: 'Chiwawa', age: 12 },\n\t        ...\n\t    ]\n\t};\n```\n\n\n## `2 hr` Project Time!\n\nReact the instructions for the starwars blog and strategize with the students:\n\n- How many views are needed?\n- What components you should create?\n- What are the actions that will be coded?\n- What data-struture do we need for the store?"
                    },
                    {
                        "id": 20,
                        "label": "Star Wars blog - Live Coding ",
                        "lessons": [
                            {
                                "slug": "what-is-react-flux",
                                "title": "Learn What is React Flux"
                            },
                            {
                                "slug": "context-api",
                                "title": "Global state with the Context API"
                            }
                        ],
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 5816,
                        "homework": "Students must remember to read the next lesson before next class and they should finish all exercises and projects.",
                        "position": 20,
                        "assignments": [],
                        "description": "It's time for some real live coding! Ask all the questions you have prepared and wrap the last things about the Star Wars blog reading list because we are about to dive into an exiting journey inside the world of backend! :)",
                        "key-concepts": [
                            "Routing",
                            "Connecting components"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Do a live demonstration on how you would solve the Star Wars Blog project. Encourage students to ask questions. Help students finish the starwars blog and also any other previous exercises and project and publish them to github (be patient some of them may be overwhelmed)",
                        "extended_instructions": "# React Router \n\n## Time for some motivation!\n\nIt is probable that students don't understand things entirely. The probably feel overwhelmed. \nGood encouragement ideas:\n\n- Today is the last class we are introducing new concepts for the front end.\n- This is everything your need to succeed as a developer for the next 5 years.\n- The next time you will have to study so much, you will do it with a great sallary!!\n\n## `5 min` Take any questions about fetch.js or any other theorical concept.\n\n## `10 min` Review React.js and Fetch\n\n- React is about components (component names MUST be written in caps)\n- You build components by creating functions or classes (both MUST start in capital letters)\n- Review how to create a class vs functional component\n- The component objective is to create HTML.\n- You can pass props to compoentns `<Tag property={value}>`\n- You can persist those variables to the DOM using `this.setState`\n- API Calls (fetch) should be done on `componentDidMount`\n- Review how to code a fetch\n\n```js\nfetch('url/to/fetch', additionalSettings)\n    .then(resp => {\n        console.log(resp.ok); // will be tru if the response is successfull\n        console.log(resp.status); // the status code = 200 or code = 400 etc.\n        console.log(resp.text()); // will try return the exact result as string\n        return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results\n    })\n    .then(data => {\n        //here is were your code should start after the fetch finishes\n        console.log(data); //this will print on the console the exact object received from the server\n    })\n    .catch(error => {\n        //error handling\n        console.log(error);\n    })\n```\n\n# `20 min` Introduce React Router\n\n- Most applications have multiple views, or urls.\n- You don't want the server to take care of \"routing\", all traffic must be redirected to index.html\n- The fronn't end will take care of routing the URL path with a particular View (a react component)\n- Views are react components that you don't typically re-use, like: contact-us, about-us, home, dashboard, etc.\n- React Router is the most popular library to \"route\" in React.\n\n## How to route\n\n- You need to create a parent component that will be instanciated first and take care of routing.\n- That component must use `<BrowserRouter>` and several `<Route>`'s inside like this:\n\n```jsx\n<BrowserRouter>\n     <Switch>\n          <Route path=\"/home\"><AnyView /></Route>\n          <Route path=\"/Dashboard\"><AnyOtherView /></Route>\n     </Switch>\n</BrowserRouter>\n```\n\nNote: We also need a `<Switch>` because we only one to display one route at time.\n\n### Passing arguments between views using the querystring\n\n- HTTP has something call a `queryString` \n- QueryStrings are a way to pass more information to a URL like this: [google.com/?q=what is react router](google.com/?q=what%20is%20react%20router)\n\nAs you can see there is a question mark `?` at the end of the URL and then there is a variable `q` equal to `what is react router`.\n\nBasically you can tell google.com that you want to query for \"what is react router\" thru the querystring.\n\nThe query string always starts with a question mark and then you add unlimited variables and values separated by amperson `&`, for example:\n\n`https://www.google.com/search?q=what+is+react+router&start=20`\n\nIn this case we are passing two variables: `q` and `start`, we are telling google.com that we want to search for \"what is react router\" and we want to display from the result number 20 instead of 1, we are skipping the first 20 results.\n\n#### Retreiving the querystring\n\nYou can access the querystring from any react component like this:\n\n```jsx\nconst MyComponent = () => {\n    const urlParams = new URLSearchParams(window.location.search);\n    const q = urlParams.get('q');\n    const start = urlParams.get('start');\n\n    return <p>You want to query in google {q} starting from result {start}</p>\n}\n```\n\n### Passing arguments to views using params\n\nAside from the queryString there is another tool to pass information to views in react router, The Params.\n\n```jsx\n<BrowserRouter>\n     <Switch>\n          <Route path=\"/planets\"><AnyView /></Route>\n          <Route path=\"/single_planet/:planet_name\"><SinglePlanet /></Route>\n     </Switch>\n</BrowserRouter>\n```\n\nWe have two views in this example: `/planets` and `/single_planet/:planet_name`, the first one is going to render a list with all the planets in the solar system, the second one is going to display information about just ONE specific planet. At the end of the `/single_planet/:planet_name` URL you can see there is a color `:` like this: `:planet_name`, this means that `planet_name` will become a variable that will be replaced later with a value, for example:\n\n```txt\n/single_planet/earth\n/single_planet/mars\n/single_planet/neptune\n/single_planet/jupiter\n/single_planet/mercury\n```\n\nThe last part of that URL can vary with different planet_name's, and we can retrieve that information from the component view like this:\n\n```jsx\n\nimport { useParams } from \"react-router\";\n\nconst SinglePlanet = () => {\n    const { planet_name } = useParams();\n\n    return <p>You are displaying currently the planet {planetName}</p>\n}\n```\n\n## `2 hr` Project Time!\n\nReact the instructions for the starwars blog and strategize with the students:\n\n- How many views are needed?\n- What components you should create?\n- What are the actions that will be coded?\n- Today we don't care about the store or actions, lets focus on building the HTML views and the URL paths using react router."
                    },
                    {
                        "id": 21,
                        "label": "Work on SQL exercises",
                        "lessons": [
                            {
                                "slug": "what-is-sql-database",
                                "title": "Mastering Databases: What is SQL Database"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "url": "https://sqlbolt.com/",
                                "slug": "sql",
                                "title": "SQL Bolt Interactive"
                            }
                        ],
                        "homework": "Students must remember to read the next lesson before next class and should finish all their project and exercises.",
                        "position": 21,
                        "assignments": [],
                        "description": "Database engines are not related particular languages (like Python, PHP or Node) and they run on a different server than the website or application. For that reason and many others databases have their own language: SQL",
                        "key-concepts": [
                            "SQL table",
                            "Table relations: 1-1 1-N N-N",
                            "Metadata vs data",
                            "INSERT, UPDATE, DELETE",
                            "ALTER, DROP",
                            "Transactions",
                            "COMMIT, ROLLBACK, SAVEPOINT",
                            "CREATE"
                        ],
                        "technologies": [],
                        "teacher_instructions": "It is time to explain how SQL database work and how to write some SQL to interact with them, look at the full teacher instrutcions for more details",
                        "extended_instructions": "# First backend day! (Data-structures)\n\nThe front end is all about rendering and requesting for data.\nThe backend is all about databases/structures and responding the data.\n\nToday we are starting backend by going over all the previous exercises we have done and thinking about how the data was structured on those exercises.\n\n## Data structures\n\nDifferent Types of Data Structures (with examples):\n\n### Structuring with Primitive values\n\nThese are the most basic structures of data: Amost no structure, you cannot even have list of things.\n\n### Structuring with Arrays\n\nIs the first read structure we saw, its ideal to store lists of `anything`:\n\n```js\nlet todos = [];\n//add a task\ntodos.push(value);\n//remove a task\ntodos = task.filter(t => t != value);\n```\n\n### Object Literals\n\nThanks to object literals our tasks can now have status instead of just the task name.\n```js\nlet todos = [];\n//add a task\ntodos.push({\n    status: 'pending',\n    name: value\n});\n//remove a task\ntodos = task.filter(t => t.value != value);\n```\n\n### Classes (Object Orienetd)\n\nIts very formal, but thanks to classes now we can validate our task creation:\n\n```js\nclass TodoList{\n    constructor(){\n        this.tasks = [];\n    }\n    add(task){\n        if(valtaskue.status != 'pending' || task.status != 'done') throw new Error('The task status must be pending or done');\n        if(typeof task.name != 'string' || task.name == '') throw new Error('The task name must be a not empty string');\n        this.tasks.push(value);\n    }\n    remove(name){\n        this.tasks = this.tasks.filter(t => t.name != name);\n    }\n}\n\nlet todos = new TodoList();\n//now if you try adding a task with the wrong status if will give you an error\ntodos.add({\n    status: 'pending',\n    name: 'Make the bed'\n});\ntodos.remove('Make the bed');\n```\n\n## `5 min` Take 5 minutes to explain the difference beween data-structures and data-models\n\nYou can think about data-structures like he RAM Memory repersentation of data-models, for example:\n\n- Data structures are stuff like: Arrays, Queues (FIFO, FILO), Classes, etc.\n- Data models are ways of structuring the database.\n\nThe data-structure of your Reac.tjs projects will: The Store (RAM Memory).\nBut the data-model is only represented on the backend database.\n\n## `60min` Data Structuring Previous Projects\n\nStudents must discuss and finish recognizing the data structures use don previous projects.\n\n## `Rest of the class` Work on the SQL Exercises (the link is at the end of the lesson)."
                    },
                    {
                        "id": 22,
                        "label": "Building Starwars Data Model",
                        "lessons": [
                            {
                                "slug": "everything-you-need-to-start-using-sqlalchemy",
                                "title": "Everything you need to know about SQLAlchemy"
                            }
                        ],
                        "project": {
                            "title": "Building Instagram.com Database Model",
                            "instructions": "https://projects.breatheco.de/project/instagram-data-modeling"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 6413,
                        "homework": "Students must remember to read the next lesson before next class and finish their project.",
                        "position": 22,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-instagram-data-modeling",
                                "slug": "instagram-data-modeling",
                                "title": "Building Instagram.com Database Model"
                            }
                        ],
                        "description": "The backend its all about data, structures and databases. Let's review how to createt a database model.",
                        "key-concepts": [
                            "Why do we have to draw the database first?",
                            "It is hard to change the database in the middle of development",
                            "UML has become the standard for diagrams",
                            "SQL Alchemy is the most popular library for python database",
                            "Insstead of SQL we will use ORM's for 90% of our data needs",
                            "Databases have more data-types tha programming languages"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Take some time to go over how to model your data using Entity Relationship Diagram, use Intagram example with the entire class and then let the students do the Startwars Entity Relationship Diagram in groups of 2-3 students.",
                        "extended_instructions": "# Data Modeling whith UML\n\n## `5 min` Take 5 minutes to explain the difference between data-structures and data-models\n\nYou can think about data-structures like he RAM Memory repersentation of data-models, for example:\n\n- Data structures are stuff like: Arrays, Trees, Queues (FIFO, FILO), Classes, etc.\n- Data models are ways of structuring the database data.\n\nThe data-structure of your Reac.tjs projects will: The Store (RAM Memory).\nBut the data-model is only represented on the backend database.\n\n## `20 min` Today it is about: Data Modeling\n\n[This video](https://www.youtube.com/watch?v=UI6lqHOVHic&list=PLUoebdZqEHTxNC7hWPPwLsBmWI0KEhZOd) shows how to create a UML diagram, make students watch the video.\nExplain the basics of UML with a simple Car dealer example: Vehicle, Client, Purchase.\n\n- What are the possible data-types in a car dealer? Number, Boolean, String, etc.\n- What properties can a Vehicle, Client or Purchase have?\n- What are tthe relationships between the models (one-to-one, one-to-many, many-to-many)?\n    - How many Vehicles a Client can have?\n    - How many y Purchases a Client can do?\n    - How many Vehicles can a Purchase contain?\n\n## `2:30` Data-Modeling projects\n\nHelp students model the StarWars Blog using SQLAlchemy model diagram generator. Read the project instructions with them."
                    },
                    {
                        "id": 23,
                        "label": "Intro to Python",
                        "lessons": [
                            {
                                "slug": "backend-developer",
                                "title": "Knowing What is Behind a Back-End Developer"
                            },
                            {
                                "slug": "python-syntax",
                                "title": "Understanding Python Syntax"
                            },
                            {
                                "slug": "conditionals-in-programing-python",
                                "title": "Logical conditions in Python explained"
                            },
                            {
                                "slug": "what-is-a-python-list",
                                "title": "Working with Lists in Python"
                            },
                            {
                                "slug": "working-with-functions-python",
                                "title": "Working with Functions in Python"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "python-beginner-exercises",
                                "title": "Learn Python Interactively (beginner)"
                            },
                            {
                                "slug": "python-function-exercises",
                                "title": "Learn Python Functions Interactively"
                            },
                            {
                                "slug": "python-loops-lists-exercises",
                                "title": "Learn Python Loops and lists Interactively"
                            },
                            {
                                "slug": "master-python-exercises",
                                "title": "Master Python by practice (interactive)"
                            }
                        ],
                        "scrollY": 7004,
                        "homework": "Students must remember to read the next lesson before next class and they must finish the all replits and projects.",
                        "position": 23,
                        "assignments": [],
                        "description": "The backend side of the web is all about creating API's for data storing and processing; and integrating with 3rd party API's. The first step of that process is storing the information.",
                        "key-concepts": [
                            "Different types of Data Structures (with examples)",
                            "Object vs Array",
                            "calculated properties like age",
                            "lamda function"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Now that students finished the data-model for the StarWars blog its time they dive into python, start explaining the difference between back-end and front-end, all the things you could do with Python backends, then go over the syntax differences between python and javascript and what thi",
                        "extended_instructions": "# Introduction to Python\n\nStudents only know about JS and the Browser, today is important they understand:\n\n- That backend programs have access to the entire computer (not just the browser).\n- Backend programs don't need to bundle or use webpack.\n- Backend programs are compiled into C++ and Assembly.\n\n## Python Introduction\n\n- Show students how you can just create a file.py and run it using the command line `$ python file.py`\n- Compare javascript with python: `console.log` vs `print`\n- How variables work and what are de datatypes\n- Looping with python (for and foreach, loop, while loop)\n- Python dictionaries are like javascript objects but we call them dictionaries and they use `[` instead of `.` to access keys, for example:  `person['name']` instead of `person.name`.\n\n## Take the rest of the class for python exercises\n"
                    },
                    {
                        "id": 24,
                        "label": "Flask API",
                        "lessons": [],
                        "project": {
                            "title": "Todo List API with Python Flask Interactive",
                            "instructions": "https://projects.breatheco.de/project/python-flask-api-tutorial"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 8498,
                        "homework": "",
                        "position": 24,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/python-flask-api-tutorial",
                                "slug": "python-flask-api-tutorial",
                                "title": "Todo List API with Python Flask Interactive"
                            }
                        ],
                        "description": "The back-end side has almost no limitations, you have access to the entire computer, printers or anything you need. Your life as a back-end developer will start by doing API's because it is the most needed skill in the market. We really hope you like it as much as we do!",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Explain API concepts and how to build an API using flask, follow with the students the interactive Flask tutorial and explain the sample API that comes with it (Todo List API), then ask the students to build the API for the Star Wars blog they already coded on the front-end.",
                        "extended_instructions": "## Building an API with Flask\n\n## `10min` Intro to backend API's\n\n- Go over HTTP, request vs response.\n- Open postman and review with students how to create requests with postman:\n     1. How to choose your method GET, PUT, POST, DELETE\n     2. How to set the URL\n    3. How to set the content-type JSON\n    4. where to look for the response\n- Postman will be our main way to test our API until we have a front-end.\n- The two most important API frameworks in Python are Django and Flask.\n- Flask is increasing in popularity because is meant for microservices and that it's very lightweight.\n\n### What is a server?\n\n- A server is just a script that waits for requests, it never ends.\n- When a server receives a request it maps the request with a function that we call the \"request handler\".\n- Basically building an API is mapping a bunch of endpoints with functions. One endpoint ==> One function\n\n```py\n@app.route('/')\ndef hello_world():\n    return 'Hello, World!'\n```\n\nExplain the rest of the process on building an API:  \nhttps://content.breatheco.de/en/lesson/building-apis-with-python-flask\n\n## `1hr` Follow the Interactive Flask API Tutorial\n\nHave the class work on following the API tutorial with Flask (todo list).\n\n## `1:30min` Start the StarWars with the class\n\n- The academy is providing documentation for the Flask Boilerplate here: [start.4geeksacademy.com](https://start.4geeksacademy.com)\n- Explain the backend boilerplate before starting the project\n- The models.py (based on the database diagram)\n- Where to add your endpoints\n- How to communicate between Python and your database using SQLAlchemy:\n   - How to query information.\n   - How to add, delete and update new records.\n- Build the first endpoint with the class\n- How to test your endpoints with postman\n\nThe class must continue working on the API until next day (homework)\n\n\n\n\n"
                    },
                    {
                        "id": 25,
                        "label": "Data-Structure",
                        "lessons": [],
                        "project": {
                            "title": "Family Static API with Flask",
                            "instructions": "https://projects.breatheco.de/project/family-static-api"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 8576,
                        "homework": "Students must finish python exercises and pending projects.",
                        "position": 25,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-family-static-api",
                                "slug": "family-static-api",
                                "title": "Family Static API with Flask"
                            }
                        ],
                        "description": "Lets keep working on the backend and get more familiar with Python's dictionaries, lists and the lamdba function",
                        "key-concepts": [
                            "Python has dictionaries instead of literal objects",
                            "Python has lambda instead of arrow functions",
                            "Python has lists and tuples instead of arrays",
                            "Explain how to map an array with lambda"
                        ],
                        "technologies": [
                            {
                                "slug": "queue",
                                "title": "queue"
                            },
                            {
                                "slug": "python",
                                "title": "python"
                            },
                            {
                                "slug": "pytest",
                                "title": "Pytest"
                            },
                            {
                                "slug": "flask",
                                "title": "flask"
                            }
                        ],
                        "teacher_instructions": "This lesson is about data-structures + API. We are trying to make students use a class/data-structure to build the API around it. Lets build another API but now using more complicated data-structures on the Backend",
                        "extended_instructions": "# Data-Structures and Family Tree\n\nToday's objective is to start introducing students with the concept of data-structures:\n\n- These are [the available python data-structures](https://github.com/breatheco-de/content/blob/master/src/assets/images/data-structures-python.png?raw=true).\n- Mainly divided in primitive and non-primitive.\n- We already know all primitives and some of the non-primitives.\n- Today we focus on the Tree.\n\n## About Tree's (data-structure)\n\n- Tree are not sequential data-structures like the arrays or lists.\n- Trees only have connections between its nodes (items) thru parent->chid links.\n- Trees are useful to represent things with hierarchies like the computer file structure, or organizational charts or families.\n\n## Work with the students on the project\n\nWe are doing another API to continue practicing Flask but without a database model, only ram memory.\nUse dictonaries and try representing a Tree structure (you cannot have all the family members in one array, you must use parent->child connectors.\n\n"
                    },
                    {
                        "id": 26,
                        "label": "Contact List",
                        "lessons": [
                            {
                                "slug": "building-apis-with-python-flask",
                                "title": "Building RESTful API's using Flask"
                            }
                        ],
                        "project": {
                            "title": "Contact List API",
                            "instructions": "https://projects.breatheco.de/project/contact-list-api"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 7117,
                        "homework": "",
                        "position": 26,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-contact-list-api",
                                "slug": "contact-list-api",
                                "title": "Contact List API",
                                "mandatory": true
                            }
                        ],
                        "description": "",
                        "key-concepts": [
                            "Python has access to the entire machine",
                            "Python has packages just like NPM but it is calles Pipenv",
                            "The pipfile is like the package.json",
                            "Flask is the most popular Python Framework",
                            "workflow for creating and enpoint in Flask (same MVC pattern but now on the backend)",
                            "Flask easily works with SQLAlchemy (models.py)",
                            "what is serialization (jsonify)"
                        ],
                        "technologies": [],
                        "teacher_instructions": "One more API, now we are doing a whole contact book application with user login and \"contacts\" that the user can manage. This is the final project simulation, follow the same method that you would do in the final project: Data-Model first, then endpoints, then authentication (in the next class) then integrate with front-end.",
                        "extended_instructions": "## Building an API with Flask\n\n## `10min` Intro to backend API's\n\n- Go over HTTP, request vs response.\n- Open postman and review with students how to create requests with postman:\n     1. How to choose your method GET, PUT, POST, DELETE\n     2. How to set the URL\n    3. How to set the content-type JSON\n    4. where to look for the response\n- Postman will be our main way to test our API until we have a front-end.\n- The two most important API frameworks in Python are Django and Flask.\n- Flask is increasing in popularity because is meant for microservices and that it's very lightweight.\n\n### What is a server?\n\n- A server is just a script that waits for requests, it never ends.\n- When a server receives a request it maps the request with a function that we call the \"request handler\".\n- Basically building an API is mapping a bunch of endpoints with functions. One endpoint ==> One function\n\n```py\n@app.route('/')\ndef hello_world():\n    return 'Hello, World!'\n```\n\nExplain the rest of the process on building an API:  \nhttps://content.breatheco.de/en/lesson/building-apis-with-python-flask\n\n## `1hr` Follow the Interactive Flask API Tutorial\n\nHave the class work on following the API tutorial with Flask (todo list).\n\n## `1:30min` Start the StarWars with the class\n\n- The academy is providing documentation for the Flask Boilerplate here: [start.4geeksacademy.com](https://start.4geeksacademy.com)\n- Explain the backend boilerplate before starting the project\n- The models.py (based on the database diagram)\n- Where to add your endpoints\n- How to communicate between Python and your database using SQLAlchemy:\n   - How to query information.\n   - How to add, delete and update new records.\n- Build the first endpoint with the class\n- How to test your endpoints with postman\n\nThe class must continue working on the API until next day (homework)\n\n\n\n\n"
                    },
                    {
                        "id": 27,
                        "label": "Authentication JWT",
                        "lessons": [
                            {
                                "slug": "token-based-api-authentication",
                                "title": "Token Based Authentication in your API"
                            },
                            {
                                "slug": "what-is-JWT-and-how-to-implement-with-Flask",
                                "title": "Understanding JWT and how to implement a simple JWT with Flask"
                            }
                        ],
                        "project": {
                            "title": "Authentication system with Python Flask and React.js",
                            "instructions": "https://projects.breatheco.de/project/jwt-authentication-with-flask-react"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 7656,
                        "homework": "",
                        "position": 27,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/jwt-authentication-with-flask-react",
                                "slug": "jwt-authentication-with-flask-react",
                                "title": "Authentication system with Python Flask and React.js",
                                "mandatory": true
                            }
                        ],
                        "description": "Almost every application in the world has an authentication system, usually, you choose a username and password and those become your \"credentials\", you use them every time you want to identify yourself.\nTody we learn how to implement an authentication system using Tokens and JWT, one of the most modern standards for token based API Authentication.",
                        "key-concepts": [
                            "What is a Token",
                            "Token Based Authentication",
                            "What is a session",
                            "HTTP has no sessions",
                            "The Auth Token travels on the headers (usually)",
                            "API's have private and public endpoints",
                            "Every request to a private method must contain the Authorization Header",
                            "Types of Authentication (JWT, Bearer, Basic, etc.)",
                            "Benefits of JWT (no token storate)",
                            "How to use Postman",
                            "How to send authenticated request in postman",
                            "About the authorization header"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Explain how authentication works, what is a hash, and how HTTP has no persistent session and we need to generate tokens to simulate the concept of a session, show the documentation of the JWT Extended and help students implement it on their StarWars blog to save favorites on their user account.",
                        "extended_instructions": "## Authentication\n\n- Start with explaning how HTTP works: request vs response\n- We have done request anonymously during the entire course, its time to include authentication in our requests.\n- Every request must be \"signed\" to be able to execute.\n- There are many ways to sign requests, usually you do it by appending a unique number (hash/token) that only the authenticated user should know.\n- Usually authentication information travels on the header of the request.\n- If authentication is invalid the server must returns status code 401 (invalid auth) or 403 (missing auth info).\n- What is a token? A unique number that represents the \"session\".\n- How big is the token? Enough to be unique for everyone else.\n\n## Go over the lessons with the student\n\nTake some time to scroll through the lessons and review each of the concepts.\n\n## Use postman to demonstrate an authentication:\n\n  - Start with login (wrong and success credentials)\n  - Append the header token to the request.\n  - What is the response code we are getting?\n  - What happens if I add the wrong headers or token? What status code?\n\n## Documentation for JWT Extended\n\n- Show students the documentation for the [JWT Extended package](https://flask-jwt-extended.readthedocs.io/en/stable/basic_usage/).\n- Help students understand how to read a documentation.\n  - What to look first? The quickstart?\n  - How many weekly downloads the package has?\n  - How actively maintained it is?\n  - Are there a lot of pending issues?\n  - Has anyone else tried the package?\n- Write on the board the 4 steps to implement it: \n\n## Allow students to implement the login and protected routs on the API\n\nAsk students to follow the documentation steps on their own and ask for questions.\n\n## Front-end:\n\n- Implementing the fetch function to post `/token` and get a new token.\n- Storing the token on the localStorage\n- Appending the token to the fetch headers on every private request \n\n## The Startwars API should have authentication for next class\n"
                    },
                    {
                        "id": 28,
                        "label": " Front-Back integration",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 9649,
                        "homework": "",
                        "position": 28,
                        "assignments": [],
                        "description": "Let's finish all of our pending projects and exercises.",
                        "key-concepts": [
                            "Async/Await",
                            "Insomnia",
                            "Postman"
                        ],
                        "technologies": [],
                        "teacher_instructions": "The last day to finish the Contact list project.",
                        "extended_instructions": "Work with students on finishing pending projects."
                    },
                    {
                        "id": 30,
                        "label": "User Stories ",
                        "lessons": [
                            {
                                "slug": "user-stories-examples",
                                "title": "Creating User Stories: Learn with User Stories Examples"
                            },
                            {
                                "slug": "agile-development",
                                "title": "Intro to Professional and Agile Development"
                            }
                        ],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must finish the user stories by next class, remember that the student projects must meet certain conditions to be accepted.",
                        "position": 29,
                        "assignments": [],
                        "description": "Time to start the Final project! Lets review how software is built today, you'll learn and follow the same methods used by the top tech companies in the world",
                        "key-concepts": [
                            "What is a Kanban board and how does it work",
                            "How to use Github's kanban automated board",
                            "Adding an issue per user story",
                            "Writting stories from the user's point of view",
                            "Acceptance criteria",
                            "Your application scope: roles and capabilities",
                            "Standup meeting"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Time to start the Final project! Let's give the students a break and dive into User Stories and the SCRUM methodology. Students must pick their projects & partner, and start building the user stories using Github Project. Create a project with them.",
                        "extended_instructions": "# Time To Start the Final Project\n\nWe are going to use github for SCRUM project management, that way students get more green points on the activity graph and they get more familiar with github.\n\n## `10min` Creating user stories\n\nThis video is great about user stories: https://www.youtube.com/watch?v=LGeDZmrWwsw\nThis is the lesson: http://content.breatheco.de/lesson/user-stories-examples\n\n- Don't undermine stories: 70% of the projects fail because the requirements are not clear enough.\n- User stories have to be worded on the user point of view.\n- They need to have a clear **Acceptance Criteria**.\n- You application roles & capabilities, make sure the stories involve them: `as a students I would like to sort my lessons by difficulty`\n- SPRINT: Its a coding iteration (Every week maybe?) from start to finish: Write the stories -> Prioritize -> Code -> Test -> Deliver.\n- Velocity: How many points are being delivered per sprint.\n- SCRUM Meeting: Its when the team strategizes and plans a new sprint: decides what features are going to be included into the sprint.\n- Standup Meeting: Every day, the group gathers for 10 minutes and answers 2 questions:\n    1. Are you stuck?\n    2. What do you need from me?\n\n## `10min` Using Github for Agile: Issues and Projects\n\n- There are plenty of agile methodologies but we decided to use Kanban as it is one of the most popular ones.\n- Explain github issues and how you can create one issue for eavery feature/bug/problem/etc.\n- Github issues can connect to github projects automatically.\n- Create a github project with the students: What is a Kanban board and how does it work: 4 Columns (Backlog, Selected for Development, In Progress, Done).\n- How to use Github's kanban automated board: Issues will automatically opened and closed.\n\n## `20min` Students must pick their final project\n\n- Have a brainstorming on the project, here are some examples:\n    1. Doing an SMS based todo list application.\n    2. Doing a real-time polling platform like pollanywhere: https://www.polleverywhere.com/\n    3. Doing a Markdown editor to take notes and save them in the cloud.\n    4. Doing a detting platform where games can bet on anyone playing a video game.\n    5. Online store.\n- Once you ahve teams and ideas ready the teams must gather up and one of each team must create their repository.\n- Each team must start adding github issues with their user stories.\n\n## `2:20min` Build project stories\n\nStudents must work in group with their teams to finish the first batch of user stories and wireframes and publish them into github.\n\n"
                    },
                    {
                        "id": 31,
                        "label": "UI/UX and MOCKUPS",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Sit with every project team and discuss how to split the code into Views vs Components, students must finish their project home layout by next class.",
                        "position": 30,
                        "assignments": [],
                        "description": "Today you will be coding your final project HTML Views and making them React Views",
                        "key-concepts": [
                            "Reinforce the Minimum Viable Product concept",
                            "Students should not get excited about npm packages, use only a handfull",
                            "Using React-Strap is a great idea to save some time"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Continue working on the final project but now start building the React Views, use the FLUX boilerplate with the students and start organizing eveyrthing from Layout.jsx",
                        "extended_instructions": "# Help Students Start coding their React Views\n\nToday we should start coding the final project, but first:\n\n## `20min` Final Review to Project Requirements\n\n- Students have a clear idea on what they will be developing: User stories and Wireframes almost done.\n- Make sure they have a small project, its hard to finish a project with more than 3-4 views.\n- Make sure also that their database is small (3-5 tables at the most) or it will be imposible to finish.\n- Sit down with each group and give your feedback.\n\n## `20min` Help students setup the project code\n\n- Start the boilerplate with them.\n- Make sure they understand the Layour.js and are able to add their routes.\n- Make sure they know how to add styles.\n- Make sure they have properly planned their components and views and are ready to start coding the wireframe si very good for that).\n\n## `2:20min` Students start coding their views\n\nLets students start coding, help with one-on-one mentorships.\n\n\n\n"
                    },
                    {
                        "id": 32,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must deliver the first views of their projects.",
                        "position": 31,
                        "assignments": [],
                        "description": "Keep working on your final project final HTML/CSS and React Views. Link them together as a prototype and be ready to start the backend side of the web.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Work with students to complete the HTML/CSS, React Views and Components. Make sure they are on their way to complete a 'Prototype' that is close to the front-end side of their projects.",
                        "extended_instructions": "# Coach students on their development\n\nIt is the first time students code a big project, they are probably making lots of mistakes, they have probably ugly designs or maybe they don;t event know what they are doing.\n\n## Sit with each team separately and help them with the following:\n\n#### Were to look for mistakes\n\n- The overcomplicate things.\n- They spend too much time on non-important stuff.\n- They use libraries that don't work.\n- They want to add so many features to their projects that they forget its going to be impossible to finish.\n\n#### Were to look for bad UX/UI designs:\n\n- Use a maximum of 3 colors on your projects.\n- Use bootstrap components all the way: Reactstrap or Materialize is a great recomendation.\n- Someone form the team should focus on little details a lot, like a full time job.\n\n### Make sure they are following SCRUM\n\n- Are they using github project?\n- Are they moving the ard in the Kanban board?"
                    },
                    {
                        "id": 33,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students (in groups) must create a 4 page website (Home, Blog, Product, Checkout-Cart) using React Router.",
                        "position": 32,
                        "assignments": [],
                        "description": "Please work hard with your team on completing your front-end views, this will be the last font-end only day and we will start building your Project API next class.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Help students to finish their prototype, make sure it follows best practices and unstuck them on any problems they may encounter.",
                        "extended_instructions": "# Repeat last class coaching session again with every student\n\nIt is the first time students code a big project, they are probably making lots of mistakes, they have probably ugly designs or maybe they don;t event know what they are doing.\n\n## Sit with each team separately and help them with the following:\n\n#### Were to look for mistakes\n\n- The overcomplicate things.\n- They spend too much time on non-important stuff.\n- They use libraries that don't work.\n- They want to add so many features to their projects that they forget its going to be impossible to finish.\n\n#### Were to look for bad UX/UI designs:\n\n- Use a maximum of 3 colors on your projects.\n- Use bootstrap components all the way: Reactstrap or Materialize is a great recomendation.\n- Someone form the team should focus on little details a lot, like a full time job.\n\n### Make sure they are following SCRUM\n\n- Are they using github project?\n- Are they moving the ard in the Kanban board?"
                    },
                    {
                        "id": 34,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 33,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "",
                        "extended_instructions": "# Repeat last class coaching session again with every student\n\nIt is the first time students code a big project, they are probably making lots of mistakes, they have probably ugly designs or maybe they don;t event know what they are doing.\n\n## Sit with each team separately and help them with the following:\n\n#### Were to look for mistakes\n\n- The overcomplicate things.\n- They spend too much time on non-important stuff.\n- They use libraries that don't work.\n- They want to add so many features to their projects that they forget its going to be impossible to finish.\n\n#### Were to look for bad UX/UI designs:\n\n- Use a maximum of 3 colors on your projects.\n- Use bootstrap components all the way: Reactstrap or Materialize is a great recomendation.\n- Someone form the team should focus on little details a lot, like a full time job.\n\n### Make sure they are following SCRUM\n\n- Are they using github project?\n- Are they moving the ard in the Kanban board?"
                    },
                    {
                        "id": 35,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 34,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 36,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 35,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 37,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 36,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 38,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 37,
                        "assignments": [],
                        "description": "You have built 2 different API's using python already, it is time to start working on your own. Start by building your UML diagram and setting up the repository.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Time to start working on your final project backend"
                    },
                    {
                        "id": 39,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 38,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 40,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 39,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 41,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 40,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 42,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 41,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 43,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 42,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 44,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 43,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 45,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 44,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 46,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 45,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 47,
                        "label": "",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 46,
                        "assignments": [],
                        "description": "",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": ""
                    },
                    {
                        "id": 48,
                        "label": "Final presentation rehersal",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 47,
                        "assignments": [],
                        "description": "A great way of rehearsing is by presenting the final project to your classmates",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Create a 'rehersal day' and let the students present the project to their classmates."
                    },
                    {
                        "id": 49,
                        "label": "Pitch day",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "",
                        "position": 48,
                        "assignments": [],
                        "description": "You have worked a lot during these weeks, it's time to present the final project and enjoy with your family and friends!",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Answer any question students may have,"
                    }
                ],
                "slug": "full-stack",
                "label": "Full Stack PT",
                "profile": "full-stack",
                "version": 5,
                "description": "",
                "academy_author": "4"
            },
            "version": 5,
            "updated_at": "2021-09-14T23:33:08.701137Z",
            "created_at": "2021-09-14T23:33:08.701112Z",
            "slug": "full-stack",
            "name": "Full-Stack Software Developer",
            "syllabus": 41,
            "duration_in_hours": 320,
            "duration_in_days": 48,
            "week_hours": 9,
            "github_url": null,
            "logo": "https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack",
            "private": false
        }
    ]

     ).as('cohort_edit_version')
  }); 

  Cypress.Commands.add('cohort_edit_new_version', () => {
    // the data of the new cohort so can be edit
    cy.intercept('GET', '**/admissions/syllabus/web-development/version', 

    [
        {
            "json": {
                "days": [
                    {
                        "id": 1,
                        "label": "HTTP/HTML/CSS",
                        "lessons": [
                            {
                                "slug": "intro-to-prework",
                                "title": "Introduction to the pre-work"
                            },
                            {
                                "slug": "what-is-the-internet",
                                "title": "Internet Architecture"
                            },
                            {
                                "slug": "what-is-html-learn-html",
                                "title": "Learn HTML"
                            },
                            {
                                "slug": "what-is-css-learn-css",
                                "title": "Learn CSS"
                            }
                        ],
                        "project": {
                            "title": "Build a Digital Postcard with HTML/CSS",
                            "instructions": "https://projects.breatheco.de/project/postcard"
                        },
                        "quizzes": [
                            {
                                "slug": "intro-to-prework",
                                "title": "About the Prework"
                            },
                            {
                                "slug": "html",
                                "title": "Basics of HTML"
                            }
                        ],
                        "replits": [
                            {
                                "slug": "html",
                                "title": "Learn HTML"
                            },
                            {
                                "slug": "css",
                                "title": "Learn CSS"
                            }
                        ],
                        "scrollY": 0,
                        "homework": "The students must finish the Postcard on their own (there is a video-tutorial)",
                        "position": 1,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-postcard",
                                "slug": "postcard",
                                "title": "Build a Digital Postcard with HTML/CSS"
                            }
                        ],
                        "description": "Welcome to web development: At the beginning there was only HTML, years later CSS appeared, and that's how the web 1.0 came to life",
                        "instructions": "You have 30 min to explain how HTTP works sending-receiving text between servers & clients, how the browsers interpret that text as HTML, CSS or JS and then start coding. Start the postcard HTML on the screen and students should finishe it. Use float layout pursposes instead of display inline-block.",
                        "key-concepts": [
                            "Client vs Server",
                            "HTTP Request vs Response",
                            "Everything is text!",
                            "Browser Interpretation",
                            "Indentation",
                            "HTML is similar to Word: Headings, paragraphs, etc",
                            "HTML vs CSS",
                            "Always Be Closing",
                            "CSS Selectors (basic ones)"
                        ],
                        "technologies": [
                            "HTML5",
                            "CSS"
                        ],
                        "teacher_instructions": "You have 30 min to explain how HTTP works sending-receiving text between servers & clients, how the browsers interpret that text as HTML, CSS or JS and then start coding. Start the postcard HTML on the screen and students should finishe it. Use float layout pursposes instead of display inline-block.",
                        "extended_instructions": "# Day 1 - Web Development\n\n1. Present the academy and team (3min).\n2. Students present itself (5min).\n3. Sign informal agreement (3min).\n\n4. Make sure everyone is on gitpod and explain gitpod (10min).  \n\n- What is a workspace.\n- Install the gitpod plugin.\n- How to run the HTML boilerplate.\n\n5. Introduce them to BreatheCode:  \n\n- How to login, see your, your todos, etc.\n- How to create a new project using the boilerplates.\n- How to deliver an assignment.\n    \n6. Master-class about The internet, HTTP, and HTML (20min).\n7. Students code the postcard HTML (45min).\n8. Master-class about CSS (10min).\n9. Students code the postcard CSS (45min).\n\n##### Present the academy\n\n- 6pm Small Presentation\n- Who we are: Each teacher presents itself.\n- Get everyone to introduce themselves:\n```\nFirst name and last\n1. What would you like to be called?\n2. What do you do now? (for work)\n3. What do you plan on doing when you become a developer?\n```\n\n##### Master Class\n \n**Client vs Server**  \nExplain how for student to access Google, their website is hosted on another computer called a “Server” that they own.  \nThe student would have to communicate from their local computer (called a “client”), to get the website from the server so they can view and use it.\n\n**HTTP Request vs Response**  \nThe method used for this communication is called HTTP, which stands for Hyper Text Transfer Protocol.  \nThe way that you get the website is by sending a “Request” to the server. This tells the server what website or resource you are looking to view/use. The server then responds with the information.  \nThe server then sends a response, which tells will confirm the receipt of the request and let your computer know that it will begin sending data. (second day content)  \nThis back and forth process will continue with more Request=>Response pairs until you have finished loading your remote resource. (in this case, Google – second day content)\n\n**Everything is text!**  \nWith HTTP, it’s important to focus on the first ‘T’ in the acronym, which stands for ‘Text’. In this protocol, everything is sent back and forth as TEXT.  \nWhile there are other protocols out there, for now, we want to remember that with HTTP – Everything is TEXT.\n\n**Browser Interpretation**  \nAfter your browser uses the HTTP protocol and receives the data as text, it then has the job of interpreting that text and converting it to the correct visual format. (What do you think that text is converted into? Open your cheat sheet for HTML and guess. Images, tables, videos, animations, etc)\n\n**HTML vs CSS**  \nSo that the developers that made Google (or any other website) can create the experience you know and love, they have to use certain languages. The three most commonly used ones in front end are HTML, CSS, and Javascript.  \nHTML is like the framework for any website. It’s good to think of it as a house. If you are building a house, you need a foundation and a frame before you build walls and make everything pretty.   \nAfter you use the HTML to make that framework, you can make the website pretty by using CSS.  \n\n**Always Be Closing and Indentation Matters**  \nWhen you start coding today, everything is going to be done in blocks of code. Each block is self contained so you always have the same flow with creating one.  \nFirst you open the block, then you close the block. In 4geeks,we have a saying for this `“ALWAYS BE CLOSING”`.   \nLet’s take a look at a typical block of HTML (setup a `<head>` `<body>` and `<p>` on the board)  \nNotice there is a start and end to the block. These opening and closing statements are called **“Tags”**.  \nEach statement of a code document also has it’s own indentation, so that it is more legible to any developers that review your code. This is VERY important as you always want your coding to be understandable by other people working on projects with you.  \nNow, to get acquainted with this a bit, were going to try an exercise.  \n\n> Have students open and start the postcard with HTML only, no CSS) \n>\n> Here is where they start coding the html of the postcard for 45 min, everyone should be able to finish the html before starting with the css.\n \n \n**CSS Selectors (basic ones)**\nNow that you have created your first project in HTML, you have to consider the styling that will be needed.  \nAs we discussed before, the HTML provides all of the elements on the page, but the CSS is what gives those elements size, color, position, and even transitions or animations.  \n\n**Let’s talk about how CSS works.**  \nCSS allows you to set the properties we just mentioned (like size and color) by targeting that element.  \nThe targeting occurs by using something called Selectors, which are basically the syntax that you use to define what you are targeting.  \n```\nSome basic selectors are: ID, CLASS, and ELEMENT  \n```\nCSS formatting is always done as follows:\n```selector { property: value; }```\n`ID` is something that you can set up on an HTML tag that UNIQUELY identifies that specific tag (whether it’s a Paragraph, Div, or Section)\n`ID` is a property of the element\nThis is done by adding the property `id=”name”` for example:\n```html\n<div id=”myDiv”>\n```\nWhen you have defined it in your HTML, the targeting in your CSS would be: `#myDiv`  \nThe `#` (hash/octothorpe) tells the interpreter that you are targeting an `ID`  \nClass is similar to ID, in that, it helps to identify the specific element but it is NOT Unique  \n\n**Class is a property of the element**  \nAn element can have many classes or not  \nSimilar to ID, you would add `class=”name”`, for example: \n```html\n<div class=”row”>\n```\nElement is just as it sounds.  \nEach type of tag that you use in your HTML has an Element Selector in CSS.  \nYou don’t need a special property in your html for this as it’s a broad range selector, meaning that when used alone it will select all of that element type.  \nAn example would be div elements. To select all divs in css, you would just use the div selector:\n```css\ndiv { \n    //some css rule here\n}  \n```\nIn CSS, selectors can be combined to enhance the specificity of your targeting. Rule of thumb goes that the more specific CSS will take precedence.  "
                    },
                    {
                        "id": 2,
                        "label": "Layouts",
                        "lessons": [
                            {
                                "slug": "css-layouts",
                                "title": "Doing Layouts"
                            },
                            {
                                "slug": "mastering-css-selectors",
                                "title": "Advanced CSS Selectors"
                            }
                        ],
                        "project": {
                            "title": "Simple Instagram Photo Feed with HTML/CSS",
                            "instructions": "https://projects.breatheco.de/project/instagram-feed"
                        },
                        "quizzes": [
                            {
                                "slug": "internet-architecture",
                                "title": "Internet Architecture"
                            },
                            {
                                "slug": "css",
                                "title": "Basics of CSS"
                            }
                        ],
                        "replits": [
                            {
                                "slug": "layouts",
                                "title": "Doing Layouts"
                            }
                        ],
                        "scrollY": 469,
                        "homework": "Students must finish the Instagram & the Postcard.",
                        "position": 2,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-instagram-feed",
                                "slug": "instagram-feed",
                                "title": "Simple Instagram Photo Feed with HTML/CSS"
                            },
                            {
                                "url": "https://github.com/breatheco-de/exercise-instagram-post",
                                "slug": "instagram-post",
                                "title": "Instagram Post"
                            }
                        ],
                        "description": "Then, websites got popular and CSS evolved to enable amazing layouts with boxes and also a ritch set of CSS Selectors",
                        "instructions": "Connecting CSS & HTML: Finish the postcard and start the Instagram Feed. Review all the key concepts with your students.",
                        "key-concepts": [
                            "Do not use ID as CSS selectors (use specificity)",
                            "::Before & ::After Selectors",
                            "DRY Technique",
                            "Box Model"
                        ],
                        "technologies": [
                            "CSS3",
                            "HTML5"
                        ],
                        "teacher_instructions": "Connecting CSS & HTML: Finish the postcard and start the Instagram Feed. Review all the key concepts with your students.",
                        "extended_instructions": "# Day 2 - Web Development\n\nWelcome everyone and ask how many got around to the reading.\nMake sure everyone has access to BreatheCode platform and also to the replit exercises.\nGet feedback about repl’it from those using it already.\n \nQuick Recap of previous day with additional points about Request/Response. (10-15 min)\n \n***Mention that when they get to the repl’it for HTML tables and CSS, they will see how some elements have properties for color and border, which is how the web was styled before CSS.***\n \n## Lecture `(20min)`\n \n1. Do not use ID as CSS selectors (use specificity)\n  * As we discussed previously, CSS utilizes Specificity for targeting.\n  * When we talked about ID and Class selectors, I mentioned that in most cases it’s better to use classes because they are reusable.\n  * Try to avoid ID selectors unless you absolutely need them. It’s possible to achieve the same effect as an ID selector by using specificity.\n  * If you google “css specificity calculator”, you can find tools that help you to calculate specificity of your selectors, but you shouldn’t need them if you understand the basic rules.\n  * Review how specificity works. \n    1. Combine selectors to get more specific about which element you are styling\n    2. w3schools breaks down specificity hierarchy in this order (from greatest to least specific):\n      * Inline styles - An inline style is attached directly to the element to be styled.\n      \n        For Example: \n        ```html \n        <h1 style=\"color: #ffffff;\">\n        ```\n      * IDs - An ID is a unique identifier for the page elements, such as #navbar.\n      * Classes, attributes and pseudo-classes - This category includes .classes, [attributes] and pseudo-classes such as :hover, :focus etc.\n      * Elements and pseudo-elements - This category includes element names and pseudo-elements, such as h1, div, :before and :after.\n      * You can read more about specificity on breathco.de\n2. Before & ::After Selectors\n  * Help to insert content or styling before or after an element\n  * This is really helpful as it allows you to do cool things like create interesting block quote effects. You can add giant quotation marks or symbols.\n3. DRY Technique\n  * Ask if anyone remembers what we said DRY Programming means?\n  * Don’t repeat yourself\n  * Everything must have a single representation, don’t repeat elements unnecessarily. (example: reusable classes instead of same property repeated over and over)\n  * A good example of this would be, if I was going to apply a color blue to 5 parts of the site, I could add the ```color: blue;```\n   property to every area of my CSS, or the better practice is to... \n    1. Create a class that will apply the blue color and attach it to the items that need it. \n    2. Or, Create a multi-part css statement. Multiple selectors that are comma separated to target several specific elements.\n    For Example:  ```.myHeader, .myFooter, .contentDiv { color: blue; }```\n      * This is the best of the two and you should get use to it as it will save you tons of lines of code and make your code way more legible.\n      * Conversely, you may think it’s funny that they call the opposite of DRY -  WET programming, which they have given the following titles to:  \"write everything twice\", \"we enjoy typing\" or \"waste everyone's time\"\n4. Box Model\n  * In our first class, we touched on this a bit, but didn’t give it a formal title. \n  * Box layout means that all elements can be thought of as boxes. In our first assignment, we thought of all divs as content boxes that held other things in them (like russian nesting dolls)\n  * However, each element has a box too\n  * There are 4 main parts to the typical box model: (draw the following on the board or show picture from breathcode)\n    * Content - this is what is inside the box\n    * Padding - this is spacing between the border and content (inside box also)\n    * Border - this is the edge of the box\n    * Margin - this is spacing between the outside of the box and the next element over in any direction. (which could be the edge of the page, another div, a paragraph, or even an image. )\n  * You can also have a background color or image, this will show in the content area of your box.\n  * Additionally, you have properties that are important to your elements such as: width and height, display, position, etc.\n    * Width and height - talk about the dimensions of the box\n    * Display - talks about whether an element is visible or not, also refers to how it can be positioned in relation to other objects\n      * Block - sits on it’s own line (takes up whole width)\n      * Inline - can sit next to other elements (works like a span)\n      * there are tons of others so you will have to read up to understand them all, but those are the two main ones\n      \n> 💡 Recommend that students go over the CSS and HTML cheat sheets that we have available on the breathco.de platform under Assets. \n\n\n## Start next project `(2:30min)`\n\nStart the project with the students, show them how to plan your by drowing the boxes first.\n\n![HTML/CSS Strategy](https://github.com/breatheco-de/exercise-instagram-feed/blob/master/strategy.png?raw=true)\n \nExplain that all projects will have to be delivered by next week using the breathecode platform.\n \nAnswer any questions.\n \nAt end of class, remind them to finish the the postcard with CSS and simple instagram.\n \nEncourage them to use the Chat or to DM me on slack. Work on the Reading ahead of each class and do the Repl’its, THEY HELP!"
                    },
                    {
                        "id": 3,
                        "label": "Command Line",
                        "lessons": [
                            {
                                "slug": "the-command-line-the-terminal",
                                "title": "The Command Line"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "the-command-line",
                                "title": "Command Line Interactive Challenge"
                            }
                        ],
                        "scrollY": 748,
                        "homework": "At the end of the class, present the students with the GIT project & please ask each student to start coding its corresponding part of the website.",
                        "position": 3,
                        "assignments": [],
                        "description": "A text editor and the console, that's all you need to be a great coder. Time to master the second one.",
                        "instructions": "Teach the command line to your students, use the CMD challenge to make it very fun! Start with a small explanation about the importance of the CMD and then explain each command after its respective challenge is completed.",
                        "key-concepts": [
                            "Most used CMD commands",
                            "File Directory Hierarchy",
                            "Relative ./ vs Absolute Paths ",
                            "Moving Up ..",
                            "Autocomplete with TAB",
                            "GIT in a general way"
                        ],
                        "technologies": [
                            "Command Line",
                            "Bash Scripts"
                        ],
                        "teacher_instructions": "Teach the command line to your students, use the CMD challenge to make it very fun! Start with a small explanation about the importance of the CMD and then explain each command after its respective challenge is completed.",
                        "extended_instructions": "\n Check if students were able to finish the previous projects, answer questions and encourage them to finish.\n \n ## `10 min` Small theory about the command line (do not explain the commands)\n\n```md\n⚠ ️IMPORTANT:\nPlease don't explain every command, it is better if during the challenge the students find the commands in google or in the breathecode lesson.\n\nStudents can do searches like: \"How to get into a computer directory\", etc.\nForce them to start searching in google!!\n```\n\n- Computers can be entirely managed without a windows interface, you can do everything from the command line.\n- Make sure to make students understand how important the command line (developers use it every day all the time and it is impossible to avoid).\n- Relative path vs absolute path.\n- Explain that we are in Gitpod, which uses ubuntu and we have to familiarize we the ubuntu command line.\n- Talk about the file hierarchy and how is represented in the command line, what the dot  .  and double dot  ..  represents. Draw on the board a file hierarchy and show if at the same time how the command line shows it (compare both).\n- Explain the use of the autocomplete command: [using tab one time for autocomplete or two times to show options](https://www.howtogeek.com/195207/use-tab-completion-to-type-commands-faster-on-any-operating-system/).\n- This is a [very good series of videos](https://www.youtube.com/watch?v=AO0jzD1hpXc&t=267s&index=8&list=PL8A83A276F0D85E70) explaining the command line that students can **watch later.**\n- Share this [cheat sheet with the most used commands.](https://ucarecdn.com/61c6474b-5760-43db-9a2c-dfbea2ccdd76/Comandlinecheatsheet.pdf)\n\n## `1:20 hr` Start The CMD Challenge\n\n- Have students create a project in Gitpod\n- Help them to clone the repo for the project (paste it in the slack channel so they can use the link)**\n    1. git init\n    2. git clone\n- Run the react presentation\n\n```md\n📝 The command line will make students practice the most important commands, explain each command after the each challenge is completed, the student that successfully completed it can explain to other students.\n```\n\n## `1:30min` Take some time the class explaining git in a general way\n\nGit will be the first applicacion we will be using inside the command line, students must read about it and wat videos about it.\n\n### What is git?\n\nGit is an online, central code storage that allows developers to manage a code base in teams.\n\nSome of the things you can do with git include:\n\n1. You can collaborate on projects easily\n2. see a history of revisions\n3. Roll back to previous versions if a revision fails (version control)\n4. Resolve code conflicts so that 2 developers don’t overwrite each other’s code.\n\nGit is a necessity to any developer working today as it’s resolved many of the issues of working on a team or keeping version history on a project.\n\n## For Next Class\n\nNext class we will review GIT in more detail. If you haven’t already, please read the lesson on GIT in the breatheco.de platform.**"
                    },
                    {
                        "id": 4,
                        "label": "Github",
                        "lessons": [
                            {
                                "slug": "learn-in-public",
                                "title": "Learn in Public"
                            },
                            {
                                "slug": "how-to-use-git-version-control-system",
                                "title": "How to use GIT: Version Control System"
                            }
                        ],
                        "project": {
                            "title": "Fix the Misspell Challenge",
                            "instructions": "https://projects.breatheco.de/project/fix-the-misspell"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Stundents should finish their project and remember to read the next lesson before next class.",
                        "position": 4,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/the-misspell-chalenge",
                                "slug": "fix-the-misspell",
                                "title": "Fix the Misspell Challenge"
                            },
                            {
                                "url": "https://github.com/4GeeksAcademy/learn-in-public",
                                "slug": "learn-in-public",
                                "title": "Learn in Public"
                            }
                        ],
                        "description": "Github is an amazing social network for developers, let's learn how to collaborate and contribute while coding.",
                        "key-concepts": [
                            "Do not explain Git with SSH credentials  in detail, students must use HTTP",
                            "Why using Github?",
                            "It will be impossible to avoid using Github",
                            "Commit object",
                            "The HEAD",
                            "The stage",
                            "Branch",
                            "How to switch branches",
                            "Commit vs Push",
                            "Pull vs Fetch",
                            "Resolving Conflicts"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Start explaining Github as a social network, how it stores 90% of the world's codebase, how you can review all major coding projects, follow the most influential developers, and the role of open source.\n\nThen explain GIT without being very technical, the \"Github for poets\" video does a great explanation, we will get more technical the next class that we will collaborate on building a landing page.",
                        "extended_instructions": "# Welcome to Github\n\n**Welcome everyone, Check if they were able to finish all the lessons, exercises, and projects up till now.**\n\n### Explaining Github\n\n1. As we mentioned in previous classes, Github & Git have become a staple of every development workflow.\n\n2. You will use this in EVERY development job you have from here forward.\n\n3. Show the main profile screen and explain parts\n\n    - Use [https://github.com/gaearon](https://github.com/gaearon) as example.\n    - Explain about the github activity graph, how github tracks your entire activity and other developers and recruiters can see it\n\n\n4. Explain how to create a repository\n\n    - click repository tab > new repo button > fill out data\n\n5. Show what a repository looks like\n\n   - explain the contents of the repository and the importance of the Readme file in a project.\n   - Show popular repositories like react, vue, flask, etc. Show them the README files.\n   - show [the git collaboration readme](https://github.com/breatheco-de/exercise-collaborative-html-website) as an example \n\n## The role of open-source\n\n- Explain about open source, how the most important projects in the coding world are open source like: Chrome, Windows, React, Pyhton, Flask, Django, etc.\n\n- In the open source world anyone can pull request anything, there are maintainers that review and approve changes.\n- 4Geeks Academy syllabus is open source and you can Pull Request (lessons and projects)\n\n\n## `1 hr` Project: Fixing Misspells as the perfect Open Source Ice-Breaker\n\nShow students how every lesson on breathecode has the github logo on the top, and you can contrute or fix any lesson by clicking on the github logo and then editing the lesson file on github.\n    \nCreate repositories for all previous workspaces and upload all your code to their corresponding repo’s. Then submit the assignments on your student.breatheco.de  **(DUE MONDAY). Also, work on all repl’its and get caught up. Be ready for the next class which is on Wireframing and design process.**\n\n## `1hr` The student External Profile\n\nEncourage students to do their first pull request with the student external profile: [sep.4geeksacademy.co](https://sep.4geeksacademy.co)"
                    },
                    {
                        "id": 5,
                        "label": "Forms",
                        "lessons": [
                            {
                                "slug": "html-input-html-textarea",
                                "title": "Understanding HTML Input HTML Text Area and Forms..."
                            }
                        ],
                        "project": {
                            "title": "Create a HTML5 form",
                            "instructions": "https://projects.breatheco.de/project/html5-form"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "forms",
                                "title": "Practice HTML5 Forms"
                            }
                        ],
                        "homework": "",
                        "position": 5,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-html5-form",
                                "slug": "html5-form",
                                "title": "Create a HTML5 form"
                            }
                        ],
                        "description": "Forms are responsible for user interactions, they are the first way the internet had to send request to the backend and saving on databases. It's time to learn the most basic way of interacting with backend applications.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Explain how HTML forms work, how to use the most important inputs, and prevent errors with things like \"required\" or being very specific with the input types."
                    },
                    {
                        "id": 6,
                        "label": "Bootstrap",
                        "lessons": [
                            {
                                "slug": "bootstrap-tutorial-of-bootstrap-4",
                                "title": "Working with Bootstrap"
                            }
                        ],
                        "project": {
                            "title": "Instagram Photo Feed with Bootstrap",
                            "instructions": "https://projects.breatheco.de/project/instagram-feed-bootstrap"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "bootstrap",
                                "title": "Working with Bootstrap"
                            }
                        ],
                        "scrollY": 517,
                        "homework": "",
                        "position": 6,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-instagram-feed-bootstrap",
                                "slug": "instagram-feed-bootstrap",
                                "title": "Instagram Photo Feed with Bootstrap"
                            }
                        ],
                        "description": "Then, Bootstrap came to profesionalize websites, removing 99% of the layout pain. Everything is a component from now own.",
                        "instructions": "Explain bootstrap and how it solves 99% of the pain. Everything is a component from now own.",
                        "key-concepts": [
                            "Bootstrap",
                            "Components",
                            "Workflow: Identify the components, Copy&Paste them and finally customize them",
                            "Helper/Utility Classes that come with bootstrap",
                            "Explain Layout (grid layout, rows/columns, responsiveness)"
                        ],
                        "technologies": [
                            "Bootstrap"
                        ],
                        "teacher_instructions": "Explain bootstrap and how it solves 99% of the pain. Everything is a component from now own.",
                        "extended_instructions": "\n\nWelcome everyone, see how the weekend went.\n  * How many got to code Saturday at the downtown campus?\n  * How many worked on the exercises?\n  * Did everyone finish the 2 projects? (postcard and simple Instagram)\n\nToday we are going to review Bootstrap which is going to completely simplify your life as a developer.\n***(Total time: 20 min-25min)***\n\n1. Bootstrap (open the breatheco.de lesson on Bootstrap - day 3)\n  * So what is Bootstrap? We touched on this a bit last class, but Bootstrap is a framework that was developed to simplify front end design/development.\n  * It has tons of components to simplify the process of styling your elements.\n  * Each component is built around classes that they have constructed, which you will include in your html projects.\n  * The biggest take away will be that with Bootstrap, you will have most of the baseline css work done for you and all that will be left is tweaking elements to your unique needs. This removes the heavy lifting in CSS.\n    * Let’s take a look at their website really quick and see what I mean. (open the bootstrap website)\n2. Components\n  * Navbar\n    * this is an example of a really useful component that will be in almost every project you create.\n    * every site needs a navigation, and Navbar allows you to create either simple or complex navigation effortlessly.\n  * Card\n    * Ask students: If you think about your instagram project, What can you visualize having represented as a card?\n      * Answer: Each of the picture/text combos are perfect representations of a card.\n    * Cards are really easy ways to represent data in a nice visual format by combining a picture and text.\n  * Modal\n    * This element isn’t purely css. It will require Javascript to make it work.\n    * Modals are kind of like pop-ups in that they overlay all elements on the page and display some data. They have many uses and can give a super polished look to a project when used correctly.\n    * Let’s look at an example: https://getbootstrap.com/docs/4.0/components/modal/#live-demo\n3. Here is your basic Workflow with Bootstrap Components:  (assuming you have your design already planned)\n  * Identify the components you will need.\n    * visit the site, search through components and find what you will need.\n  * Copy & Paste the element into your code in the specific area it is needed\n    * For example, if you have a Navbar, it will typically be the top of your page.\n    * So within the body, but either in a section or div that you created to house your header is where you will paste the code.\n  * and finally customize the component for your specific design\n    * This is where the fun stuff comes in.\n    * Bootstrap takes the guesswork out of the beginning and allows you to “bootstrap” or spin up a project quickly.\n    * However, once you have the project created, you need to customize each component using CSS to make it unique to your specific design.\n      * Adjust colors\n      * maybe decide between rounded or rectangle buttons\n      * Possibly slight adjustments to form elements, etc.\n    * This is where you will use all of the awesome CSS skills you have been practicing.\n4. Helper/Utility Classes that come with bootstrap\n  * So, in addition to the components, bootstrap also adds helper classes.\n  * These are classes you can attach that do things such as control margin or padding, control borders, or even float elements.\n  * For example, if you wanted no margin on the left of the element, you can add the class ```ml-0``` to the element and it will set the left margin to zero.\n5. Now that you understand how these components and helper classes work and what they do for your projects, it’s time to review the most important part of what bootstrap does for you.\n  * Layout using Grid system\n    1. Explain 12 column layout and how it works\n        * every line is a Row\n        * this row holds columns\n        * every Row on a page has 12 columns\n        * each column has its own spacing between (gutters)\n        * columns are equally measured in percentages so that they are responsive.\n    2. When you build layouts, you specify how the columns will react at each screen size.\n        * the sizes are determined by breakpoints which are defined in bootstrap (you can read these on the documentation)\n        * the basic sizes are: col, col-xs, col-sm, col-md, col-lg, col-xl\n        * To see these breakpoints and their corresponding sizes, check out the bootstrap layout documentation and scroll to the section on “grid”\n6. One more thing I want to touch on is Fonts.\n  * Bootstrap doesn’t set font size on HTML (which is the common practice for the documents base size)\n  * It assumes a base font size of 16px (which is the browser standard) and specifies a starting value of 1rem on the body.\n  * This allows all fonts to scale up relative to that size. It is recommended in responsive design to use rem units for fonts because the scale in respect to the base document font\n  * You will want to familiarize yourself with measurement differences between EM, REM, and PX.\n    * PX = pixel measure and is a standard measure used on base sizes (doesn’t not change with resize of browser; fixed size)\n    * EM = is a measurement that is relevant to the parent (Ex. parent font = 20px, child font = 1.5em = 30px)\n    * REM = is the same as EM, except it’s relative to the base document font (set on html in your css). As mentioned earlier, if you don’t override this, the base font is usually 16px.\n\nHave class work on bootstrap instagram.\n\nAnswer any questions. Remind them this project is due by Friday."
                    },
                    {
                        "id": 7,
                        "label": "Git Workfow",
                        "lessons": [
                            {
                                "slug": "how-to-use-git-version-control-system",
                                "title": "GIT (Version Control System)"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "git",
                                "title": "Git interactive tutorial"
                            }
                        ],
                        "homework": "At the end of the class, present the students with the GIT project & please ask each student to start coding its corresponding part of the Landing Page. Suggested parts: navbar, jumbotron, 2 parts description, product showcase, marketing banner, contact us, footer",
                        "position": 7,
                        "assignments": [],
                        "description": "The CMD Line has millions of tools, it's time to learn the first ones: GIT & Github, together they make collaboration amazing!",
                        "instructions": "Time to explain and practice with GIT in detail, create a repository for your Landing Page GIT proyect and make them clone it and upload their piece of the proyect. Review the key concepts.",
                        "key-concepts": [
                            "Creating SSH Keys",
                            "Using Github",
                            "The Commit Object",
                            "The HEAD",
                            "The Stage",
                            "Branch",
                            "Git FLOW (profesional branching)",
                            "Commit vs PUSH",
                            "Resolving Conflicts"
                        ],
                        "technologies": [
                            "Git",
                            "Github",
                            "Markdown"
                        ],
                        "teacher_instructions": "Time to explain and practice with GIT in detail, create a repository for your Landing Page GIT proyect and make them clone it and upload their piece of the proyect. Review the key concepts."
                    },
                    {
                        "id": 8,
                        "label": "Intro to JS",
                        "lessons": [
                            {
                                "slug": "what-is-javascript-learn-to-code-in-javascript",
                                "title": "Learning to code with JS"
                            },
                            {
                                "slug": "conditionals-in-programing-coding",
                                "title": "Conditionals in Programming or Coding"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "js-beginner",
                                "title": "Introduction to JS"
                            }
                        ],
                        "homework": "Students need to finish the Excuse Generator, make the replits about javascript and the layout for the Random Card Generator",
                        "position": 8,
                        "assignments": [],
                        "description": "HTML & CSS are great, but the world needed interactive pages (not just beautiful text documents). Javascript comes to help us generate HTML & CSS based after the initial text document has already loaded and also re-write the website live based on the user activity.",
                        "instructions": "Begin the class by having students push their changes to the repo, then view the project with the class. The excuse generator is a great way to explain how Javascript and HTML/CSS can play together. Do it with the students as you explain all the programing Key Concepts. Use the VanilaJS boilerplate, that way students will start getting used to it",
                        "key-concepts": [
                            "Variables",
                            "DataTypes",
                            "Arrays",
                            "Functions (anonymus vs normal)",
                            "forEach vs Map Statement",
                            "array.filter",
                            "Every javascript code starts OnLoad",
                            "String Concatenation"
                        ],
                        "technologies": [
                            "Javascript",
                            "HTML5",
                            "CSS3",
                            "Bootstrap",
                            "Transitions"
                        ],
                        "teacher_instructions": "Begin the class by having students push their changes to the repo, then view the project with the class. The excuse generator is a great way to explain how Javascript and HTML/CSS can play together. Do it with the students as you explain all the programing Key Concepts. Use the VanilaJS boilerplate, that way students will start getting used to it"
                    },
                    {
                        "id": 9,
                        "label": "Excuse Generator",
                        "lessons": [
                            {
                                "slug": "working-with-functions",
                                "title": "Working with Functions"
                            }
                        ],
                        "project": {
                            "title": "Code an Excuse Generator in Javascript",
                            "instructions": "https://projects.breatheco.de/project/excuse-generator"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "url": "https://github.com/4GeeksAcademy/javascript-functions-exercises-tutorial",
                                "slug": "javascript-functions-exercises-tutorial",
                                "title": "Practice Javascript Functions Tutorial"
                            }
                        ],
                        "scrollY": 2734,
                        "homework": "",
                        "position": 9,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/tutorial-project-excuse-generator-javascript",
                                "slug": "excuse-generator",
                                "title": "Code an Excuse Generator in Javascript"
                            }
                        ],
                        "description": "The only way to master coding is thru practice, today we'll show you how practice must be done, and we hope you continue practicing on your own time.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Coding Practice Day: Students take turns on the screen, one at a time, one student share the screen and tries completing the exercise, and the others help, every student must go around at least two times. Stop the class and explain JS concepts when needed.",
                        "extended_instructions": "# Exercise Day\n\nExplain to the students how they learnpack exercises work:\n\nThere are 4 main exercises: Begin JS, Arrays, Functions, and Mastering Javascript, and they are supposed to be done in parallel because they share the same concepts E.g: You need to know about strings to know about functions because you probably will use a string within a function.\n\n1. They can start any series of exercises by clicking on the gitpod button in GitHub (using the gitpod extensions)\n2. Once the exercise engine is loaded and the exercises are running they can click \"next\" for each exercise.\n3. If the engine is down the can type `learnpack start` to restart the engine.\n\nThey have to complete all exercises by the end of the Bootcamp and repeat some of them if possible, particularly the \"arrays\" exercises.\n\n## Start Practicing\n\nOpen the begin js exercises and have the class take turns on the screen to complete each exercise during the 3 hours.\n\nNote: You can stop the class anytime and explain a javascript concept if you see they need to re-enforce the concept."
                    },
                    {
                        "id": 10,
                        "label": "Arrays & Loops",
                        "lessons": [
                            {
                                "slug": "what-is-an-array-define-array",
                                "title": "It's Time To Learn What is an Array"
                            }
                        ],
                        "project": {
                            "title": "Domain Name Generator",
                            "instructions": "https://projects.breatheco.de/project/domain-generator"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "url": "https://github.com/4GeeksAcademy/javascript-arrays-exercises-tutorial",
                                "slug": "javascript-array-loops-exercises",
                                "title": "Learn Javascript Arrays and Loops Interactive"
                            }
                        ],
                        "scrollY": 3214,
                        "homework": "",
                        "position": 10,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-domain-generator",
                                "slug": "domain-generator",
                                "title": "Domain Name Generator"
                            }
                        ],
                        "description": "Primitive values like numbers and strings are the most basic way of storing information, but sometimes you want to store more than one value when they are related to each other, for example; A list of student names. For that we have Arrays. The first, most simple and most used data structure in Javascript.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Go over javascript quickly and all the concepts, focus particularly on arrays now. Explain the concept thoroughly and then allow students to complete the exercises by taking turns on sharing the screen.",
                        "extended_instructions": "# Looping and Arrays\n\nWelcome class.\n\n## `1 min` Remind students of the importance of finishing the JS exercises\n\nStudents should be focused on completing those exercises: Begin JS, Loops, Arrays, Functions, and optionally Mastering JS.\nRemind students that reading will do no help, this phase is about practice, practice, and more practice.\n\n## `15 min` Review last class and everything about javascript that we have seen\n\n- We started generating HTML Strings for the first time, that is the developer's ultimate goal.\n- Data Types, Variables, and Arrays.\n- Algorithms run from top to bottom, line by line.\n- You can skip lines with conditionals, repeat lines with loops, and reuse lines with functions.\n- Arrays have items (or values) and index (or position), they start at 0. And you can get the length with `myArray.length`.\n- Concatenate strings using + and the new amazing type of quotes '`' that is easier for creating big dynamic strings.\n\n## `10 min` Talk about looping: with and without arrays (for vs foreach).\n\n- The main objective for a loop is to repeat a bunch of lines of code from the opening curly brace to the closing curly brace.\n- There are several ways of looping but we will focus mainly in the `for` loop for now.\n- Here is a 12min video explaining [all the different ways of looping](https://www.youtube.com/watch?v=U3ZlQSOcOI0).\n- You can add elements to an array with `push`.\n\n## `10 min` Talk more in detail about functions\n\n- Functions are the last thing to learn about basic algorithms (encouragement).\n- You create a function when you find yourself doing the same thing all over.\n- Function's purpose is to receive an input and return an output.\n- The function stops executing after returning.\n- Functions SHOULD USE VARIABLES declared outside of them (best practice).\n- Anonymus function vs normal function.\n- In javascript, we will only use arrow functions (no the original type of function) because they are more similar to other programming languages functions.\n\n## Start completing the Arrays Exercises with the students\n\nOne student at a time sharing the screen to complete the exercise, the teachers help students when they see them going in the wrong direction, its like Peer Programming but there are a lot of navigators and just one driver."
                    },
                    {
                        "id": 11,
                        "label": "Unit Testing",
                        "lessons": [
                            {
                                "slug": "how-to-create-unit-testing-with-Javascript-and-Jest",
                                "title": "How to create unit testing with JEST"
                            }
                        ],
                        "project": {
                            "title": "Your first unit tests with Javascript's Jest Framework",
                            "instructions": "https://projects.breatheco.de/project/unit-test-with-jest"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 3205,
                        "homework": "",
                        "position": 11,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-unit-test-with-jest",
                                "slug": "unit-test-with-jest",
                                "title": "Your first unit tests with Javascript's Jest Framework"
                            }
                        ],
                        "description": "Quality Assurance is one of the most valued skills in big tech major companies, today we are learning how you can write code that tests your previously written code in an automated way. Welcome to unit testing!",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Explain how unit testing works with a very simple example (sum function) and then show the students how the exercises are auto-graded with unite tests, open one of the simplest JS exercises, and show how the tests work. Then start with today's project.",
                        "extended_instructions": "# Practice Day (replits and projects)\n\n## `5 min` Take any questions about javascript\n\nRemind everyone that the all the replits about Javascript are extremelly important, the only way to become better is practicing.\n\n## `10 min` Last review about JS (really fast)\n\n- Everything starts on the window.onload\n- A non declared variable value is `undefined` (this will help them read the console errors)\n- If you forget to return, the function will return `undefined` (this will help them read the console errors)\n- Our main purpose for a front-end coder is to **generate dynamic HTML and CSS**, you will be using algorithms to do so (the need to understand that for better react.js learning curve)\n- All ways of looping are important, including the `for` loop because its the only one with total freedom and we not only loop arrays, we also loop for other reasons.\n- Map vs Foreach: In react we will map all the time because it creates a new array and that is really important.\n- Functions goal is: Receive an input and return and output. The execution stops after returning.\n- What is `myArray.find` and `myArray.filter`. In React we will use them all the time.\n\n## `2 hours` Last Repl.it/Project Intensive before The DOM!!\n\n☢ 😰 🤯 ️Students are overwhelmed!\n\nThis is the most delicate part of the course, there is a **lot of risk on students droping**. Please make sure all of them do lots of replits today.\nDo not teach new concepts!\n\n💡 Tell students that today the MUST ask questions after 5 min of being stuck, They cannot try on their own for 30 minutes before asking, not today.\nThey will have planty of challenges to keep learning on their own tomorrow.\n\n## `45 min` before the class finished, do the student exernal profile with them:\n    - Breafly explain open source and why its important, examples of great software build like that.\n    - Explain that developers like to collaborate in open source and why its important for them.\n    - Pull Request are the best mechanism for collaboration because you don't need permission to push.\n    - Students are required to do a real collaboration to a real open source project by the end of the class to an open source project.\n    - Talk about the importance of having green dots on your github activity graph.\n    - Explain YML breafly.\n    - Help them do they YML file and push a draft of their profile (don't worry about content, just structure).\n    - Once they do their PR they can see their live profile because we are [automatically merging](https://mergify.io/) and deploying.\n    - If the automatic merge does not occur, its probably because their YML has syntax problem, you can review the travis execution log on the pull request details.\n\nNote: They students don't have to worry about the content, today its just about the YML and making it work and show up on the [student list](http://sep.4geeksacademy.co/students/).\n\n5. After their `Student External Profile` is done, they may continue doing replits and finishing their previous projects."
                    },
                    {
                        "id": 12,
                        "label": "Master JS",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [
                            {
                                "url": "https://github.com/4GeeksAcademy/master-javascript-programming-exercises",
                                "slug": "master-javascript-exercises",
                                "title": "Master Javascript with 150 exercises"
                            }
                        ],
                        "homework": "",
                        "position": 12,
                        "assignments": [],
                        "description": "You have a lot of things to catch up on, finish and deliver. Make sure to review all of your assignments. Use your time wisely and ask for questions!...",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Help students finish the pending exercises and projects, students that are up to date can start mastering javascript exercises."
                    },
                    {
                        "id": 13,
                        "label": "The DOM",
                        "lessons": [
                            {
                                "slug": "what-is-front-end-development",
                                "title": "Introduction to Front-End Web Development"
                            },
                            {
                                "slug": "what-is-webpack",
                                "title": "Bundeling with Webpack"
                            },
                            {
                                "slug": "what-is-dom-define-dom",
                                "title": "The DOM"
                            },
                            {
                                "slug": "event-driven-programming",
                                "title": "Events"
                            }
                        ],
                        "project": {
                            "title": "Random Card Generator",
                            "instructions": "https://projects.breatheco.de/project/random-card"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "the-dom",
                                "title": "The DOM"
                            },
                            {
                                "slug": "events",
                                "title": "Events"
                            }
                        ],
                        "homework": "Finish the Random Card and pending replits, start DOM & EVENTS replits",
                        "position": 13,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-random-card",
                                "slug": "random-card",
                                "title": "Random Card Generator"
                            }
                        ],
                        "description": "Ok but how do we use Javascript to build websites? You have to interact with the DOM whenever an event occurs",
                        "instructions": "Do the Random Card but focusing a lot on the workflow (how to plan and begin coding), re-inforce the ONLOAD and PRE-LOAD main events and how to change CSS with JS, make students do the 'Map Of Events' to strategize, start using the breathecode-cli and vanilla-js ",
                        "key-concepts": [
                            "Always use Arrow Functions, never normal functions",
                            "Never use var, always let or const",
                            "Main website events: PreLoad & OnLoad",
                            "The-Runtime (after onload)",
                            "Introduce the DOM",
                            "Use querySelector() to select DOM Elements just like you do with CSS",
                            "Add/Remove CSS Classes to DOM elements",
                            "Please do not attempt to explain the Webpack Config.",
                            "Bundling JS, CSS & Images.",
                            "Include your bundle on index.html"
                        ],
                        "technologies": [
                            "The DOM",
                            "Events",
                            "CSS",
                            "CSS Transitions"
                        ],
                        "teacher_instructions": "Do the Random Card but focusing a lot on the workflow (how to plan and begin coding), re-inforce the ONLOAD and PRE-LOAD main events and how to change CSS with JS, make students do the 'Map Of Events' to strategize, start using the breathecode-cli and vanilla-js "
                    },
                    {
                        "id": 14,
                        "label": "DOM Catch Up",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 4088,
                        "homework": "",
                        "position": 14,
                        "assignments": [],
                        "description": "Work on your current projects and exercises.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Keep practicing DOM with the students.",
                        "extended_instructions": "## Answer questions\n\nThe first 15min of the class are ideal to answer questions while the students connect.\n\n## `10 min` Review the DOM again\n\n- Once the browser recieves the server response it starts building The DOM until `window.onload` gets triggered.\n- The DOM is a LIVE hierarchy that represents the HTML document.\n- The DOM its not the same as the source code, the source code will be the first version of the DOM ants its quickly overriten by the LIVE changes.\n- Draw a DOM example on the whiteboard vs a its corresponding HTML code.\n- Show on the browser the google inspector with the DOM opened (the elements tab).\n- Show how it changes live based on the user/system activity clicks/mouseover/etc.\n- The `querySelector` and `querySelectorAll` will be our main way to use The DOM, the other methods are deprecated: getElementById, byTagName, etc.\n- Once you select DOM element and store it on a variable you can change any of its properties: Styles, Classes, Values, etc. ANY PROPERTY!\n- Code on the google inspector console a small 2 line script showing a querySelector and changing a style:\n- \n```js  \nconst anyDOMElement = document.querySelector(‘.anyClass’);\n//changing a background\nanyDOMElement.style.backgroundColor = ‘black’;\n//adding a class\nanyDOMElement.addClass('d-none');\nanyDOMElement.removeClass('d-none');\n// inner html\nanyDOMElement.innerHTML = \"html string that will be included inside the selector\"\n```\n\n## `20 min` Reinforce what is webpack and the vanilla js boilerplate\n\n1. Explain how to start using the boilerplate.\n2. Show students that the README.md has everything they need to start coding.\n3. Show how to see errors on the terminal.\n4. Show how to see errors on the INSPECTOR.\n\n## `20` Strategize the project!\n\nReact instructions carefully with students and plan a strategy!\n\n- Start strategizing the HTML/CSS.\n- After having one hard coded card and suite, how can you change it dynamically?: \n    - Approach A: Dynamically changing the card css classes. E.g: havin a class `card` and 4 classes `diamons`, `club`, `spade` and `heart`.\n    - Approach B: Using `domElement.styles.color = 'red';` instead of using classes.\n- Use the whiteboard with the students.\n- Every student must participate.\n\n## `2:20` Code the project\n\nOnce the strategy is clear in written down, help students implement it.\n\n## Ask students to finish replits about the DOM."
                    },
                    {
                        "id": 15,
                        "label": "Cond. Profile",
                        "lessons": [],
                        "project": {
                            "title": "Conditional Profile Card Generator",
                            "instructions": "https://projects.breatheco.de/project/conditional-profile-card"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 4873,
                        "homework": "",
                        "position": 15,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-conditional-profile-card",
                                "slug": "conditional-profile-card",
                                "title": "Conditional Profile Card Generator"
                            }
                        ],
                        "description": "What we call \"thinking\" is basically the process of making decisions based on some information (variables) that we have available. You can replicate the same behavior in a computer by using conditionals and logical operations.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Ask students to gather and create a flow chart on the whiteboard with the decision process behind building the html for the profile card project. Finish conditional profile card and all previous exercises. ",
                        "extended_instructions": "## Conditionally Rendering\n\n1. Rendering means printing or displaying.\n2. In HTTP you can only print text, it can be an HTML Text, CSS Text, JSON Text, Javascript Test.\n3. Basically it means generating strings dynamically.\n4. Conditional rendering is what makes your website interactive.\n\n\n### There are 2 ways of writing conditions:  \n\nUsing the `if....else`  statement.  \n\n```js\nlet canDrive = false;\nif(age > 16){\n    // do something\n    canDrive = true;\n}\nelse{\n    canDrive = false;\n}\n```\nOr using a ternary (the most popular for conditional rendering):\n\n```js\nlet canDrive = (age > 16) ? true : false;\n```\nNote: as you can see the ternary is smaller, it's a great and agile resource.\n\n## What is conditional rendering?\n\nIt means using conditions to generate HTML dynamically. Basically, your HTML will be different depending on certain **conditions** that you determine.\n\nFor example, using the same condition before:\n```js\nlet canDrive = (age > 16) ? \"can\" : \"cannot\";\nlet myHTML = 'I ' + canDrive + \" drive\";\n\n// myHTML will be either \"I can drive\" or \"I cannot drive\"\n```\n\nWith the javascript template literrals is even easier to generate strings dynamically.\n\n```js\n\nlet person = {\n    name: \"Alejandro\",\n    age: 17\n}\nlet myHTML = `\n    <div>\n          <p>My name is ${person.name}</p>\n          <p>and I am ${person.age > 21 ? \"capable\" : \"not capable\"} to drink</p>\n    </div>\n`;\n```\nThis javascript code will output the following HTML:\n\n```html\n    <div>\n          <p>My name is Alejandro</p>\n          <p>and I am capable to drink</p>\n    </div>\n```\n\n"
                    },
                    {
                        "id": 16,
                        "label": "Intro to React",
                        "lessons": [
                            {
                                "slug": "javascript-import",
                                "title": "JavaScript Import and Export of Modules"
                            },
                            {
                                "slug": "learn-react-js-tutorial",
                                "title": "Learn React Here : React Js Tutorial"
                            },
                            {
                                "slug": "making-react-components",
                                "title": "Creating React.js Components"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "react-exercises",
                                "title": "Learn React.js Interactively"
                            }
                        ],
                        "scrollY": 3405,
                        "homework": "",
                        "position": 16,
                        "assignments": [],
                        "description": "But working with the DOM can get tricky and it's resource consuming, for that and many other reasons libraries like React.js got popular in the last couple of years. The let you create HTML and CSS using JS in a very intuitive way",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Make students create their first react components and explain the use of JSX. Only talk about functional components, class components are deprecated and we will be using only hooks. ",
                        "extended_instructions": "# Continue working on the Landing Page\n\n## `5 min` Take any questions about javascript/react/bootstrap/html/css\n\nRemind everyone that doing the replits about Javascript is extremelly important, the only way to become better is practicing, not reading or waching videos.\n\n## `20 min` Review React.js again.\n\n- React is about components (component names MUST be written in PascalCase)\n- You build components by creating functions (the only function in the worls of JS that MUST start in capital letters)\n- Functions must return HTML.\n- Those functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n\n```\n🔥  We are not using component classes\n\nClass Componets are legacy, we recommend to ignore them as they will disappear in the next 1-2 years.\n```\n\n## `15min` Show the class again how to create a component\n\n- Create a simple component like the bootstrap card or the bootrap modal.\n- Make sure the component does not have a state, only props.\n- Explain the props in detail.\n\n\n☢ 😰 🤯 ️Students are overwhelmed ! Don't talk to much because they won't listen.\n\n💡 Tell students that today its not the day to be brave and find your own solutions, today its about asking questions after 5 minutes."
                    },
                    {
                        "id": 17,
                        "label": "React Landing",
                        "lessons": [],
                        "project": {
                            "title": "Landing Page with React",
                            "instructions": "https://projects.breatheco.de/project/landing-page-with-react"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 5677,
                        "homework": "",
                        "position": 17,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-landing-page-with-react",
                                "slug": "landing-page-with-react",
                                "title": "Landing Page with React"
                            }
                        ],
                        "description": "As a react developer you will be creating landing pages every day, you have already build a couple using HTML/CSS and now it's time to build it in React.js",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "A landing page is perfect to start practicing how to make react components in a real-life project, this project can be done in teams of two people to practice GIT collaboration as well.",
                        "extended_instructions": "No new conecpts today, just go over react again and focus in the process of creating components.\n\nYou can create a react component for each bootstrap component."
                    },
                    {
                        "id": 18,
                        "label": "Building Components",
                        "lessons": [],
                        "project": {
                            "title": "Simple Counter",
                            "instructions": "https://projects.breatheco.de/project/simple-counter-react"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 3587,
                        "homework": "Students must finish the simple counter with react for the next class",
                        "position": 18,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-simple-counter-react",
                                "slug": "simple-counter-react",
                                "title": "Simple Counter"
                            }
                        ],
                        "description": "Its the first time you've heard or learn about react, we have given you a lot of exercises to practice. Please practice like crazy with all of them. Ask questions",
                        "instructions": "It's the first time students will be using objects, explain the concept. Make students create their first react components and explain the use of JSX. Explain the difference between Functional components and or class components and the render function. Landing page project should be a code along at start, then groups at end.",
                        "key-concepts": [
                            "Export -> Import modules",
                            "You can create your own tags",
                            "Create a Component like a Class",
                            "Create a Component like a Function",
                            "Use of the render method"
                        ],
                        "technologies": [
                            "React",
                            "Webpack",
                            "Babel.js",
                            "JS Modules",
                            "JS Classes"
                        ],
                        "teacher_instructions": "Use half of the class to explain Hooks. Students have now a lot of homework: The React Replits,, Counter and the Landing page. Work with students to help them complete the developments.\",\n",
                        "extended_instructions": "## Continue working on the Landing Page\n\n## `5 min` Take any questions about javascript/react/bootstrap/html/css\n\nRemind everyone that doing the replits about Javascript is extremelly important, the only way to become better is practicing, not reading or waching videos.\n\n## `20 min` Review React.js again.\n\n- React is about components (component names MUST be written in PascalCase)\n- You build components by creating functions (the only function in the worls of JS that MUST start in capital letters)\n- Functions must return HTML.\n- Those functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n\n```\n🔥  We are not using component classes\n\nClass Componets are legacy, we recommend to ignore them as they will disappear in the next 1-2 years.\n```\n\n## `15min` Show the class again how to create a component\n\n- Create a simple component like the bootstrap card or the bootrap modal.\n- Make sure the component does not have a state, only props.\n- Explain the props in detail.\n\n\n☢ 😰 🤯 ️Students are overwhelmed ! Don't talk to much because they won't listen.\n\n💡 Tell students that today its not the day to be brave and find your own solutions, today its about asking questions after 5 minutes."
                    },
                    {
                        "id": 19,
                        "label": "The State",
                        "lessons": [
                            {
                                "slug": "react-hooks-explained",
                                "title": "React Hooks Explained"
                            }
                        ],
                        "project": {
                            "title": "Traffic Light",
                            "instructions": "https://projects.breatheco.de/project/traffic-light-react"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 3682,
                        "homework": "",
                        "position": 19,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-traffic-light-react",
                                "slug": "traffic-light-react",
                                "title": "Traffic Light"
                            }
                        ],
                        "description": "So far you know that React components have properties (props), but there is one more important concept in react components: The State. ",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Do not explain react components with classes, it's still being used in the industry but less every day. Let's focus on mastering the useState function.",
                        "extended_instructions": "# Creating Components with States\n\n## `10 min` Take any questions about javascript/react/bootstrap/html/css\n\nRemind everyone that doing the replits about Javascript is extremelly important, the only way to become better is practicing, not reading or waching videos.\n\n## `10 min` Review React.js\n\n- React is about components (component names MUST be named in `PascalCase` notation)\n- You build components by creating functions that later will become `<Tags>` (with capital first letter)\n- Component Functions must **always** return HTML.\n- Those component functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n\n## `20 min` The state\n\n- The function useState must be used when information inside the component o website changes over time, for Example: \n    - A timer: the current time changes every second (or even milisec).\n    - Todo list: the array of todos grows over time.\n    - Fetch requests: When information comes from a nother server it was empty first and then it changes.\n\n- State vs Props:\n      1. State is declared inside the component.\n      2. Props are declared outside of the component and are read only within the inside of the component.\n\n- Show an example os using the useState.\n```js\n\n//            ⬇ value  ⬇ modifier                  ⬇ default\nconst [ value, setValue ] = useState(defaultValue);\n```\n- you can have as many states as you want\n\n### The state is inmutable:\n\nThis is wrong:\n```jsx\nconst [ todos, setTodos ] = useState([]);\n\n// ⬇  WRONG!!!!!  ⬇\nconst addTodo = (text) => {\n  todos.push(text)\n  setTodos(todos);\n}\n\n\n// ⬇  GOOD!!!!!  ⬇\nconst addTodo = (text) => {\n const newTodos =  todos.concat([text])\n  setTodos(newTodos);\n}\n```"
                    },
                    {
                        "id": 20,
                        "label": "Todo List",
                        "lessons": [
                            {
                                "slug": "controlled-vs-uncontrolled-inputs-react-js",
                                "title": "What are controlled and/or uncontrolled inputs in React.js"
                            }
                        ],
                        "project": {
                            "title": "Todolist Application Using React",
                            "instructions": "https://projects.breatheco.de/project/todo-list"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 6805,
                        "homework": "Students must finish the TodoList being able to add & delete tasks.",
                        "position": 20,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-todo-list",
                                "slug": "todo-list",
                                "title": "Todolist Application Using React"
                            }
                        ],
                        "description": "Finally we can create our own HTML tags and re-use them on several projects and views. The key to understand a component is understanding Props and The State. Please start working on the Todo-List Application. This project will be useful in your future as a coder!",
                        "instructions": "Review landing page. React as rendering engine: Students need to understand that now they can finally create their own HTML tags (React Components) and how to use the State and the Props",
                        "key-concepts": [
                            "Condigional Rendering",
                            "The component state",
                            "The state is inmutable",
                            "Using const, map, filter and concat to prevent state mutation"
                        ],
                        "technologies": [
                            "React",
                            "Javascript",
                            "Events"
                        ],
                        "teacher_instructions": "Review landing page. React as rendering engine: Students need to understand that now they can finally create their own HTML tags (React Components) and how to use the State and the Props",
                        "extended_instructions": "# Creating Components with States\n\n## `10 min` Take any questions publicly\n\nRemind everyone that doing the exercises about Javascript is extremely important, the only way to become better is practicing, not reading or watching videos.\n\n## `10 min` Review React.js (yes, again)\n\n- React is about components (component names MUST be named in `PascalCase` notation)\n- You build components by creating functions (the only function in the worls of JS that MUST start in capital letters)\n- Functions must return HTML.\n- Those functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n\n## `20min` Go over the component `useState` hook again\n\n- Properties are defined **ouside** of the component.\n- The State is defined **inside** of the component.\n- The state is needed when information inside the component will **change over time**.\n- You can have as many states as you want.\n- Talk about controlled inputs with an example.\n\n\n## `2:25 min` Start the todolist with the students\n\nAny other project the student may have until this day (like the Traffic Light) is supposed to be done on their own time.\n\n- You can help them a lot on this exercise, but always do it on the whiteboard.\n- Help them do the strategy first and later help them complete the exercise.\n- This exercise is challenging for the majority of the students, but you will be able to manage if you continue helping them individually."
                    },
                    {
                        "id": 21,
                        "label": "React Router",
                        "lessons": [
                            {
                                "slug": "routing-our-views-with-react-router",
                                "title": "Using React Router"
                            },
                            {
                                "slug": "context-api",
                                "title": "Global state with the Context API"
                            },
                            {
                                "slug": "what-is-react-flux",
                                "title": "Learn What is React Flux"
                            }
                        ],
                        "project": {
                            "title": "Create a Todolist with Context.API and Flux",
                            "instructions": "https://projects.breatheco.de/project/todo-list-react-context"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 4270,
                        "homework": "Sit with every project team and discuss how to split the code into Views and React.Components, students must finish the home layout by next class",
                        "position": 21,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-todo-list-react-context",
                                "slug": "todo-list-react-context",
                                "title": "Create a Todolist with Context.API and Flux"
                            }
                        ],
                        "description": "But some react components will never be re-used, they behave more like page or layout. We will call those components: 'Views'... React will help us connect them together to create our main website navegation",
                        "instructions": "React Router + React: How to create components that behave like Views (layouts) and match them with URL Routers.",
                        "key-concepts": [
                            "React Router",
                            "Router: Matching URLs Views",
                            "Component vs View",
                            "The Component State",
                            "Using the React Debugging Chrome Plugin",
                            "Debugging code with the Chrome Source Tab"
                        ],
                        "technologies": [
                            "Minimum Viable Product",
                            "React Router",
                            "The Chrome Inspector"
                        ],
                        "teacher_instructions": "This project is all about URLs and Routing. Each student must build two views/pages. List of ",
                        "extended_instructions": "# Advanced React Boilerplate \n\n## `5min` Questions about Context and React Router\n\nIf someone asks about redux tell them we focus on Flux instead of Redux because its a lot easier to setup and its also widely used on the market.\nRedux is a simplification of Redux, students will no have problems setting it up in the future but we are interested in learning the process behind.\n\n## `10min` Review the React and Context API\n\n- React is about components (component names MUST be written in caps)\n- You build components by creating functions or classes (both MUST start in capital letters)\n- Review how to create a class vs functional component\n- The component objective is to create HTML.\n- You can pass props to compoentns `<Tag property={value}>`\n- You can persist those variables to the DOM using `this.setState`\n- API Calls (fetch) should be done on `componentDidMount`\n- Review how to code a fetch\n- The Context API is about: View, Actions, Store (MVC)\n    - The view renders and triggers actions\n    - Actions setStore\n    - store is just a store, you have to model your data and initialized it\n    - fetch call must be done on component did mount.\n\n## `45 min` Live Coding\n\n-Show students the way you would do this project. Take all the questions and make questions as well if they don't take the initiative.\n\n## `2:00min` Continue working on the Starwars Blog\n\n"
                    },
                    {
                        "id": 22,
                        "label": "HTTP Requests",
                        "lessons": [
                            {
                                "slug": "the-fetch-javascript-api",
                                "title": "The Fetch API"
                            },
                            {
                                "slug": "asynchronous-algorithms-async-await",
                                "title": "Creating asynchronous algorithms"
                            },
                            {
                                "slug": "understanding-rest-apis",
                                "title": " Understanding Rest APIs"
                            }
                        ],
                        "project": {
                            "title": "Todolist Application Using React and Fetch",
                            "instructions": "https://projects.breatheco.de/project/todo-list-react-with-fetch"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 4041,
                        "homework": "",
                        "position": 22,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-todo-list-react-with-fetch",
                                "slug": "todo-list-react-with-fetch",
                                "title": "Todolist Application Using React and Fetch"
                            }
                        ],
                        "description": "Most of the applications build on the internet require some king of database synchronization, normal made through several API requests",
                        "key-concepts": [
                            "What is HTTP",
                            "POSTing, PUTing and DELETEing data to the server",
                            "How to display \"loading\" before data arrives",
                            "async/await (optional)",
                            "How to use POSTMAN (set environment variables and use collections)",
                            "JSON is a Javascript object but as a TEXT",
                            "Serialize>send>Unserialize",
                            "What is serialization and how to do it",
                            "Why use several request types: GET, POST, PUT, DELETE"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Introduce the concept of fetching help students finish the todo list(unstuck them) and incorporate the synconization with the API. Then, introduce the new Todo List with React and Fetch.\n",
                        "extended_instructions": "# Using Fetch to request information from API's\n\n## `5 min` Take any questions about javascript/react\n\nRemind everyone that doing the replits extremelly important, the only way to become better is practicing, not reading or waching videos.\n\n## `10 min` Review React.js\n\n- React is about components (component names MUST be written in caps)\n- You build components by creating functions (the only function in the worls of JS that MUST start in capital letters)\n- Functions must return HTML.\n- Those functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n- Review how to create class component\n- You can have shared variables withing the entire class using `this`\n- You can persist those variables to the DOM using `this.setState`\n```js\n\n// second approach\nimport { Component } from 'react';\nclass TodoList extends Component{\n    constructor(){\n        //initialize component persisted values\n        this.state = {\n            hidden: false\n        }\n    }\n    render(){\n        return <div className={'alert alert-danger'}>{this.props.children}</div>;\n    }\n}\n```\n- Props vs State (props are external, state is internal)\n\n## `20 min` Review the Basics of HTTP and segway to API concepts\n\n- Client and Servers interact in the form of text\n- As a client, your job is to setup and send `Requests` with these 4 properties: \n    Method: GET=Read POST=Create PUT=Update DELETE=DELETE\n    Body: the payload (only applies to POST and PUT) and must be formated in csv,json,xml or similar.\n    Content-Type: the format that the payload will have.\n    URL: Where the request is going to be sent.\n- Go over the concept of serialization (form json string -> to real object in javascript)\n- You have to wait for the response using Promises (do not explain async/await yet)\n- This is how a typical [API documentation looks](http://assets.breatheco.de/apis/fake/todos/), next project we will be using a real life Starwars API.\n\n## `20 min` Consuming API's using the Fetch method in Javascript\n\nNow, for the first time, we have a way of askin for aditional information during runtime\n\n```js\nfetch('url/to/fetch', additionalSettings)\n    .then(resp => {\n        console.log(resp.ok); // will be tru if the response is successfull\n        console.log(resp.status); // the status code = 200 or code = 400 etc.\n        console.log(resp.text()); // will try return the exact result as string\n        return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results\n    })\n    .then(data => {\n        //here is were your code should start after the fetch finishes\n        console.log(data); //this will print on the console the exact object received from the server\n    })\n    .catch(error => {\n        //error handling\n        console.log(error);\n    })\n```\n# Consuming REST API's to GET, POST, PUT and DELETE\n\nToday we will be using the Fetch API to create POST/PUT/DELETE methods.\n\n## Explain how to code a fetch request to successfully implemente the GET/POST/PUT/DELETE with JS\n\nIn the following example, the `additionalSettings` variable has the key to everything, you can specify the Content-Type, Method, and Body of the request.\n\n```js\n\nconst additionalSettings = {\n    \"headers\": {\n        \"method\": \"POST\",\n        \"Content-Type\": \"application/json\",\n        \"body\": JSON.stringify(someObject)\n    }\n}\n\nfetch('url/to/fetch', additionalSettings)\n    .then(resp => {\n        console.log(resp.ok); // will be tru if the response is successfull\n        console.log(resp.status); // the status code = 200 or code = 400 etc.\n        console.log(resp.text()); // will try return the exact result as string\n        return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results\n    })\n    .then(data => {\n        //here is were your code should start after the fetch finishes\n        console.log(data); //this will print on the console the exact object received from the server\n    })\n    .catch(error => {\n        //error handling\n        console.log(error);\n    })\n```\n\n## `2:30min` Start Todo list with React and Fetch\n\nThis project uses everything we have seen so far: The Context API, Fetch, HTML/CSS, etc.\nThe idea is to practice everything but the only new concept will be doing POST/PUT/DELETE.\n\n\n"
                    },
                    {
                        "id": 23,
                        "label": "Flux",
                        "lessons": [],
                        "project": {
                            "title": "Contact List App Using React & Context",
                            "instructions": "https://projects.breatheco.de/project/contact-list-context"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 5788,
                        "homework": "",
                        "position": 23,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-contact-list-context",
                                "slug": "contact-list-context",
                                "title": "Contact List App Using React & Context"
                            }
                        ],
                        "description": "Let's breathe a little bit, work on finishing all previous projects and assignments.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Nothing today, work with students on finishing the meetup clone or any other pending activity.",
                        "extended_instructions": "Nothing new today, just help students finish pending activities and go over any concept that you feel needs to be re-enfoced like:\n\n- HTTP\n- Asyncrunus Programing\n- React Components: State vs Props\n- Flux: Action, View, Store.\n- Fetch API\n- The DOM and Events\n- React Router."
                    },
                    {
                        "id": 24,
                        "label": "Data Modeling",
                        "lessons": [
                            {
                                "slug": "what-is-sql-database",
                                "title": "Mastering Databases: What is SQL Database"
                            }
                        ],
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 6199,
                        "homework": "Students must build the needed model to build the Meetup-Clone API and the API RESTful services to CRUD the models",
                        "position": 24,
                        "assignments": [],
                        "description": "Learn how to data-model your application database and business model and run your first WordPress installation.",
                        "instructions": "Use Composer+WPCLI to install (WordPress + WPAS Dash + ACPT Plugin) and demonstrate how create you own WordPress model. Explain what Entities are and Entity-Relationship Diagram. Do not explain composer that much (do the analogy with NPM) and do not explain WP-CLI to much either, start using it and students will learn by doing",
                        "key-concepts": [
                            "Database Entities: Modeling Data with Wordpress",
                            "The WordPress Dashboard",
                            "Creating a CPT",
                            "Relationships between Custom Post Types",
                            "POSTMan: How to use it to create all types of requests, headers and content-types"
                        ],
                        "technologies": [
                            "HTTP",
                            "JSON",
                            "REST",
                            "API's",
                            "Serialization",
                            "Custom Post Types",
                            "Composer",
                            "WordPress Dash",
                            "WP-CLI"
                        ],
                        "teacher_instructions": "Start the class talking about data-models and help students create their Meetup.com data model.\n\nThen, start using the WordPress boilerplate to create your first Custom Post Types for each table and create the properties using Advanced Custom Fields.",
                        "extended_instructions": "# Data Modeling whith UML\n\n## `5 min` Take 5 minutes to explain the difference beween data-structures and data-models\n\nYou can think about data-structures like he RAM Memory repersentation of data-models, for example:\n\n- Data structures are stuff like: Arrays, Queues (FIFO, FILO), Classes, etc.\n- Data models are ways of structuring the database.\n\nThe data-structure of your Reac.tjs projects will: The Store (RAM Memory).\nBut the data-model is only represented on the backend database.\n\n## `20 min` Today it is about: Data Modeling\n\n[This video](https://www.youtube.com/watch?v=UI6lqHOVHic&list=PLUoebdZqEHTxNC7hWPPwLsBmWI0KEhZOd) shows how to create a UML diagram, make students watch the video.\nExplain the basics of UML with a simple Car dealer example: Vehicle, Client, Purchase.\n\n- What are the possible data-types in a car dealer? Number, Boolean, String, etc.\n- What properties can a Vehicle, Client or Purchase have?\n- What are tthe relationships between the models (one-to-one, one-to-many, many-to-many)?\n    - How many Vehicles a Client can have?\n    - How many y Purchases a Client can do?\n    - How many Vehicles can a Purchase contain?\n\n## `2:30` Data-Modeling project\n\nWork on today's project."
                    },
                    {
                        "id": 32,
                        "label": "Authentication",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must work on the project",
                        "position": 25,
                        "assignments": [],
                        "description": "",
                        "instructions": "Work with students on the project",
                        "technologies": [],
                        "teacher_instructions": "Work with students on the project"
                    }
                ],
                "slug": "web-development",
                "label": "Web Development",
                "profile": "web-development",
                "version": "2",
                "description": "",
                "academy_author": "4"
            },
            "version": 2,
            "updated_at": "2021-09-14T23:33:08.570327Z",
            "created_at": "2021-09-14T23:33:08.570309Z",
            "slug": "web-development",
            "name": "Web Developer",
            "syllabus": 30,
            "duration_in_hours": 126,
            "duration_in_days": 42,
            "week_hours": 9,
            "github_url": null,
            "logo": null,
            "private": false
        },
        {
            "json": {
                "days": [
                    {
                        "id": 1,
                        "label": "HTTP/HTML/CSS",
                        "lessons": [
                            {
                                "slug": "intro-to-prework",
                                "title": "Introduction to the pre-work"
                            },
                            {
                                "slug": "what-is-the-internet",
                                "title": "Internet Architecture"
                            },
                            {
                                "slug": "what-is-html-learn-html",
                                "title": "Learn HTML"
                            },
                            {
                                "slug": "what-is-css-learn-css",
                                "title": "Learn CSS"
                            }
                        ],
                        "project": {
                            "title": "Build a Digital Postcard with HTML/CSS",
                            "instructions": "https://projects.breatheco.de/project/postcard"
                        },
                        "quizzes": [
                            {
                                "slug": "intro-to-prework",
                                "title": "About the Prework"
                            },
                            {
                                "slug": "html",
                                "title": "Basics of HTML"
                            }
                        ],
                        "replits": [
                            {
                                "slug": "html",
                                "title": "Learn HTML"
                            },
                            {
                                "slug": "css",
                                "title": "Learn CSS"
                            }
                        ],
                        "scrollY": 0,
                        "homework": "The students must finish the Postcard on their own (there is a video-tutorial)",
                        "position": 1,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-postcard",
                                "slug": "postcard",
                                "title": "Build a Digital Postcard with HTML/CSS"
                            }
                        ],
                        "description": "Welcome to web development: At the beginning there was only HTML, years later CSS appeared, and that's how the web 1.0 came to life",
                        "instructions": "You have 30 min to explain how HTTP works sending-receiving text between servers & clients, how the browsers interpret that text as HTML, CSS or JS and then start coding. Start the postcard HTML on the screen and students should finishe it. Use float layout pursposes instead of display inline-block.",
                        "key-concepts": [
                            "Client vs Server",
                            "HTTP Request vs Response",
                            "Everything is text!",
                            "Browser Interpretation",
                            "Indentation",
                            "HTML is similar to Word: Headings, paragraphs, etc",
                            "HTML vs CSS",
                            "Always Be Closing",
                            "CSS Selectors (basic ones)"
                        ],
                        "technologies": [
                            "HTML5",
                            "CSS"
                        ],
                        "teacher_instructions": "You have 30 min to explain how HTTP works sending-receiving text between servers & clients, how the browsers interpret that text as HTML, CSS or JS and then start coding. Start the postcard HTML on the screen and students should finishe it. Use float layout pursposes instead of display inline-block.",
                        "extended_instructions": "# Day 1 - Web Development\n\n1. Present the academy and team (3min).\n2. Students present itself (5min).\n3. Sign informal agreement (3min).\n\n4. Make sure everyone is on gitpod and explain gitpod (10min).  \n\n- What is a workspace.\n- Install the gitpod plugin.\n- How to run the HTML boilerplate.\n\n5. Introduce them to BreatheCode:  \n\n- How to login, see your, your todos, etc.\n- How to create a new project using the boilerplates.\n- How to deliver an assignment.\n    \n6. Master-class about The internet, HTTP, and HTML (20min).\n7. Students code the postcard HTML (45min).\n8. Master-class about CSS (10min).\n9. Students code the postcard CSS (45min).\n\n##### Present the academy\n\n- 6pm Small Presentation\n- Who we are: Each teacher presents itself.\n- Get everyone to introduce themselves:\n```\nFirst name and last\n1. What would you like to be called?\n2. What do you do now? (for work)\n3. What do you plan on doing when you become a developer?\n```\n\n##### Master Class\n \n**Client vs Server**  \nExplain how for student to access Google, their website is hosted on another computer called a “Server” that they own.  \nThe student would have to communicate from their local computer (called a “client”), to get the website from the server so they can view and use it.\n\n**HTTP Request vs Response**  \nThe method used for this communication is called HTTP, which stands for Hyper Text Transfer Protocol.  \nThe way that you get the website is by sending a “Request” to the server. This tells the server what website or resource you are looking to view/use. The server then responds with the information.  \nThe server then sends a response, which tells will confirm the receipt of the request and let your computer know that it will begin sending data. (second day content)  \nThis back and forth process will continue with more Request=>Response pairs until you have finished loading your remote resource. (in this case, Google – second day content)\n\n**Everything is text!**  \nWith HTTP, it’s important to focus on the first ‘T’ in the acronym, which stands for ‘Text’. In this protocol, everything is sent back and forth as TEXT.  \nWhile there are other protocols out there, for now, we want to remember that with HTTP – Everything is TEXT.\n\n**Browser Interpretation**  \nAfter your browser uses the HTTP protocol and receives the data as text, it then has the job of interpreting that text and converting it to the correct visual format. (What do you think that text is converted into? Open your cheat sheet for HTML and guess. Images, tables, videos, animations, etc)\n\n**HTML vs CSS**  \nSo that the developers that made Google (or any other website) can create the experience you know and love, they have to use certain languages. The three most commonly used ones in front end are HTML, CSS, and Javascript.  \nHTML is like the framework for any website. It’s good to think of it as a house. If you are building a house, you need a foundation and a frame before you build walls and make everything pretty.   \nAfter you use the HTML to make that framework, you can make the website pretty by using CSS.  \n\n**Always Be Closing and Indentation Matters**  \nWhen you start coding today, everything is going to be done in blocks of code. Each block is self contained so you always have the same flow with creating one.  \nFirst you open the block, then you close the block. In 4geeks,we have a saying for this `“ALWAYS BE CLOSING”`.   \nLet’s take a look at a typical block of HTML (setup a `<head>` `<body>` and `<p>` on the board)  \nNotice there is a start and end to the block. These opening and closing statements are called **“Tags”**.  \nEach statement of a code document also has it’s own indentation, so that it is more legible to any developers that review your code. This is VERY important as you always want your coding to be understandable by other people working on projects with you.  \nNow, to get acquainted with this a bit, were going to try an exercise.  \n\n> Have students open and start the postcard with HTML only, no CSS) \n>\n> Here is where they start coding the html of the postcard for 45 min, everyone should be able to finish the html before starting with the css.\n \n \n**CSS Selectors (basic ones)**\nNow that you have created your first project in HTML, you have to consider the styling that will be needed.  \nAs we discussed before, the HTML provides all of the elements on the page, but the CSS is what gives those elements size, color, position, and even transitions or animations.  \n\n**Let’s talk about how CSS works.**  \nCSS allows you to set the properties we just mentioned (like size and color) by targeting that element.  \nThe targeting occurs by using something called Selectors, which are basically the syntax that you use to define what you are targeting.  \n```\nSome basic selectors are: ID, CLASS, and ELEMENT  \n```\nCSS formatting is always done as follows:\n```selector { property: value; }```\n`ID` is something that you can set up on an HTML tag that UNIQUELY identifies that specific tag (whether it’s a Paragraph, Div, or Section)\n`ID` is a property of the element\nThis is done by adding the property `id=”name”` for example:\n```html\n<div id=”myDiv”>\n```\nWhen you have defined it in your HTML, the targeting in your CSS would be: `#myDiv`  \nThe `#` (hash/octothorpe) tells the interpreter that you are targeting an `ID`  \nClass is similar to ID, in that, it helps to identify the specific element but it is NOT Unique  \n\n**Class is a property of the element**  \nAn element can have many classes or not  \nSimilar to ID, you would add `class=”name”`, for example: \n```html\n<div class=”row”>\n```\nElement is just as it sounds.  \nEach type of tag that you use in your HTML has an Element Selector in CSS.  \nYou don’t need a special property in your html for this as it’s a broad range selector, meaning that when used alone it will select all of that element type.  \nAn example would be div elements. To select all divs in css, you would just use the div selector:\n```css\ndiv { \n    //some css rule here\n}  \n```\nIn CSS, selectors can be combined to enhance the specificity of your targeting. Rule of thumb goes that the more specific CSS will take precedence.  "
                    },
                    {
                        "id": 2,
                        "label": "Layouts",
                        "lessons": [
                            {
                                "slug": "css-layouts",
                                "title": "Doing Layouts"
                            },
                            {
                                "slug": "mastering-css-selectors",
                                "title": "Advanced CSS Selectors"
                            }
                        ],
                        "project": {
                            "title": "Simple Instagram Photo Feed with HTML/CSS",
                            "instructions": "https://projects.breatheco.de/project/instagram-feed"
                        },
                        "quizzes": [
                            {
                                "slug": "internet-architecture",
                                "title": "Internet Architecture"
                            },
                            {
                                "slug": "css",
                                "title": "Basics of CSS"
                            }
                        ],
                        "replits": [
                            {
                                "slug": "layouts",
                                "title": "Doing Layouts"
                            }
                        ],
                        "scrollY": 469,
                        "homework": "Students must finish the Instagram & the Postcard.",
                        "position": 2,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-instagram-feed",
                                "slug": "instagram-feed",
                                "title": "Simple Instagram Photo Feed with HTML/CSS"
                            },
                            {
                                "url": "https://github.com/breatheco-de/exercise-instagram-post",
                                "slug": "instagram-post",
                                "title": "Instagram Post"
                            }
                        ],
                        "description": "Then, websites got popular and CSS evolved to enable amazing layouts with boxes and also a ritch set of CSS Selectors",
                        "instructions": "Connecting CSS & HTML: Finish the postcard and start the Instagram Feed. Review all the key concepts with your students.",
                        "key-concepts": [
                            "Do not use ID as CSS selectors (use specificity)",
                            "::Before & ::After Selectors",
                            "DRY Technique",
                            "Box Model"
                        ],
                        "technologies": [
                            "CSS3",
                            "HTML5"
                        ],
                        "teacher_instructions": "Connecting CSS & HTML: Finish the postcard and start the Instagram Feed. Review all the key concepts with your students.",
                        "extended_instructions": "# Day 2 - Web Development\n\nWelcome everyone and ask how many got around to the reading.\nMake sure everyone has access to BreatheCode platform and also to the replit exercises.\nGet feedback about repl’it from those using it already.\n \nQuick Recap of previous day with additional points about Request/Response. (10-15 min)\n \n***Mention that when they get to the repl’it for HTML tables and CSS, they will see how some elements have properties for color and border, which is how the web was styled before CSS.***\n \n## Lecture `(20min)`\n \n1. Do not use ID as CSS selectors (use specificity)\n  * As we discussed previously, CSS utilizes Specificity for targeting.\n  * When we talked about ID and Class selectors, I mentioned that in most cases it’s better to use classes because they are reusable.\n  * Try to avoid ID selectors unless you absolutely need them. It’s possible to achieve the same effect as an ID selector by using specificity.\n  * If you google “css specificity calculator”, you can find tools that help you to calculate specificity of your selectors, but you shouldn’t need them if you understand the basic rules.\n  * Review how specificity works. \n    1. Combine selectors to get more specific about which element you are styling\n    2. w3schools breaks down specificity hierarchy in this order (from greatest to least specific):\n      * Inline styles - An inline style is attached directly to the element to be styled.\n      \n        For Example: \n        ```html \n        <h1 style=\"color: #ffffff;\">\n        ```\n      * IDs - An ID is a unique identifier for the page elements, such as #navbar.\n      * Classes, attributes and pseudo-classes - This category includes .classes, [attributes] and pseudo-classes such as :hover, :focus etc.\n      * Elements and pseudo-elements - This category includes element names and pseudo-elements, such as h1, div, :before and :after.\n      * You can read more about specificity on breathco.de\n2. Before & ::After Selectors\n  * Help to insert content or styling before or after an element\n  * This is really helpful as it allows you to do cool things like create interesting block quote effects. You can add giant quotation marks or symbols.\n3. DRY Technique\n  * Ask if anyone remembers what we said DRY Programming means?\n  * Don’t repeat yourself\n  * Everything must have a single representation, don’t repeat elements unnecessarily. (example: reusable classes instead of same property repeated over and over)\n  * A good example of this would be, if I was going to apply a color blue to 5 parts of the site, I could add the ```color: blue;```\n   property to every area of my CSS, or the better practice is to... \n    1. Create a class that will apply the blue color and attach it to the items that need it. \n    2. Or, Create a multi-part css statement. Multiple selectors that are comma separated to target several specific elements.\n    For Example:  ```.myHeader, .myFooter, .contentDiv { color: blue; }```\n      * This is the best of the two and you should get use to it as it will save you tons of lines of code and make your code way more legible.\n      * Conversely, you may think it’s funny that they call the opposite of DRY -  WET programming, which they have given the following titles to:  \"write everything twice\", \"we enjoy typing\" or \"waste everyone's time\"\n4. Box Model\n  * In our first class, we touched on this a bit, but didn’t give it a formal title. \n  * Box layout means that all elements can be thought of as boxes. In our first assignment, we thought of all divs as content boxes that held other things in them (like russian nesting dolls)\n  * However, each element has a box too\n  * There are 4 main parts to the typical box model: (draw the following on the board or show picture from breathcode)\n    * Content - this is what is inside the box\n    * Padding - this is spacing between the border and content (inside box also)\n    * Border - this is the edge of the box\n    * Margin - this is spacing between the outside of the box and the next element over in any direction. (which could be the edge of the page, another div, a paragraph, or even an image. )\n  * You can also have a background color or image, this will show in the content area of your box.\n  * Additionally, you have properties that are important to your elements such as: width and height, display, position, etc.\n    * Width and height - talk about the dimensions of the box\n    * Display - talks about whether an element is visible or not, also refers to how it can be positioned in relation to other objects\n      * Block - sits on it’s own line (takes up whole width)\n      * Inline - can sit next to other elements (works like a span)\n      * there are tons of others so you will have to read up to understand them all, but those are the two main ones\n      \n> 💡 Recommend that students go over the CSS and HTML cheat sheets that we have available on the breathco.de platform under Assets. \n\n\n## Start next project `(2:30min)`\n\nStart the project with the students, show them how to plan your by drowing the boxes first.\n\n![HTML/CSS Strategy](https://github.com/breatheco-de/exercise-instagram-feed/blob/master/strategy.png?raw=true)\n \nExplain that all projects will have to be delivered by next week using the breathecode platform.\n \nAnswer any questions.\n \nAt end of class, remind them to finish the the postcard with CSS and simple instagram.\n \nEncourage them to use the Chat or to DM me on slack. Work on the Reading ahead of each class and do the Repl’its, THEY HELP!"
                    },
                    {
                        "id": 3,
                        "label": "Command Line",
                        "lessons": [
                            {
                                "slug": "the-command-line-the-terminal",
                                "title": "The Command Line"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "the-command-line",
                                "title": "Command Line Interactive Challenge"
                            }
                        ],
                        "scrollY": 748,
                        "homework": "At the end of the class, present the students with the GIT project & please ask each student to start coding its corresponding part of the website.",
                        "position": 3,
                        "assignments": [],
                        "description": "A text editor and the console, that's all you need to be a great coder. Time to master the second one.",
                        "instructions": "Teach the command line to your students, use the CMD challenge to make it very fun! Start with a small explanation about the importance of the CMD and then explain each command after its respective challenge is completed.",
                        "key-concepts": [
                            "Most used CMD commands",
                            "File Directory Hierarchy",
                            "Relative ./ vs Absolute Paths ",
                            "Moving Up ..",
                            "Autocomplete with TAB",
                            "GIT in a general way"
                        ],
                        "technologies": [
                            "Command Line",
                            "Bash Scripts"
                        ],
                        "teacher_instructions": "Teach the command line to your students, use the CMD challenge to make it very fun! Start with a small explanation about the importance of the CMD and then explain each command after its respective challenge is completed.",
                        "extended_instructions": "\n Check if students were able to finish the previous projects, answer questions and encourage them to finish.\n \n ## `10 min` Small theory about the command line (do not explain the commands)\n\n```md\n⚠ ️IMPORTANT:\nPlease don't explain every command, it is better if during the challenge the students find the commands in google or in the breathecode lesson.\n\nStudents can do searches like: \"How to get into a computer directory\", etc.\nForce them to start searching in google!!\n```\n\n- Computers can be entirely managed without a windows interface, you can do everything from the command line.\n- Make sure to make students understand how important the command line (developers use it every day all the time and it is impossible to avoid).\n- Relative path vs absolute path.\n- Explain that we are in Gitpod, which uses ubuntu and we have to familiarize we the ubuntu command line.\n- Talk about the file hierarchy and how is represented in the command line, what the dot  .  and double dot  ..  represents. Draw on the board a file hierarchy and show if at the same time how the command line shows it (compare both).\n- Explain the use of the autocomplete command: [using tab one time for autocomplete or two times to show options](https://www.howtogeek.com/195207/use-tab-completion-to-type-commands-faster-on-any-operating-system/).\n- This is a [very good series of videos](https://www.youtube.com/watch?v=AO0jzD1hpXc&t=267s&index=8&list=PL8A83A276F0D85E70) explaining the command line that students can **watch later.**\n- Share this [cheat sheet with the most used commands.](https://ucarecdn.com/61c6474b-5760-43db-9a2c-dfbea2ccdd76/Comandlinecheatsheet.pdf)\n\n## `1:20 hr` Start The CMD Challenge\n\n- Have students create a project in Gitpod\n- Help them to clone the repo for the project (paste it in the slack channel so they can use the link)**\n    1. git init\n    2. git clone\n- Run the react presentation\n\n```md\n📝 The command line will make students practice the most important commands, explain each command after the each challenge is completed, the student that successfully completed it can explain to other students.\n```\n\n## `1:30min` Take some time the class explaining git in a general way\n\nGit will be the first applicacion we will be using inside the command line, students must read about it and wat videos about it.\n\n### What is git?\n\nGit is an online, central code storage that allows developers to manage a code base in teams.\n\nSome of the things you can do with git include:\n\n1. You can collaborate on projects easily\n2. see a history of revisions\n3. Roll back to previous versions if a revision fails (version control)\n4. Resolve code conflicts so that 2 developers don’t overwrite each other’s code.\n\nGit is a necessity to any developer working today as it’s resolved many of the issues of working on a team or keeping version history on a project.\n\n## For Next Class\n\nNext class we will review GIT in more detail. If you haven’t already, please read the lesson on GIT in the breatheco.de platform.**"
                    },
                    {
                        "id": 4,
                        "label": "Github",
                        "lessons": [
                            {
                                "slug": "learn-in-public",
                                "title": "Learn in Public"
                            },
                            {
                                "slug": "how-to-use-git-version-control-system",
                                "title": "How to use GIT: Version Control System"
                            }
                        ],
                        "project": {
                            "title": "Fix the Misspell Challenge",
                            "instructions": "https://projects.breatheco.de/project/fix-the-misspell"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Stundents should finish their project and remember to read the next lesson before next class.",
                        "position": 4,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/the-misspell-chalenge",
                                "slug": "fix-the-misspell",
                                "title": "Fix the Misspell Challenge"
                            },
                            {
                                "url": "https://github.com/4GeeksAcademy/learn-in-public",
                                "slug": "learn-in-public",
                                "title": "Learn in Public"
                            }
                        ],
                        "description": "Github is an amazing social network for developers, let's learn how to collaborate and contribute while coding.",
                        "key-concepts": [
                            "Do not explain Git with SSH credentials  in detail, students must use HTTP",
                            "Why using Github?",
                            "It will be impossible to avoid using Github",
                            "Commit object",
                            "The HEAD",
                            "The stage",
                            "Branch",
                            "How to switch branches",
                            "Commit vs Push",
                            "Pull vs Fetch",
                            "Resolving Conflicts"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Start explaining Github as a social network, how it stores 90% of the world's codebase, how you can review all major coding projects, follow the most influential developers, and the role of open source.\n\nThen explain GIT without being very technical, the \"Github for poets\" video does a great explanation, we will get more technical the next class that we will collaborate on building a landing page.",
                        "extended_instructions": "# Welcome to Github\n\n**Welcome everyone, Check if they were able to finish all the lessons, exercises, and projects up till now.**\n\n### Explaining Github\n\n1. As we mentioned in previous classes, Github & Git have become a staple of every development workflow.\n\n2. You will use this in EVERY development job you have from here forward.\n\n3. Show the main profile screen and explain parts\n\n    - Use [https://github.com/gaearon](https://github.com/gaearon) as example.\n    - Explain about the github activity graph, how github tracks your entire activity and other developers and recruiters can see it\n\n\n4. Explain how to create a repository\n\n    - click repository tab > new repo button > fill out data\n\n5. Show what a repository looks like\n\n   - explain the contents of the repository and the importance of the Readme file in a project.\n   - Show popular repositories like react, vue, flask, etc. Show them the README files.\n   - show [the git collaboration readme](https://github.com/breatheco-de/exercise-collaborative-html-website) as an example \n\n## The role of open-source\n\n- Explain about open source, how the most important projects in the coding world are open source like: Chrome, Windows, React, Pyhton, Flask, Django, etc.\n\n- In the open source world anyone can pull request anything, there are maintainers that review and approve changes.\n- 4Geeks Academy syllabus is open source and you can Pull Request (lessons and projects)\n\n\n## `1 hr` Project: Fixing Misspells as the perfect Open Source Ice-Breaker\n\nShow students how every lesson on breathecode has the github logo on the top, and you can contrute or fix any lesson by clicking on the github logo and then editing the lesson file on github.\n    \nCreate repositories for all previous workspaces and upload all your code to their corresponding repo’s. Then submit the assignments on your student.breatheco.de  **(DUE MONDAY). Also, work on all repl’its and get caught up. Be ready for the next class which is on Wireframing and design process.**\n\n## `1hr` The student External Profile\n\nEncourage students to do their first pull request with the student external profile: [sep.4geeksacademy.co](https://sep.4geeksacademy.co)"
                    },
                    {
                        "id": 5,
                        "label": "Forms",
                        "lessons": [
                            {
                                "slug": "html-input-html-textarea",
                                "title": "Understanding HTML Input HTML Text Area and Forms..."
                            }
                        ],
                        "project": {
                            "title": "Create a HTML5 form",
                            "instructions": "https://projects.breatheco.de/project/html5-form"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "forms",
                                "title": "Practice HTML5 Forms"
                            }
                        ],
                        "homework": "",
                        "position": 5,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-html5-form",
                                "slug": "html5-form",
                                "title": "Create a HTML5 form"
                            }
                        ],
                        "description": "Forms are responsible for user interactions, they are the first way the internet had to send request to the backend and saving on databases. It's time to learn the most basic way of interacting with backend applications.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Explain how HTML forms work, how to use the most important inputs, and prevent errors with things like \"required\" or being very specific with the input types."
                    },
                    {
                        "id": 6,
                        "label": "Bootstrap",
                        "lessons": [
                            {
                                "slug": "bootstrap-tutorial-of-bootstrap-4",
                                "title": "Working with Bootstrap"
                            }
                        ],
                        "project": {
                            "title": "Instagram Photo Feed with Bootstrap",
                            "instructions": "https://projects.breatheco.de/project/instagram-feed-bootstrap"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "bootstrap",
                                "title": "Working with Bootstrap"
                            }
                        ],
                        "scrollY": 517,
                        "homework": "",
                        "position": 6,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-instagram-feed-bootstrap",
                                "slug": "instagram-feed-bootstrap",
                                "title": "Instagram Photo Feed with Bootstrap"
                            }
                        ],
                        "description": "Then, Bootstrap came to profesionalize websites, removing 99% of the layout pain. Everything is a component from now own.",
                        "instructions": "Explain bootstrap and how it solves 99% of the pain. Everything is a component from now own.",
                        "key-concepts": [
                            "Bootstrap",
                            "Components",
                            "Workflow: Identify the components, Copy&Paste them and finally customize them",
                            "Helper/Utility Classes that come with bootstrap",
                            "Explain Layout (grid layout, rows/columns, responsiveness)"
                        ],
                        "technologies": [
                            "Bootstrap"
                        ],
                        "teacher_instructions": "Explain bootstrap and how it solves 99% of the pain. Everything is a component from now own.",
                        "extended_instructions": "\n\nWelcome everyone, see how the weekend went.\n  * How many got to code Saturday at the downtown campus?\n  * How many worked on the exercises?\n  * Did everyone finish the 2 projects? (postcard and simple Instagram)\n\nToday we are going to review Bootstrap which is going to completely simplify your life as a developer.\n***(Total time: 20 min-25min)***\n\n1. Bootstrap (open the breatheco.de lesson on Bootstrap - day 3)\n  * So what is Bootstrap? We touched on this a bit last class, but Bootstrap is a framework that was developed to simplify front end design/development.\n  * It has tons of components to simplify the process of styling your elements.\n  * Each component is built around classes that they have constructed, which you will include in your html projects.\n  * The biggest take away will be that with Bootstrap, you will have most of the baseline css work done for you and all that will be left is tweaking elements to your unique needs. This removes the heavy lifting in CSS.\n    * Let’s take a look at their website really quick and see what I mean. (open the bootstrap website)\n2. Components\n  * Navbar\n    * this is an example of a really useful component that will be in almost every project you create.\n    * every site needs a navigation, and Navbar allows you to create either simple or complex navigation effortlessly.\n  * Card\n    * Ask students: If you think about your instagram project, What can you visualize having represented as a card?\n      * Answer: Each of the picture/text combos are perfect representations of a card.\n    * Cards are really easy ways to represent data in a nice visual format by combining a picture and text.\n  * Modal\n    * This element isn’t purely css. It will require Javascript to make it work.\n    * Modals are kind of like pop-ups in that they overlay all elements on the page and display some data. They have many uses and can give a super polished look to a project when used correctly.\n    * Let’s look at an example: https://getbootstrap.com/docs/4.0/components/modal/#live-demo\n3. Here is your basic Workflow with Bootstrap Components:  (assuming you have your design already planned)\n  * Identify the components you will need.\n    * visit the site, search through components and find what you will need.\n  * Copy & Paste the element into your code in the specific area it is needed\n    * For example, if you have a Navbar, it will typically be the top of your page.\n    * So within the body, but either in a section or div that you created to house your header is where you will paste the code.\n  * and finally customize the component for your specific design\n    * This is where the fun stuff comes in.\n    * Bootstrap takes the guesswork out of the beginning and allows you to “bootstrap” or spin up a project quickly.\n    * However, once you have the project created, you need to customize each component using CSS to make it unique to your specific design.\n      * Adjust colors\n      * maybe decide between rounded or rectangle buttons\n      * Possibly slight adjustments to form elements, etc.\n    * This is where you will use all of the awesome CSS skills you have been practicing.\n4. Helper/Utility Classes that come with bootstrap\n  * So, in addition to the components, bootstrap also adds helper classes.\n  * These are classes you can attach that do things such as control margin or padding, control borders, or even float elements.\n  * For example, if you wanted no margin on the left of the element, you can add the class ```ml-0``` to the element and it will set the left margin to zero.\n5. Now that you understand how these components and helper classes work and what they do for your projects, it’s time to review the most important part of what bootstrap does for you.\n  * Layout using Grid system\n    1. Explain 12 column layout and how it works\n        * every line is a Row\n        * this row holds columns\n        * every Row on a page has 12 columns\n        * each column has its own spacing between (gutters)\n        * columns are equally measured in percentages so that they are responsive.\n    2. When you build layouts, you specify how the columns will react at each screen size.\n        * the sizes are determined by breakpoints which are defined in bootstrap (you can read these on the documentation)\n        * the basic sizes are: col, col-xs, col-sm, col-md, col-lg, col-xl\n        * To see these breakpoints and their corresponding sizes, check out the bootstrap layout documentation and scroll to the section on “grid”\n6. One more thing I want to touch on is Fonts.\n  * Bootstrap doesn’t set font size on HTML (which is the common practice for the documents base size)\n  * It assumes a base font size of 16px (which is the browser standard) and specifies a starting value of 1rem on the body.\n  * This allows all fonts to scale up relative to that size. It is recommended in responsive design to use rem units for fonts because the scale in respect to the base document font\n  * You will want to familiarize yourself with measurement differences between EM, REM, and PX.\n    * PX = pixel measure and is a standard measure used on base sizes (doesn’t not change with resize of browser; fixed size)\n    * EM = is a measurement that is relevant to the parent (Ex. parent font = 20px, child font = 1.5em = 30px)\n    * REM = is the same as EM, except it’s relative to the base document font (set on html in your css). As mentioned earlier, if you don’t override this, the base font is usually 16px.\n\nHave class work on bootstrap instagram.\n\nAnswer any questions. Remind them this project is due by Friday."
                    },
                    {
                        "id": 7,
                        "label": "Git Workfow",
                        "lessons": [
                            {
                                "slug": "how-to-use-git-version-control-system",
                                "title": "GIT (Version Control System)"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "git",
                                "title": "Git interactive tutorial"
                            }
                        ],
                        "homework": "At the end of the class, present the students with the GIT project & please ask each student to start coding its corresponding part of the Landing Page. Suggested parts: navbar, jumbotron, 2 parts description, product showcase, marketing banner, contact us, footer",
                        "position": 7,
                        "assignments": [],
                        "description": "The CMD Line has millions of tools, it's time to learn the first ones: GIT & Github, together they make collaboration amazing!",
                        "instructions": "Time to explain and practice with GIT in detail, create a repository for your Landing Page GIT proyect and make them clone it and upload their piece of the proyect. Review the key concepts.",
                        "key-concepts": [
                            "Creating SSH Keys",
                            "Using Github",
                            "The Commit Object",
                            "The HEAD",
                            "The Stage",
                            "Branch",
                            "Git FLOW (profesional branching)",
                            "Commit vs PUSH",
                            "Resolving Conflicts"
                        ],
                        "technologies": [
                            "Git",
                            "Github",
                            "Markdown"
                        ],
                        "teacher_instructions": "Time to explain and practice with GIT in detail, create a repository for your Landing Page GIT proyect and make them clone it and upload their piece of the proyect. Review the key concepts."
                    },
                    {
                        "id": 8,
                        "label": "Intro to JS",
                        "lessons": [
                            {
                                "slug": "what-is-javascript-learn-to-code-in-javascript",
                                "title": "Learning to code with JS"
                            },
                            {
                                "slug": "conditionals-in-programing-coding",
                                "title": "Conditionals in Programming or Coding"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "js-beginner",
                                "title": "Introduction to JS"
                            }
                        ],
                        "homework": "Students need to finish the Excuse Generator, make the replits about javascript and the layout for the Random Card Generator",
                        "position": 8,
                        "assignments": [],
                        "description": "HTML & CSS are great, but the world needed interactive pages (not just beautiful text documents). Javascript comes to help us generate HTML & CSS based after the initial text document has already loaded and also re-write the website live based on the user activity.",
                        "instructions": "Begin the class by having students push their changes to the repo, then view the project with the class. The excuse generator is a great way to explain how Javascript and HTML/CSS can play together. Do it with the students as you explain all the programing Key Concepts. Use the VanilaJS boilerplate, that way students will start getting used to it",
                        "key-concepts": [
                            "Variables",
                            "DataTypes",
                            "Arrays",
                            "Functions (anonymus vs normal)",
                            "forEach vs Map Statement",
                            "array.filter",
                            "Every javascript code starts OnLoad",
                            "String Concatenation"
                        ],
                        "technologies": [
                            "Javascript",
                            "HTML5",
                            "CSS3",
                            "Bootstrap",
                            "Transitions"
                        ],
                        "teacher_instructions": "Begin the class by having students push their changes to the repo, then view the project with the class. The excuse generator is a great way to explain how Javascript and HTML/CSS can play together. Do it with the students as you explain all the programing Key Concepts. Use the VanilaJS boilerplate, that way students will start getting used to it"
                    },
                    {
                        "id": 9,
                        "label": "Excuse Generator",
                        "lessons": [
                            {
                                "slug": "working-with-functions",
                                "title": "Working with Functions"
                            }
                        ],
                        "project": {
                            "title": "Code an Excuse Generator in Javascript",
                            "instructions": "https://projects.breatheco.de/project/excuse-generator"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "url": "https://github.com/4GeeksAcademy/javascript-functions-exercises-tutorial",
                                "slug": "javascript-functions-exercises-tutorial",
                                "title": "Practice Javascript Functions Tutorial"
                            }
                        ],
                        "scrollY": 2734,
                        "homework": "",
                        "position": 9,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/tutorial-project-excuse-generator-javascript",
                                "slug": "excuse-generator",
                                "title": "Code an Excuse Generator in Javascript"
                            }
                        ],
                        "description": "The only way to master coding is thru practice, today we'll show you how practice must be done, and we hope you continue practicing on your own time.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Coding Practice Day: Students take turns on the screen, one at a time, one student share the screen and tries completing the exercise, and the others help, every student must go around at least two times. Stop the class and explain JS concepts when needed.",
                        "extended_instructions": "# Exercise Day\n\nExplain to the students how they learnpack exercises work:\n\nThere are 4 main exercises: Begin JS, Arrays, Functions, and Mastering Javascript, and they are supposed to be done in parallel because they share the same concepts E.g: You need to know about strings to know about functions because you probably will use a string within a function.\n\n1. They can start any series of exercises by clicking on the gitpod button in GitHub (using the gitpod extensions)\n2. Once the exercise engine is loaded and the exercises are running they can click \"next\" for each exercise.\n3. If the engine is down the can type `learnpack start` to restart the engine.\n\nThey have to complete all exercises by the end of the Bootcamp and repeat some of them if possible, particularly the \"arrays\" exercises.\n\n## Start Practicing\n\nOpen the begin js exercises and have the class take turns on the screen to complete each exercise during the 3 hours.\n\nNote: You can stop the class anytime and explain a javascript concept if you see they need to re-enforce the concept."
                    },
                    {
                        "id": 10,
                        "label": "Arrays & Loops",
                        "lessons": [
                            {
                                "slug": "what-is-an-array-define-array",
                                "title": "It's Time To Learn What is an Array"
                            }
                        ],
                        "project": {
                            "title": "Domain Name Generator",
                            "instructions": "https://projects.breatheco.de/project/domain-generator"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "url": "https://github.com/4GeeksAcademy/javascript-arrays-exercises-tutorial",
                                "slug": "javascript-array-loops-exercises",
                                "title": "Learn Javascript Arrays and Loops Interactive"
                            }
                        ],
                        "scrollY": 3214,
                        "homework": "",
                        "position": 10,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-domain-generator",
                                "slug": "domain-generator",
                                "title": "Domain Name Generator"
                            }
                        ],
                        "description": "Primitive values like numbers and strings are the most basic way of storing information, but sometimes you want to store more than one value when they are related to each other, for example; A list of student names. For that we have Arrays. The first, most simple and most used data structure in Javascript.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Go over javascript quickly and all the concepts, focus particularly on arrays now. Explain the concept thoroughly and then allow students to complete the exercises by taking turns on sharing the screen.",
                        "extended_instructions": "# Looping and Arrays\n\nWelcome class.\n\n## `1 min` Remind students of the importance of finishing the JS exercises\n\nStudents should be focused on completing those exercises: Begin JS, Loops, Arrays, Functions, and optionally Mastering JS.\nRemind students that reading will do no help, this phase is about practice, practice, and more practice.\n\n## `15 min` Review last class and everything about javascript that we have seen\n\n- We started generating HTML Strings for the first time, that is the developer's ultimate goal.\n- Data Types, Variables, and Arrays.\n- Algorithms run from top to bottom, line by line.\n- You can skip lines with conditionals, repeat lines with loops, and reuse lines with functions.\n- Arrays have items (or values) and index (or position), they start at 0. And you can get the length with `myArray.length`.\n- Concatenate strings using + and the new amazing type of quotes '`' that is easier for creating big dynamic strings.\n\n## `10 min` Talk about looping: with and without arrays (for vs foreach).\n\n- The main objective for a loop is to repeat a bunch of lines of code from the opening curly brace to the closing curly brace.\n- There are several ways of looping but we will focus mainly in the `for` loop for now.\n- Here is a 12min video explaining [all the different ways of looping](https://www.youtube.com/watch?v=U3ZlQSOcOI0).\n- You can add elements to an array with `push`.\n\n## `10 min` Talk more in detail about functions\n\n- Functions are the last thing to learn about basic algorithms (encouragement).\n- You create a function when you find yourself doing the same thing all over.\n- Function's purpose is to receive an input and return an output.\n- The function stops executing after returning.\n- Functions SHOULD USE VARIABLES declared outside of them (best practice).\n- Anonymus function vs normal function.\n- In javascript, we will only use arrow functions (no the original type of function) because they are more similar to other programming languages functions.\n\n## Start completing the Arrays Exercises with the students\n\nOne student at a time sharing the screen to complete the exercise, the teachers help students when they see them going in the wrong direction, its like Peer Programming but there are a lot of navigators and just one driver."
                    },
                    {
                        "id": 11,
                        "label": "Unit Testing",
                        "lessons": [
                            {
                                "slug": "how-to-create-unit-testing-with-Javascript-and-Jest",
                                "title": "How to create unit testing with JEST"
                            }
                        ],
                        "project": {
                            "title": "Your first unit tests with Javascript's Jest Framework",
                            "instructions": "https://projects.breatheco.de/project/unit-test-with-jest"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 3205,
                        "homework": "",
                        "position": 11,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-unit-test-with-jest",
                                "slug": "unit-test-with-jest",
                                "title": "Your first unit tests with Javascript's Jest Framework"
                            }
                        ],
                        "description": "Quality Assurance is one of the most valued skills in big tech major companies, today we are learning how you can write code that tests your previously written code in an automated way. Welcome to unit testing!",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Explain how unit testing works with a very simple example (sum function) and then show the students how the exercises are auto-graded with unite tests, open one of the simplest JS exercises, and show how the tests work. Then start with today's project.",
                        "extended_instructions": "# Practice Day (replits and projects)\n\n## `5 min` Take any questions about javascript\n\nRemind everyone that the all the replits about Javascript are extremelly important, the only way to become better is practicing.\n\n## `10 min` Last review about JS (really fast)\n\n- Everything starts on the window.onload\n- A non declared variable value is `undefined` (this will help them read the console errors)\n- If you forget to return, the function will return `undefined` (this will help them read the console errors)\n- Our main purpose for a front-end coder is to **generate dynamic HTML and CSS**, you will be using algorithms to do so (the need to understand that for better react.js learning curve)\n- All ways of looping are important, including the `for` loop because its the only one with total freedom and we not only loop arrays, we also loop for other reasons.\n- Map vs Foreach: In react we will map all the time because it creates a new array and that is really important.\n- Functions goal is: Receive an input and return and output. The execution stops after returning.\n- What is `myArray.find` and `myArray.filter`. In React we will use them all the time.\n\n## `2 hours` Last Repl.it/Project Intensive before The DOM!!\n\n☢ 😰 🤯 ️Students are overwhelmed!\n\nThis is the most delicate part of the course, there is a **lot of risk on students droping**. Please make sure all of them do lots of replits today.\nDo not teach new concepts!\n\n💡 Tell students that today the MUST ask questions after 5 min of being stuck, They cannot try on their own for 30 minutes before asking, not today.\nThey will have planty of challenges to keep learning on their own tomorrow.\n\n## `45 min` before the class finished, do the student exernal profile with them:\n    - Breafly explain open source and why its important, examples of great software build like that.\n    - Explain that developers like to collaborate in open source and why its important for them.\n    - Pull Request are the best mechanism for collaboration because you don't need permission to push.\n    - Students are required to do a real collaboration to a real open source project by the end of the class to an open source project.\n    - Talk about the importance of having green dots on your github activity graph.\n    - Explain YML breafly.\n    - Help them do they YML file and push a draft of their profile (don't worry about content, just structure).\n    - Once they do their PR they can see their live profile because we are [automatically merging](https://mergify.io/) and deploying.\n    - If the automatic merge does not occur, its probably because their YML has syntax problem, you can review the travis execution log on the pull request details.\n\nNote: They students don't have to worry about the content, today its just about the YML and making it work and show up on the [student list](http://sep.4geeksacademy.co/students/).\n\n5. After their `Student External Profile` is done, they may continue doing replits and finishing their previous projects."
                    },
                    {
                        "id": 12,
                        "label": "Master JS",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [
                            {
                                "url": "https://github.com/4GeeksAcademy/master-javascript-programming-exercises",
                                "slug": "master-javascript-exercises",
                                "title": "Master Javascript with 150 exercises"
                            }
                        ],
                        "homework": "",
                        "position": 12,
                        "assignments": [],
                        "description": "You have a lot of things to catch up on, finish and deliver. Make sure to review all of your assignments. Use your time wisely and ask for questions!...",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Help students finish the pending exercises and projects, students that are up to date can start mastering javascript exercises."
                    },
                    {
                        "id": 13,
                        "label": "The DOM",
                        "lessons": [
                            {
                                "slug": "what-is-front-end-development",
                                "title": "Introduction to Front-End Web Development"
                            },
                            {
                                "slug": "what-is-webpack",
                                "title": "Bundeling with Webpack"
                            },
                            {
                                "slug": "what-is-dom-define-dom",
                                "title": "The DOM"
                            },
                            {
                                "slug": "event-driven-programming",
                                "title": "Events"
                            }
                        ],
                        "project": {
                            "title": "Random Card Generator",
                            "instructions": "https://projects.breatheco.de/project/random-card"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "the-dom",
                                "title": "The DOM"
                            },
                            {
                                "slug": "events",
                                "title": "Events"
                            }
                        ],
                        "homework": "Finish the Random Card and pending replits, start DOM & EVENTS replits",
                        "position": 13,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-random-card",
                                "slug": "random-card",
                                "title": "Random Card Generator"
                            }
                        ],
                        "description": "Ok but how do we use Javascript to build websites? You have to interact with the DOM whenever an event occurs",
                        "instructions": "Do the Random Card but focusing a lot on the workflow (how to plan and begin coding), re-inforce the ONLOAD and PRE-LOAD main events and how to change CSS with JS, make students do the 'Map Of Events' to strategize, start using the breathecode-cli and vanilla-js ",
                        "key-concepts": [
                            "Always use Arrow Functions, never normal functions",
                            "Never use var, always let or const",
                            "Main website events: PreLoad & OnLoad",
                            "The-Runtime (after onload)",
                            "Introduce the DOM",
                            "Use querySelector() to select DOM Elements just like you do with CSS",
                            "Add/Remove CSS Classes to DOM elements",
                            "Please do not attempt to explain the Webpack Config.",
                            "Bundling JS, CSS & Images.",
                            "Include your bundle on index.html"
                        ],
                        "technologies": [
                            "The DOM",
                            "Events",
                            "CSS",
                            "CSS Transitions"
                        ],
                        "teacher_instructions": "Do the Random Card but focusing a lot on the workflow (how to plan and begin coding), re-inforce the ONLOAD and PRE-LOAD main events and how to change CSS with JS, make students do the 'Map Of Events' to strategize, start using the breathecode-cli and vanilla-js "
                    },
                    {
                        "id": 14,
                        "label": "DOM Catch Up",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 4088,
                        "homework": "",
                        "position": 14,
                        "assignments": [],
                        "description": "Work on your current projects and exercises.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Keep practicing DOM with the students.",
                        "extended_instructions": "## Answer questions\n\nThe first 15min of the class are ideal to answer questions while the students connect.\n\n## `10 min` Review the DOM again\n\n- Once the browser recieves the server response it starts building The DOM until `window.onload` gets triggered.\n- The DOM is a LIVE hierarchy that represents the HTML document.\n- The DOM its not the same as the source code, the source code will be the first version of the DOM ants its quickly overriten by the LIVE changes.\n- Draw a DOM example on the whiteboard vs a its corresponding HTML code.\n- Show on the browser the google inspector with the DOM opened (the elements tab).\n- Show how it changes live based on the user/system activity clicks/mouseover/etc.\n- The `querySelector` and `querySelectorAll` will be our main way to use The DOM, the other methods are deprecated: getElementById, byTagName, etc.\n- Once you select DOM element and store it on a variable you can change any of its properties: Styles, Classes, Values, etc. ANY PROPERTY!\n- Code on the google inspector console a small 2 line script showing a querySelector and changing a style:\n- \n```js  \nconst anyDOMElement = document.querySelector(‘.anyClass’);\n//changing a background\nanyDOMElement.style.backgroundColor = ‘black’;\n//adding a class\nanyDOMElement.addClass('d-none');\nanyDOMElement.removeClass('d-none');\n// inner html\nanyDOMElement.innerHTML = \"html string that will be included inside the selector\"\n```\n\n## `20 min` Reinforce what is webpack and the vanilla js boilerplate\n\n1. Explain how to start using the boilerplate.\n2. Show students that the README.md has everything they need to start coding.\n3. Show how to see errors on the terminal.\n4. Show how to see errors on the INSPECTOR.\n\n## `20` Strategize the project!\n\nReact instructions carefully with students and plan a strategy!\n\n- Start strategizing the HTML/CSS.\n- After having one hard coded card and suite, how can you change it dynamically?: \n    - Approach A: Dynamically changing the card css classes. E.g: havin a class `card` and 4 classes `diamons`, `club`, `spade` and `heart`.\n    - Approach B: Using `domElement.styles.color = 'red';` instead of using classes.\n- Use the whiteboard with the students.\n- Every student must participate.\n\n## `2:20` Code the project\n\nOnce the strategy is clear in written down, help students implement it.\n\n## Ask students to finish replits about the DOM."
                    },
                    {
                        "id": 15,
                        "label": "Cond. Profile",
                        "lessons": [],
                        "project": {
                            "title": "Conditional Profile Card Generator",
                            "instructions": "https://projects.breatheco.de/project/conditional-profile-card"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 4873,
                        "homework": "",
                        "position": 15,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-conditional-profile-card",
                                "slug": "conditional-profile-card",
                                "title": "Conditional Profile Card Generator"
                            }
                        ],
                        "description": "What we call \"thinking\" is basically the process of making decisions based on some information (variables) that we have available. You can replicate the same behavior in a computer by using conditionals and logical operations.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Ask students to gather and create a flow chart on the whiteboard with the decision process behind building the html for the profile card project. Finish conditional profile card and all previous exercises. ",
                        "extended_instructions": "## Conditionally Rendering\n\n1. Rendering means printing or displaying.\n2. In HTTP you can only print text, it can be an HTML Text, CSS Text, JSON Text, Javascript Test.\n3. Basically it means generating strings dynamically.\n4. Conditional rendering is what makes your website interactive.\n\n\n### There are 2 ways of writing conditions:  \n\nUsing the `if....else`  statement.  \n\n```js\nlet canDrive = false;\nif(age > 16){\n    // do something\n    canDrive = true;\n}\nelse{\n    canDrive = false;\n}\n```\nOr using a ternary (the most popular for conditional rendering):\n\n```js\nlet canDrive = (age > 16) ? true : false;\n```\nNote: as you can see the ternary is smaller, it's a great and agile resource.\n\n## What is conditional rendering?\n\nIt means using conditions to generate HTML dynamically. Basically, your HTML will be different depending on certain **conditions** that you determine.\n\nFor example, using the same condition before:\n```js\nlet canDrive = (age > 16) ? \"can\" : \"cannot\";\nlet myHTML = 'I ' + canDrive + \" drive\";\n\n// myHTML will be either \"I can drive\" or \"I cannot drive\"\n```\n\nWith the javascript template literrals is even easier to generate strings dynamically.\n\n```js\n\nlet person = {\n    name: \"Alejandro\",\n    age: 17\n}\nlet myHTML = `\n    <div>\n          <p>My name is ${person.name}</p>\n          <p>and I am ${person.age > 21 ? \"capable\" : \"not capable\"} to drink</p>\n    </div>\n`;\n```\nThis javascript code will output the following HTML:\n\n```html\n    <div>\n          <p>My name is Alejandro</p>\n          <p>and I am capable to drink</p>\n    </div>\n```\n\n"
                    },
                    {
                        "id": 16,
                        "label": "Intro to React",
                        "lessons": [
                            {
                                "slug": "javascript-import",
                                "title": "JavaScript Import and Export of Modules"
                            },
                            {
                                "slug": "learn-react-js-tutorial",
                                "title": "Learn React Here : React Js Tutorial"
                            },
                            {
                                "slug": "making-react-components",
                                "title": "Creating React.js Components"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "react-exercises",
                                "title": "Learn React.js Interactively"
                            }
                        ],
                        "scrollY": 3405,
                        "homework": "",
                        "position": 16,
                        "assignments": [],
                        "description": "But working with the DOM can get tricky and it's resource consuming, for that and many other reasons libraries like React.js got popular in the last couple of years. The let you create HTML and CSS using JS in a very intuitive way",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Make students create their first react components and explain the use of JSX. Only talk about functional components, class components are deprecated and we will be using only hooks. ",
                        "extended_instructions": "# Continue working on the Landing Page\n\n## `5 min` Take any questions about javascript/react/bootstrap/html/css\n\nRemind everyone that doing the replits about Javascript is extremelly important, the only way to become better is practicing, not reading or waching videos.\n\n## `20 min` Review React.js again.\n\n- React is about components (component names MUST be written in PascalCase)\n- You build components by creating functions (the only function in the worls of JS that MUST start in capital letters)\n- Functions must return HTML.\n- Those functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n\n```\n🔥  We are not using component classes\n\nClass Componets are legacy, we recommend to ignore them as they will disappear in the next 1-2 years.\n```\n\n## `15min` Show the class again how to create a component\n\n- Create a simple component like the bootstrap card or the bootrap modal.\n- Make sure the component does not have a state, only props.\n- Explain the props in detail.\n\n\n☢ 😰 🤯 ️Students are overwhelmed ! Don't talk to much because they won't listen.\n\n💡 Tell students that today its not the day to be brave and find your own solutions, today its about asking questions after 5 minutes."
                    },
                    {
                        "id": 17,
                        "label": "React Landing",
                        "lessons": [],
                        "project": {
                            "title": "Landing Page with React",
                            "instructions": "https://projects.breatheco.de/project/landing-page-with-react"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 5677,
                        "homework": "",
                        "position": 17,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-landing-page-with-react",
                                "slug": "landing-page-with-react",
                                "title": "Landing Page with React"
                            }
                        ],
                        "description": "As a react developer you will be creating landing pages every day, you have already build a couple using HTML/CSS and now it's time to build it in React.js",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "A landing page is perfect to start practicing how to make react components in a real-life project, this project can be done in teams of two people to practice GIT collaboration as well.",
                        "extended_instructions": "No new conecpts today, just go over react again and focus in the process of creating components.\n\nYou can create a react component for each bootstrap component."
                    },
                    {
                        "id": 18,
                        "label": "Building Components",
                        "lessons": [],
                        "project": {
                            "title": "Simple Counter",
                            "instructions": "https://projects.breatheco.de/project/simple-counter-react"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 3587,
                        "homework": "Students must finish the simple counter with react for the next class",
                        "position": 18,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-simple-counter-react",
                                "slug": "simple-counter-react",
                                "title": "Simple Counter"
                            }
                        ],
                        "description": "Its the first time you've heard or learn about react, we have given you a lot of exercises to practice. Please practice like crazy with all of them. Ask questions",
                        "instructions": "It's the first time students will be using objects, explain the concept. Make students create their first react components and explain the use of JSX. Explain the difference between Functional components and or class components and the render function. Landing page project should be a code along at start, then groups at end.",
                        "key-concepts": [
                            "Export -> Import modules",
                            "You can create your own tags",
                            "Create a Component like a Class",
                            "Create a Component like a Function",
                            "Use of the render method"
                        ],
                        "technologies": [
                            "React",
                            "Webpack",
                            "Babel.js",
                            "JS Modules",
                            "JS Classes"
                        ],
                        "teacher_instructions": "Use half of the class to explain Hooks. Students have now a lot of homework: The React Replits,, Counter and the Landing page. Work with students to help them complete the developments.\",\n",
                        "extended_instructions": "## Continue working on the Landing Page\n\n## `5 min` Take any questions about javascript/react/bootstrap/html/css\n\nRemind everyone that doing the replits about Javascript is extremelly important, the only way to become better is practicing, not reading or waching videos.\n\n## `20 min` Review React.js again.\n\n- React is about components (component names MUST be written in PascalCase)\n- You build components by creating functions (the only function in the worls of JS that MUST start in capital letters)\n- Functions must return HTML.\n- Those functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n\n```\n🔥  We are not using component classes\n\nClass Componets are legacy, we recommend to ignore them as they will disappear in the next 1-2 years.\n```\n\n## `15min` Show the class again how to create a component\n\n- Create a simple component like the bootstrap card or the bootrap modal.\n- Make sure the component does not have a state, only props.\n- Explain the props in detail.\n\n\n☢ 😰 🤯 ️Students are overwhelmed ! Don't talk to much because they won't listen.\n\n💡 Tell students that today its not the day to be brave and find your own solutions, today its about asking questions after 5 minutes."
                    },
                    {
                        "id": 19,
                        "label": "The State",
                        "lessons": [
                            {
                                "slug": "react-hooks-explained",
                                "title": "React Hooks Explained"
                            }
                        ],
                        "project": {
                            "title": "Traffic Light",
                            "instructions": "https://projects.breatheco.de/project/traffic-light-react"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 3682,
                        "homework": "",
                        "position": 19,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-traffic-light-react",
                                "slug": "traffic-light-react",
                                "title": "Traffic Light"
                            }
                        ],
                        "description": "So far you know that React components have properties (props), but there is one more important concept in react components: The State. ",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Do not explain react components with classes, it's still being used in the industry but less every day. Let's focus on mastering the useState function.",
                        "extended_instructions": "# Creating Components with States\n\n## `10 min` Take any questions about javascript/react/bootstrap/html/css\n\nRemind everyone that doing the replits about Javascript is extremelly important, the only way to become better is practicing, not reading or waching videos.\n\n## `10 min` Review React.js\n\n- React is about components (component names MUST be named in `PascalCase` notation)\n- You build components by creating functions that later will become `<Tags>` (with capital first letter)\n- Component Functions must **always** return HTML.\n- Those component functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n\n## `20 min` The state\n\n- The function useState must be used when information inside the component o website changes over time, for Example: \n    - A timer: the current time changes every second (or even milisec).\n    - Todo list: the array of todos grows over time.\n    - Fetch requests: When information comes from a nother server it was empty first and then it changes.\n\n- State vs Props:\n      1. State is declared inside the component.\n      2. Props are declared outside of the component and are read only within the inside of the component.\n\n- Show an example os using the useState.\n```js\n\n//            ⬇ value  ⬇ modifier                  ⬇ default\nconst [ value, setValue ] = useState(defaultValue);\n```\n- you can have as many states as you want\n\n### The state is inmutable:\n\nThis is wrong:\n```jsx\nconst [ todos, setTodos ] = useState([]);\n\n// ⬇  WRONG!!!!!  ⬇\nconst addTodo = (text) => {\n  todos.push(text)\n  setTodos(todos);\n}\n\n\n// ⬇  GOOD!!!!!  ⬇\nconst addTodo = (text) => {\n const newTodos =  todos.concat([text])\n  setTodos(newTodos);\n}\n```"
                    },
                    {
                        "id": 20,
                        "label": "Todo List",
                        "lessons": [
                            {
                                "slug": "controlled-vs-uncontrolled-inputs-react-js",
                                "title": "What are controlled and/or uncontrolled inputs in React.js"
                            }
                        ],
                        "project": {
                            "title": "Todolist Application Using React",
                            "instructions": "https://projects.breatheco.de/project/todo-list"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 6805,
                        "homework": "Students must finish the TodoList being able to add & delete tasks.",
                        "position": 20,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-todo-list",
                                "slug": "todo-list",
                                "title": "Todolist Application Using React"
                            }
                        ],
                        "description": "Finally we can create our own HTML tags and re-use them on several projects and views. The key to understand a component is understanding Props and The State. Please start working on the Todo-List Application. This project will be useful in your future as a coder!",
                        "instructions": "Review landing page. React as rendering engine: Students need to understand that now they can finally create their own HTML tags (React Components) and how to use the State and the Props",
                        "key-concepts": [
                            "Condigional Rendering",
                            "The component state",
                            "The state is inmutable",
                            "Using const, map, filter and concat to prevent state mutation"
                        ],
                        "technologies": [
                            "React",
                            "Javascript",
                            "Events"
                        ],
                        "teacher_instructions": "Review landing page. React as rendering engine: Students need to understand that now they can finally create their own HTML tags (React Components) and how to use the State and the Props",
                        "extended_instructions": "# Creating Components with States\n\n## `10 min` Take any questions publicly\n\nRemind everyone that doing the exercises about Javascript is extremely important, the only way to become better is practicing, not reading or watching videos.\n\n## `10 min` Review React.js (yes, again)\n\n- React is about components (component names MUST be named in `PascalCase` notation)\n- You build components by creating functions (the only function in the worls of JS that MUST start in capital letters)\n- Functions must return HTML.\n- Those functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n\n## `20min` Go over the component `useState` hook again\n\n- Properties are defined **ouside** of the component.\n- The State is defined **inside** of the component.\n- The state is needed when information inside the component will **change over time**.\n- You can have as many states as you want.\n- Talk about controlled inputs with an example.\n\n\n## `2:25 min` Start the todolist with the students\n\nAny other project the student may have until this day (like the Traffic Light) is supposed to be done on their own time.\n\n- You can help them a lot on this exercise, but always do it on the whiteboard.\n- Help them do the strategy first and later help them complete the exercise.\n- This exercise is challenging for the majority of the students, but you will be able to manage if you continue helping them individually."
                    },
                    {
                        "id": 21,
                        "label": "React Router",
                        "lessons": [
                            {
                                "slug": "routing-our-views-with-react-router",
                                "title": "Using React Router"
                            },
                            {
                                "slug": "context-api",
                                "title": "Global state with the Context API"
                            },
                            {
                                "slug": "what-is-react-flux",
                                "title": "Learn What is React Flux"
                            }
                        ],
                        "project": {
                            "title": "Create a Todolist with Context.API and Flux",
                            "instructions": "https://projects.breatheco.de/project/todo-list-react-context"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 4270,
                        "homework": "Sit with every project team and discuss how to split the code into Views and React.Components, students must finish the home layout by next class",
                        "position": 21,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-todo-list-react-context",
                                "slug": "todo-list-react-context",
                                "title": "Create a Todolist with Context.API and Flux"
                            }
                        ],
                        "description": "But some react components will never be re-used, they behave more like page or layout. We will call those components: 'Views'... React will help us connect them together to create our main website navegation",
                        "instructions": "React Router + React: How to create components that behave like Views (layouts) and match them with URL Routers.",
                        "key-concepts": [
                            "React Router",
                            "Router: Matching URLs Views",
                            "Component vs View",
                            "The Component State",
                            "Using the React Debugging Chrome Plugin",
                            "Debugging code with the Chrome Source Tab"
                        ],
                        "technologies": [
                            "Minimum Viable Product",
                            "React Router",
                            "The Chrome Inspector"
                        ],
                        "teacher_instructions": "This project is all about URLs and Routing. Each student must build two views/pages. List of ",
                        "extended_instructions": "# Advanced React Boilerplate \n\n## `5min` Questions about Context and React Router\n\nIf someone asks about redux tell them we focus on Flux instead of Redux because its a lot easier to setup and its also widely used on the market.\nRedux is a simplification of Redux, students will no have problems setting it up in the future but we are interested in learning the process behind.\n\n## `10min` Review the React and Context API\n\n- React is about components (component names MUST be written in caps)\n- You build components by creating functions or classes (both MUST start in capital letters)\n- Review how to create a class vs functional component\n- The component objective is to create HTML.\n- You can pass props to compoentns `<Tag property={value}>`\n- You can persist those variables to the DOM using `this.setState`\n- API Calls (fetch) should be done on `componentDidMount`\n- Review how to code a fetch\n- The Context API is about: View, Actions, Store (MVC)\n    - The view renders and triggers actions\n    - Actions setStore\n    - store is just a store, you have to model your data and initialized it\n    - fetch call must be done on component did mount.\n\n## `45 min` Live Coding\n\n-Show students the way you would do this project. Take all the questions and make questions as well if they don't take the initiative.\n\n## `2:00min` Continue working on the Starwars Blog\n\n"
                    },
                    {
                        "id": 22,
                        "label": "HTTP Requests",
                        "lessons": [
                            {
                                "slug": "the-fetch-javascript-api",
                                "title": "The Fetch API"
                            },
                            {
                                "slug": "asynchronous-algorithms-async-await",
                                "title": "Creating asynchronous algorithms"
                            },
                            {
                                "slug": "understanding-rest-apis",
                                "title": " Understanding Rest APIs"
                            }
                        ],
                        "project": {
                            "title": "Todolist Application Using React and Fetch",
                            "instructions": "https://projects.breatheco.de/project/todo-list-react-with-fetch"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 4041,
                        "homework": "",
                        "position": 22,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-todo-list-react-with-fetch",
                                "slug": "todo-list-react-with-fetch",
                                "title": "Todolist Application Using React and Fetch"
                            }
                        ],
                        "description": "Most of the applications build on the internet require some king of database synchronization, normal made through several API requests",
                        "key-concepts": [
                            "What is HTTP",
                            "POSTing, PUTing and DELETEing data to the server",
                            "How to display \"loading\" before data arrives",
                            "async/await (optional)",
                            "How to use POSTMAN (set environment variables and use collections)",
                            "JSON is a Javascript object but as a TEXT",
                            "Serialize>send>Unserialize",
                            "What is serialization and how to do it",
                            "Why use several request types: GET, POST, PUT, DELETE"
                        ],
                        "technologies": [],
                        "teacher_instructions": "Introduce the concept of fetching help students finish the todo list(unstuck them) and incorporate the synconization with the API. Then, introduce the new Todo List with React and Fetch.\n",
                        "extended_instructions": "# Using Fetch to request information from API's\n\n## `5 min` Take any questions about javascript/react\n\nRemind everyone that doing the replits extremelly important, the only way to become better is practicing, not reading or waching videos.\n\n## `10 min` Review React.js\n\n- React is about components (component names MUST be written in caps)\n- You build components by creating functions (the only function in the worls of JS that MUST start in capital letters)\n- Functions must return HTML.\n- Those functions can receive information in the form of Properties `<Tag property={value}>`\n- Now its className intead of class.\n- Everything starts on ReactDOM.render()\n- JSX is great because you can mix HTML with JS using braces/curly brackets.\n- Review how to create class component\n- You can have shared variables withing the entire class using `this`\n- You can persist those variables to the DOM using `this.setState`\n```js\n\n// second approach\nimport { Component } from 'react';\nclass TodoList extends Component{\n    constructor(){\n        //initialize component persisted values\n        this.state = {\n            hidden: false\n        }\n    }\n    render(){\n        return <div className={'alert alert-danger'}>{this.props.children}</div>;\n    }\n}\n```\n- Props vs State (props are external, state is internal)\n\n## `20 min` Review the Basics of HTTP and segway to API concepts\n\n- Client and Servers interact in the form of text\n- As a client, your job is to setup and send `Requests` with these 4 properties: \n    Method: GET=Read POST=Create PUT=Update DELETE=DELETE\n    Body: the payload (only applies to POST and PUT) and must be formated in csv,json,xml or similar.\n    Content-Type: the format that the payload will have.\n    URL: Where the request is going to be sent.\n- Go over the concept of serialization (form json string -> to real object in javascript)\n- You have to wait for the response using Promises (do not explain async/await yet)\n- This is how a typical [API documentation looks](http://assets.breatheco.de/apis/fake/todos/), next project we will be using a real life Starwars API.\n\n## `20 min` Consuming API's using the Fetch method in Javascript\n\nNow, for the first time, we have a way of askin for aditional information during runtime\n\n```js\nfetch('url/to/fetch', additionalSettings)\n    .then(resp => {\n        console.log(resp.ok); // will be tru if the response is successfull\n        console.log(resp.status); // the status code = 200 or code = 400 etc.\n        console.log(resp.text()); // will try return the exact result as string\n        return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results\n    })\n    .then(data => {\n        //here is were your code should start after the fetch finishes\n        console.log(data); //this will print on the console the exact object received from the server\n    })\n    .catch(error => {\n        //error handling\n        console.log(error);\n    })\n```\n# Consuming REST API's to GET, POST, PUT and DELETE\n\nToday we will be using the Fetch API to create POST/PUT/DELETE methods.\n\n## Explain how to code a fetch request to successfully implemente the GET/POST/PUT/DELETE with JS\n\nIn the following example, the `additionalSettings` variable has the key to everything, you can specify the Content-Type, Method, and Body of the request.\n\n```js\n\nconst additionalSettings = {\n    \"headers\": {\n        \"method\": \"POST\",\n        \"Content-Type\": \"application/json\",\n        \"body\": JSON.stringify(someObject)\n    }\n}\n\nfetch('url/to/fetch', additionalSettings)\n    .then(resp => {\n        console.log(resp.ok); // will be tru if the response is successfull\n        console.log(resp.status); // the status code = 200 or code = 400 etc.\n        console.log(resp.text()); // will try return the exact result as string\n        return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results\n    })\n    .then(data => {\n        //here is were your code should start after the fetch finishes\n        console.log(data); //this will print on the console the exact object received from the server\n    })\n    .catch(error => {\n        //error handling\n        console.log(error);\n    })\n```\n\n## `2:30min` Start Todo list with React and Fetch\n\nThis project uses everything we have seen so far: The Context API, Fetch, HTML/CSS, etc.\nThe idea is to practice everything but the only new concept will be doing POST/PUT/DELETE.\n\n\n"
                    },
                    {
                        "id": 23,
                        "label": "Flux",
                        "lessons": [],
                        "project": {
                            "title": "Contact List App Using React & Context",
                            "instructions": "https://projects.breatheco.de/project/contact-list-context"
                        },
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 5788,
                        "homework": "",
                        "position": 23,
                        "assignments": [
                            {
                                "url": "https://github.com/breatheco-de/exercise-contact-list-context",
                                "slug": "contact-list-context",
                                "title": "Contact List App Using React & Context"
                            }
                        ],
                        "description": "Let's breathe a little bit, work on finishing all previous projects and assignments.",
                        "key-concepts": [],
                        "technologies": [],
                        "teacher_instructions": "Nothing today, work with students on finishing the meetup clone or any other pending activity.",
                        "extended_instructions": "Nothing new today, just help students finish pending activities and go over any concept that you feel needs to be re-enfoced like:\n\n- HTTP\n- Asyncrunus Programing\n- React Components: State vs Props\n- Flux: Action, View, Store.\n- Fetch API\n- The DOM and Events\n- React Router."
                    },
                    {
                        "id": 24,
                        "label": "Data Modeling",
                        "lessons": [
                            {
                                "slug": "what-is-sql-database",
                                "title": "Mastering Databases: What is SQL Database"
                            }
                        ],
                        "quizzes": [],
                        "replits": [],
                        "scrollY": 6199,
                        "homework": "Students must build the needed model to build the Meetup-Clone API and the API RESTful services to CRUD the models",
                        "position": 24,
                        "assignments": [],
                        "description": "Learn how to data-model your application database and business model and run your first WordPress installation.",
                        "instructions": "Use Composer+WPCLI to install (WordPress + WPAS Dash + ACPT Plugin) and demonstrate how create you own WordPress model. Explain what Entities are and Entity-Relationship Diagram. Do not explain composer that much (do the analogy with NPM) and do not explain WP-CLI to much either, start using it and students will learn by doing",
                        "key-concepts": [
                            "Database Entities: Modeling Data with Wordpress",
                            "The WordPress Dashboard",
                            "Creating a CPT",
                            "Relationships between Custom Post Types",
                            "POSTMan: How to use it to create all types of requests, headers and content-types"
                        ],
                        "technologies": [
                            "HTTP",
                            "JSON",
                            "REST",
                            "API's",
                            "Serialization",
                            "Custom Post Types",
                            "Composer",
                            "WordPress Dash",
                            "WP-CLI"
                        ],
                        "teacher_instructions": "Start the class talking about data-models and help students create their Meetup.com data model.\n\nThen, start using the WordPress boilerplate to create your first Custom Post Types for each table and create the properties using Advanced Custom Fields.",
                        "extended_instructions": "# Data Modeling whith UML\n\n## `5 min` Take 5 minutes to explain the difference beween data-structures and data-models\n\nYou can think about data-structures like he RAM Memory repersentation of data-models, for example:\n\n- Data structures are stuff like: Arrays, Queues (FIFO, FILO), Classes, etc.\n- Data models are ways of structuring the database.\n\nThe data-structure of your Reac.tjs projects will: The Store (RAM Memory).\nBut the data-model is only represented on the backend database.\n\n## `20 min` Today it is about: Data Modeling\n\n[This video](https://www.youtube.com/watch?v=UI6lqHOVHic&list=PLUoebdZqEHTxNC7hWPPwLsBmWI0KEhZOd) shows how to create a UML diagram, make students watch the video.\nExplain the basics of UML with a simple Car dealer example: Vehicle, Client, Purchase.\n\n- What are the possible data-types in a car dealer? Number, Boolean, String, etc.\n- What properties can a Vehicle, Client or Purchase have?\n- What are tthe relationships between the models (one-to-one, one-to-many, many-to-many)?\n    - How many Vehicles a Client can have?\n    - How many y Purchases a Client can do?\n    - How many Vehicles can a Purchase contain?\n\n## `2:30` Data-Modeling project\n\nWork on today's project."
                    },
                    {
                        "id": 25,
                        "label": "Authentication",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must work on the project",
                        "position": 25,
                        "assignments": [],
                        "description": "",
                        "instructions": "Work with students on the project",
                        "technologies": [],
                        "teacher_instructions": "Work with students on the project"
                    }
                ],
                "slug": "web-development",
                "label": "Web Development",
                "profile": "web-development",
                "version": "2",
                "description": "",
                "academy_author": "4"
            },
            "version": 3,
            "updated_at": "2021-09-14T23:33:08.582492Z",
            "created_at": "2021-09-14T23:33:08.582469Z",
            "slug": "web-development",
            "name": "Web Developer",
            "syllabus": 30,
            "duration_in_hours": 126,
            "duration_in_days": 42,
            "week_hours": 9,
            "github_url": null,
            "logo": null,
            "private": false
        },
        {
            "json": {
                "days": [
                    {
                        "id": 1,
                        "label": "Day 1",
                        "lessons": [
                            {
                                "slug": "intro-to-prework",
                                "title": "Introduction to the pre-work"
                            },
                            {
                                "slug": "what-is-the-internet",
                                "title": "Internet Architecture"
                            },
                            {
                                "slug": "what-is-html-learn-html",
                                "title": "Learn HTML"
                            },
                            {
                                "slug": "what-is-css-learn-css",
                                "title": "Learn CSS"
                            }
                        ],
                        "project": {
                            "title": "Digital Postcard",
                            "instructions": "https://projects.breatheco.de/project/postcard"
                        },
                        "quizzes": [
                            {
                                "slug": "intro-to-prework",
                                "title": "About the Prework"
                            },
                            {
                                "slug": "html",
                                "title": "Basics of HTML"
                            }
                        ],
                        "replits": [
                            {
                                "slug": "html",
                                "title": "Learn HTML"
                            },
                            {
                                "slug": "forms",
                                "title": "Practice HTML5 Forms"
                            },
                            {
                                "slug": "css",
                                "title": "Learn CSS"
                            }
                        ],
                        "homework": "The students must finish the Postcard on their own (there is a video-tutorial)",
                        "position": 1,
                        "assignments": [
                            {
                                "slug": "postcard",
                                "title": "Digital Postcard"
                            }
                        ],
                        "description": "Welcome to web development: At the beginning there was only HTML, years later CSS appeared, and that's how the web 1.0 came to life",
                        "instructions": "You have 30 min to explain how HTTP works sending-receiving text between servers & clients, how the browsers interpret that text as HTML, CSS or JS and then start coding. Start the postcard HTML on the screen and students should finishe it. Use float layout pursposes instead of display inline-block.",
                        "key-concepts": [
                            "Client vs Server",
                            "HTTP Request vs Response",
                            "Everything is text!",
                            "Browser Interpretation",
                            "Indentation",
                            "HTML is similar to Word: Headings, paragraphs, etc",
                            "HTML vs CSS",
                            "Always Be Closing",
                            "CSS Selectors (basic ones)"
                        ],
                        "technologies": [
                            "HTML5",
                            "CSS"
                        ],
                        "teacher_instructions": "You have 30 min to explain how HTTP works sending-receiving text between servers & clients, how the browsers interpret that text as HTML, CSS or JS and then start coding. Start the postcard HTML on the screen and students should finishe it. Use float layout pursposes instead of display inline-block."
                    },
                    {
                        "id": 2,
                        "label": "Day 2",
                        "lessons": [
                            {
                                "slug": "css-layouts",
                                "title": "Doing Layouts"
                            },
                            {
                                "slug": "mastering-css-selectors",
                                "title": "Advanced CSS Selectors"
                            }
                        ],
                        "project": {
                            "title": "Simple Instagram Photo Feed with HTML/CSS",
                            "instructions": "https://projects.breatheco.de/project/instagram-feed"
                        },
                        "quizzes": [
                            {
                                "slug": "internet-architecture",
                                "title": "Internet Architecture"
                            },
                            {
                                "slug": "css",
                                "title": "Basics of CSS"
                            }
                        ],
                        "replits": [
                            {
                                "slug": "layouts",
                                "title": "Doing Layouts"
                            }
                        ],
                        "homework": "Students must finish the Instagram & the Postcard.",
                        "position": 2,
                        "assignments": [
                            {
                                "slug": "instagram-feed",
                                "title": "Simple Instagram Photo Feed with HTML/CSS"
                            }
                        ],
                        "description": "Then, websites got popular and CSS evolved to enable amazing layouts with boxes and also a ritch set of CSS Selectors",
                        "instructions": "Connecting CSS & HTML: Finish the postcard and start the Instagram Feed. Review all the key concepts with your students.",
                        "key-concepts": [
                            "Do not use ID as CSS selectors (use specificity)",
                            "::Before & ::After Selectors",
                            "DRY Technique",
                            "Box Model"
                        ],
                        "technologies": [
                            "CSS3",
                            "HTML5"
                        ],
                        "teacher_instructions": "Connecting CSS & HTML: Finish the postcard and start the Instagram Feed. Review all the key concepts with your students."
                    },
                    {
                        "id": 3,
                        "label": "Day 3",
                        "lessons": [
                            {
                                "slug": "bootstrap-tutorial-of-bootstrap-4",
                                "title": "Working with Bootstrap"
                            }
                        ],
                        "project": {
                            "title": "Instagram Photo Feed with Bootstrap",
                            "instructions": "https://projects.breatheco.de/project/instagram-feed-bootstrap"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "bootstrap",
                                "title": "Working with Bootstrap"
                            }
                        ],
                        "homework": "",
                        "position": 3,
                        "assignments": [
                            {
                                "slug": "instagram-feed-bootstrap",
                                "title": "Instagram Photo Feed with Bootstrap"
                            }
                        ],
                        "description": "Then, Bootstrap came to profesionalize websites, removing 99% of the layout pain. Everything is a component from now own.",
                        "instructions": "Explain bootstrap and how it solves 99% of the pain. Everything is a component from now own.",
                        "key-concepts": [
                            "Bootstrap",
                            "Components",
                            "Workflow: Identify the components, Copy&Paste them and finally customize them",
                            "Helper/Utility Classes that come with bootstrap",
                            "Explain Layout (grid layout, rows/columns, responsiveness)"
                        ],
                        "technologies": [
                            "Bootstrap"
                        ],
                        "teacher_instructions": "Explain bootstrap and how it solves 99% of the pain. Everything is a component from now own."
                    },
                    {
                        "id": 4,
                        "label": "Weekend",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "weekend": true,
                        "homework": "",
                        "position": 4,
                        "assignments": [],
                        "description": "And God created the coding weekends, the perfect place to partice, share and collaborate with your classmates.",
                        "instructions": "Students must finish all pending proyects!",
                        "teacher_instructions": "Students must finish all pending proyects!"
                    },
                    {
                        "id": 5,
                        "label": "Day 4",
                        "lessons": [
                            {
                                "slug": "the-command-line-the-terminal",
                                "title": "The Command Line"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "the-command-line",
                                "title": "Command Line Interactive Challenge"
                            }
                        ],
                        "homework": "At the end of the class, present the students with the GIT project & please ask each student to start coding its corresponding part of the website.",
                        "position": 5,
                        "assignments": [],
                        "description": "A text editor and the console, that's all you need to be a great coder. Time to master the second one.",
                        "instructions": "Teach the command line to your students, use the CMD challenge to make it very fun! Start with a small explanation about the importance of the CMD and then explain each command after its respective challenge is completed.",
                        "key-concepts": [
                            "Most used CMD commands",
                            "File Directory Hierarchy",
                            "Relative ./ vs Absolute Paths ",
                            "Moving Up ..",
                            "Autocomplete with TAB",
                            "GIT in a general way"
                        ],
                        "technologies": [
                            "Command Line",
                            "Bash Scripts"
                        ],
                        "teacher_instructions": "Teach the command line to your students, use the CMD challenge to make it very fun! Start with a small explanation about the importance of the CMD and then explain each command after its respective challenge is completed."
                    },
                    {
                        "id": 6,
                        "label": "Day 5",
                        "lessons": [
                            {
                                "slug": "learn-in-public",
                                "title": "Learn in Public"
                            },
                            {
                                "slug": "how-to-use-git-version-control-system",
                                "title": "How to use GIT: Version Control System"
                            }
                        ],
                        "project": {
                            "title": "Fix the Misspell Challenge",
                            "instructions": "https://projects.breatheco.de/project/fix-the-misspell"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Stundents should finish their project and remember to read the next lesson before next class.",
                        "position": 6,
                        "assignments": [
                            {
                                "slug": "fix-the-misspell",
                                "title": "Fix the Misspell Challenge"
                            },
                            {
                                "slug": "learn-in-public",
                                "title": "Learn in Public"
                            }
                        ],
                        "description": "Github is an amazing social network for developers, let's learn how to collaborate and contribute while coding.",
                        "key-concepts": [
                            "Do not explain Git with SSH credentials  in detail, students must use HTTP",
                            "Why using Github?",
                            "It will be impossible to avoid using Github",
                            "Commit object",
                            "The HEAD",
                            "The stage",
                            "Branch",
                            "How to switch branches",
                            "Commit vs Push",
                            "Pull vs Fetch",
                            "Resolving Conflicts"
                        ],
                        "teacher_instructions": "Start explaining Github as a social network, how it stores 90% of the world's codebase, how you can review all major coding projects, follow the most influential developers, and the role of open source.\n\nThen explain GIT without being very technical, the \"Github for poets\" video does a great explanation, we will get more technical the next class that we will collaborate on building a landing page.",
                        "extended_instructions": "# Welcome to Github\n\n**Welcome everyone, Check if they were able to finish all the lessons, exercises, and projects up till now.**\n\n### Explaining Github\n\n1. As we mentioned in previous classes, Github & Git have become a staple of every development workflow.\n\n2. You will use this in EVERY development job you have from here forward.\n\n3. Show the main profile screen and explain parts\n\n    - Use [https://github.com/gaearon](https://github.com/gaearon) as example.\n    - Explain about the github activity graph, how github tracks your entire activity and other developers and recruiters can see it\n\n\n4. Explain how to create a repository\n\n    - click repository tab > new repo button > fill out data\n\n5. Show what a repository looks like\n\n   - explain the contents of the repository and the importance of the Readme file in a project.\n   - Show popular repositories like react, vue, flask, etc. Show them the README files.\n   - show [the git collaboration readme](https://github.com/breatheco-de/exercise-collaborative-html-website) as an example \n\n## The role of open-source\n\n- Explain about open source, how the most important projects in the coding world are open source like: Chrome, Windows, React, Pyhton, Flask, Django, etc.\n\n- In the open source world anyone can pull request anything, there are maintainers that review and approve changes.\n- 4Geeks Academy syllabus is open source and you can Pull Request (lessons and projects)\n\n\n## `1 hr` Project: Fixing Misspells as the perfect Open Source Ice-Breaker\n\nShow students how every lesson on breathecode has the github logo on the top, and you can contrute or fix any lesson by clicking on the github logo and then editing the lesson file on github.\n    \nCreate repositories for all previous workspaces and upload all your code to their corresponding repo’s. Then submit the assignments on your student.breatheco.de  **(DUE MONDAY). Also, work on all repl’its and get caught up. Be ready for the next class which is on Wireframing and design process.**\n\n## `1hr` The student External Profile\n\nEncourage students to do their first pull request with the student external profile: [sep.4geeksacademy.co](https://sep.4geeksacademy.co)"
                    },
                    {
                        "id": 7,
                        "label": "Day 6",
                        "lessons": [
                            {
                                "slug": "how-to-use-git-version-control-system",
                                "title": "GIT (Version Control System)"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "git",
                                "title": "Git interactive tutorial"
                            }
                        ],
                        "homework": "At the end of the class, present the students with the GIT project & please ask each student to start coding its corresponding part of the Landing Page. Suggested parts: navbar, jumbotron, 2 parts description, product showcase, marketing banner, contact us, footer",
                        "position": 7,
                        "assignments": [],
                        "description": "The CMD Line has millions of tools, it's time to learn the first ones: GIT & Github, together they make collaboration amazing!",
                        "instructions": "Time to explain and practice with GIT in detail, create a repository for your Landing Page GIT proyect and make them clone it and upload their piece of the proyect. Review the key concepts.",
                        "key-concepts": [
                            "Creating SSH Keys",
                            "Using Github",
                            "The Commit Object",
                            "The HEAD",
                            "The Stage",
                            "Branch",
                            "Git FLOW (profesional branching)",
                            "Commit vs PUSH",
                            "Resolving Conflicts"
                        ],
                        "technologies": [
                            "Git",
                            "Github",
                            "Markdown"
                        ],
                        "teacher_instructions": "Time to explain and practice with GIT in detail, create a repository for your Landing Page GIT proyect and make them clone it and upload their piece of the proyect. Review the key concepts."
                    },
                    {
                        "id": 8,
                        "label": "Weekend",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "weekend": true,
                        "homework": "",
                        "position": 8,
                        "assignments": [],
                        "description": "It has been two crazy weeks, thank God we have another coding weekend to keep up and practice.",
                        "instructions": "Students must finish HTML, CSS3, Layout, Bootstrap, GIT and deliver all the projects through the online platform.",
                        "teacher_instructions": "Students must finish HTML, CSS3, Layout, Bootstrap, GIT and deliver all the projects through the online platform."
                    },
                    {
                        "id": 9,
                        "label": "Day 7",
                        "lessons": [
                            {
                                "slug": "what-is-javascript-learn-to-code-in-javascript",
                                "title": "Learning to code with JS"
                            },
                            {
                                "slug": "what-is-an-array-define-array",
                                "title": "Looping and Arrays"
                            }
                        ],
                        "project": {
                            "title": "Code an Excuse Generator in Javascript",
                            "instructions": "https://projects.breatheco.de/project/excuse-generator"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "js-beginner",
                                "title": "Introduction to JS"
                            },
                            {
                                "slug": "arrays",
                                "title": "Arrays and Loops"
                            },
                            {
                                "slug": "functions",
                                "title": "Working with functions"
                            },
                            {
                                "slug": "js-devmaker",
                                "title": "Mastering JS"
                            }
                        ],
                        "homework": "Students need to finish the Excuse Generator, make the replits about javascript and the layout for the Random Card Generator",
                        "position": 9,
                        "assignments": [
                            {
                                "slug": "excuse-generator",
                                "title": "Code an Excuse Generator in Javascript"
                            }
                        ],
                        "description": "HTML & CSS are great, but the world needed interactive pages (not just beautiful text documents). Javascript comes to help us generate HTML & CSS based after the initial text document has already loaded and also re-write the website live based on the user activity.",
                        "instructions": "Begin the class by having students push their changes to the repo, then view the project with the class. The excuse generator is a great way to explain how Javascript and HTML/CSS can play together. Do it with the students as you explain all the programing Key Concepts. Use the VanilaJS boilerplate, that way students will start getting used to it",
                        "key-concepts": [
                            "Variables",
                            "DataTypes",
                            "Arrays",
                            "Functions (anonymus vs normal)",
                            "forEach vs Map Statement",
                            "array.filter",
                            "Every javascript code starts OnLoad",
                            "String Concatenation"
                        ],
                        "technologies": [
                            "Javascript",
                            "HTML5",
                            "CSS3",
                            "Bootstrap",
                            "Transitions"
                        ],
                        "teacher_instructions": "Begin the class by having students push their changes to the repo, then view the project with the class. The excuse generator is a great way to explain how Javascript and HTML/CSS can play together. Do it with the students as you explain all the programing Key Concepts. Use the VanilaJS boilerplate, that way students will start getting used to it"
                    },
                    {
                        "id": 10,
                        "label": "Day 8",
                        "lessons": [
                            {
                                "slug": "what-is-front-end-development",
                                "title": "Introduction to Front-End Web Development"
                            },
                            {
                                "slug": "what-is-webpack",
                                "title": "Bundeling with Webpack"
                            },
                            {
                                "slug": "what-is-dom-define-dom",
                                "title": "The DOM"
                            },
                            {
                                "slug": "event-driven-programming",
                                "title": "Events"
                            }
                        ],
                        "project": {
                            "title": "Random Card Generator",
                            "instructions": "https://projects.breatheco.de/project/random-card"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "the-dom",
                                "title": "The DOM"
                            },
                            {
                                "slug": "events",
                                "title": "Events"
                            }
                        ],
                        "homework": "Finish the Random Card and pending replits, start DOM & EVENTS replits",
                        "position": 10,
                        "assignments": [
                            {
                                "slug": "random-card",
                                "title": "Random Card Generator"
                            }
                        ],
                        "description": "Ok but how do we use Javascript to build websites? You have to interact with the DOM whenever an event occurs",
                        "instructions": "Do the Random Card but focusing a lot on the workflow (how to plan and begin coding), re-inforce the ONLOAD and PRE-LOAD main events and how to change CSS with JS, make students do the 'Map Of Events' to strategize, start using the breathecode-cli and vanilla-js ",
                        "key-concepts": [
                            "Always use Arrow Functions, never normal functions",
                            "Never use var, always let or const",
                            "Main website events: PreLoad & OnLoad",
                            "The-Runtime (after onload)",
                            "Introduce the DOM",
                            "Use querySelector() to select DOM Elements just like you do with CSS",
                            "Add/Remove CSS Classes to DOM elements",
                            "Please do not attempt to explain the Webpack Config.",
                            "Bundling JS, CSS & Images.",
                            "Include your bundle on index.html"
                        ],
                        "technologies": [
                            "The DOM",
                            "Events",
                            "CSS",
                            "CSS Transitions"
                        ],
                        "teacher_instructions": "Do the Random Card but focusing a lot on the workflow (how to plan and begin coding), re-inforce the ONLOAD and PRE-LOAD main events and how to change CSS with JS, make students do the 'Map Of Events' to strategize, start using the breathecode-cli and vanilla-js "
                    },
                    {
                        "id": 11,
                        "label": "Day 9",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Finish all replits and projects before we can start learning about React.js",
                        "position": 11,
                        "assignments": [],
                        "description": "We have learned a lot and very fast, your brain needs some time to adjust and move all that knowledge into the hypothalamus. This class is an excellent opportunity to bring questions, work on strenuous exercises and receive a lot of help from the mentors!",
                        "instructions": "Work with students in finishing all pending replits including DOM and Events.",
                        "teacher_instructions": "Work with students in finishing all pending replits including DOM and Events."
                    },
                    {
                        "id": 12,
                        "label": "Weekend",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "weekend": true,
                        "homework": "",
                        "position": 12,
                        "assignments": [],
                        "description": "Saturdays are a great oportunity to work full-day on your coding skills, extra lessons without extra charge. You will only sacrifice 14 Saturdays and your life will change forever.",
                        "instructions": "During the weekend, students must finish all the replits",
                        "teacher_instructions": "During the weekend, students must finish all the replits"
                    },
                    {
                        "id": 13,
                        "label": "Day 10",
                        "lessons": [
                            {
                                "slug": "what-is-object-oriented-programming-concepts",
                                "title": "Object Oriented Programming"
                            },
                            {
                                "slug": "learn-react-js-tutorial",
                                "title": "Building interfaces with React"
                            },
                            {
                                "slug": "making-react-components",
                                "title": "Creating React.js Components"
                            }
                        ],
                        "project": {
                            "title": "Simple Counter",
                            "instructions": "https://projects.breatheco.de/project/simple-counter-react"
                        },
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "object-oriented-programing",
                                "title": "Object Oriented Programming"
                            },
                            {
                                "slug": "react-js",
                                "title": "Using React.js as a Rendering Engine"
                            }
                        ],
                        "homework": "Students must finish the landing page with react for the next class",
                        "position": 13,
                        "assignments": [
                            {
                                "slug": "simple-counter-react",
                                "title": "Simple Counter"
                            },
                            {
                                "slug": "traffic-light-react",
                                "title": "Traffic Light"
                            },
                            {
                                "slug": "landing-page-with-react",
                                "title": "Landing Page with React"
                            }
                        ],
                        "description": "But working with the DOM can get tricky and it's resource consuming, for that and many other reasons libraries like React.js got popular in the last couple of years. They let you create HTML and CSS using JS in a very intuitive way.",
                        "instructions": "It's the first time students will be using objects, explain the concept. Make students create their first react components and explain the use of JSX. Explain the difference between Functional components and or class components and the render function. Landing page project should be a code along at start, then groups at end.",
                        "key-concepts": [
                            "Export -> Import modules",
                            "You can create your own tags",
                            "Create a Component like a Class",
                            "Create a Component like a Function",
                            "Use of the render method"
                        ],
                        "technologies": [
                            "React",
                            "Webpack",
                            "Babel.js",
                            "JS Modules",
                            "JS Classes"
                        ],
                        "teacher_instructions": "It's the first time students will be using objects, explain the concept. Make students create their first react components and explain the use of JSX. Explain the difference between Functional components and or class components and the render function. Landing page project should be a code along at start, then groups at end."
                    },
                    {
                        "id": 14,
                        "label": "Day 11",
                        "lessons": [],
                        "project": {
                            "title": "Todolist Application Using React",
                            "instructions": "https://projects.breatheco.de/project/todo-list"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must finish the TodoList being able to add & delete tasks.",
                        "position": 14,
                        "assignments": [
                            {
                                "slug": "todo-list",
                                "title": "Todolist Application Using React"
                            }
                        ],
                        "description": "Finally we can create our own HTML tags and re-use them on several projects and views. The key to understand a component is understanding Props and The State. Please continue working on the Todo-List Application.",
                        "instructions": "Review landing page. React as rendering engine: Students need to understand that now they can finally create their own HTML tags (React Components) and how to use the State and the Props",
                        "key-concepts": [
                            "Condigional Rendering",
                            "The component state",
                            "The state is inmutable",
                            "Using const, map, filter and concat to prevent state mutation"
                        ],
                        "technologies": [
                            "React",
                            "Javascript",
                            "Events"
                        ],
                        "teacher_instructions": "Review landing page. React as rendering engine: Students need to understand that now they can finally create their own HTML tags (React Components) and how to use the State and the Props"
                    },
                    {
                        "id": 15,
                        "label": "Day 12",
                        "lessons": [
                            {
                                "slug": "agile-development",
                                "title": "Profesional Web Development"
                            },
                            {
                                "slug": "user-stories-examples",
                                "title": "Creating User Stories"
                            }
                        ],
                        "project": {
                            "title": "Invalid project",
                            "instructions": "https://projects.breatheco.de/project/web-development-project-stories"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must finish the user stories by next class, remember that the student projects must meet certain conditions to be accepted.",
                        "position": 15,
                        "assignments": [
                            {
                                "slug": "web-development-project-stories",
                                "title": "Invalid project"
                            }
                        ],
                        "description": "Time to start the final project! Lets review how software is build today, you'll learn and follow the same method used on the top tech companies in the world.",
                        "instructions": "Time to start the Final project! Let's give the students a break and dive into User Stories and the SCRUM methodology. Students must pick their projects & partner, and start building the user stories on Trello.com, create the board with them.",
                        "key-concepts": [
                            "Building a Trello board",
                            "Building a Kanban Board",
                            "Creating the project Backlog",
                            "Who to write the story",
                            "Acceptance Criteria",
                            "You application roles & capabilities",
                            "Standup Meeting"
                        ],
                        "technologies": [
                            "SCRUM",
                            "User Stories",
                            "Kanban",
                            "Agile Methodologies"
                        ],
                        "teacher_instructions": "Time to start the Final project! Let's give the students a break and dive into User Stories and the SCRUM methodology. Students must pick their projects & partner, and start building the user stories on Trello.com, create the board with them."
                    },
                    {
                        "id": 16,
                        "label": "Weekend",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "weekend": true,
                        "homework": "Finish the TodoList with React and the Project User Stories",
                        "position": 16,
                        "assignments": [],
                        "description": "Every student, partner, teacher and alumni is invited to the academy on Saturdays, it is an oportunity to network and get some inspiration!",
                        "instructions": "Finish the TodoList with React and the Project User Stories",
                        "teacher_instructions": "Finish the TodoList with React and the Project User Stories"
                    },
                    {
                        "id": 17,
                        "label": "Day 13",
                        "lessons": [
                            {
                                "slug": "javascript-import",
                                "title": "Importing and Exporting from other JS files"
                            }
                        ],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must finish everything that is due, and create their first 3 page wireframes",
                        "position": 17,
                        "assignments": [],
                        "description": "We have learned a lot in a short amout of time, let's work hard on finishing all the Replits, assignments and create our project Wireframes",
                        "instructions": "Force students to finish all that's due, students that have not finished the replits cannot enter the class and will remain separated from the big group",
                        "key-concepts": [
                            "Wireframing",
                            "Minimum Viable Product",
                            "Why creating a prototipe"
                        ],
                        "technologies": [
                            "Wireframing",
                            "SCRUM",
                            "Kanban"
                        ],
                        "teacher_instructions": "Force students to finish all that's due, students that have not finished the replits cannot enter the class and will remain separated from the big group"
                    },
                    {
                        "id": 18,
                        "label": "Day 14",
                        "lessons": [
                            {
                                "slug": "routing-our-views-with-react-router",
                                "title": "Using React Router"
                            }
                        ],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Sit with every project team and discuss how to split the code into Views and React.Components, students must finish the home layout by next class",
                        "position": 18,
                        "assignments": [],
                        "description": "But some react components will never be re-used, they behave more like page or layout. We will call those components: 'Views'... React will help us connect them together to create our main website navegation",
                        "instructions": "React Router + React: How to create components that behave like Views (layouts) and match them with URL Routers.",
                        "key-concepts": [
                            "React Router",
                            "Router: Matching URLs Views",
                            "Component vs View",
                            "The Component State",
                            "Using the React Debugging Chrome Plugin",
                            "Debugging code with the Chrome Source Tab"
                        ],
                        "technologies": [
                            "Minimum Viable Product",
                            "React Router",
                            "The Chrome Inspector"
                        ],
                        "teacher_instructions": "React Router + React: How to create components that behave like Views (layouts) and match them with URL Routers."
                    },
                    {
                        "id": 19,
                        "label": "Day 15",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students (in groups) must create a 4 page website (Home, Blog, Product, Checkout-Cart) using React Router",
                        "position": 19,
                        "assignments": [],
                        "description": "",
                        "instructions": "Demonstrate component lifecycle methods: getDerivedStateFromProps, DidMount and willUnmount. ",
                        "key-concepts": [
                            "Redirect with history.push()"
                        ],
                        "technologies": [
                            "NPM",
                            "React Router",
                            "React",
                            "MVC"
                        ],
                        "teacher_instructions": "Demonstrate component lifecycle methods: getDerivedStateFromProps, DidMount and willUnmount. "
                    },
                    {
                        "id": 20,
                        "label": "Weekend",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "weekend": true,
                        "homework": "",
                        "position": 20,
                        "assignments": [],
                        "description": "Now that you are working on the final project it is the best time to meet with your parner to work on the weends",
                        "instructions": "Student Projects Views must be finished by next class",
                        "teacher_instructions": "Student Projects Views must be finished by next class"
                    },
                    {
                        "id": 21,
                        "label": "Day 16",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students (in groups) must create a 4 page website (Home, Blog, Product, Checkout-Cart) using React Router",
                        "position": 21,
                        "assignments": [],
                        "description": "How to make a formal frontend web app using navigation (React Router)",
                        "instructions": "Force students to finish all that's due, students that have not finished the replits cannot enter the class and will remain separated from the big group. Explain the logic behind React Router, and the things to remember",
                        "key-concepts": [
                            "React Router"
                        ],
                        "technologies": [
                            "React Router"
                        ],
                        "teacher_instructions": "Force students to finish all that's due, students that have not finished the replits cannot enter the class and will remain separated from the big group. Explain the logic behind React Router, and the things to remember"
                    },
                    {
                        "id": 22,
                        "label": "Day 17",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students (in groups) must create a 4 page website (Home, Blog, Product, Checkout-Cart) using React Router",
                        "position": 22,
                        "assignments": [],
                        "description": "How to make a formal frontend web app using navigation (React Router)",
                        "instructions": "Force students to finish all that's due, students that have not finished the replits cannot enter the class and will remain separated from the big group. Explain the logic behind React Router, and the things to remember",
                        "teacher_instructions": "Force students to finish all that's due, students that have not finished the replits cannot enter the class and will remain separated from the big group. Explain the logic behind React Router, and the things to remember"
                    },
                    {
                        "id": 23,
                        "label": "Day 18",
                        "lessons": [],
                        "project": {
                            "title": "Invalid project",
                            "instructions": "https://projects.breatheco.de/project/web-development-project-wireframes"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students (in groups) must create a 4 page website (Home, Blog, Product, Checkout-Cart) using React Router",
                        "position": 23,
                        "assignments": [
                            {
                                "slug": "web-development-project-wireframes",
                                "title": "Invalid project"
                            }
                        ],
                        "description": "How to make a formal frontend web app using navigation (React Router)",
                        "instructions": "Force students to finish all that's due, students that have not finished the replits cannot enter the class and will remain separated from the big group. Explain the logic behind React Router, and the things to remember",
                        "key-concepts": [
                            "Use of Link"
                        ],
                        "technologies": [
                            "React Router"
                        ],
                        "teacher_instructions": "Force students to finish all that's due, students that have not finished the replits cannot enter the class and will remain separated from the big group. Explain the logic behind React Router, and the things to remember"
                    },
                    {
                        "id": 24,
                        "label": "Weekend",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "weekend": true,
                        "homework": "",
                        "position": 24,
                        "assignments": [],
                        "description": "",
                        "teacher_instructions": ""
                    },
                    {
                        "id": 25,
                        "label": "Day 19",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Finish the Website refactor",
                        "position": 25,
                        "assignments": [],
                        "description": "Demonstrate the React Context API and how to implement centralized Actions and Store.",
                        "instructions": "Refactor the website mini-project to include Context Provider and consumer. Each team should refactor to consume the Context instead of consuming local State.",
                        "key-concepts": [
                            "React Context"
                        ],
                        "technologies": [
                            "React Context"
                        ],
                        "teacher_instructions": "Refactor the website mini-project to include Context Provider and consumer. Each team should refactor to consume the Context instead of consuming local State."
                    },
                    {
                        "id": 26,
                        "label": "Day 20",
                        "lessons": [],
                        "project": {
                            "title": "The Meetup.com Clone using react.js",
                            "instructions": "https://projects.breatheco.de/project/meetup-clone-react"
                        },
                        "quizzes": [],
                        "replits": [],
                        "homework": "Finish the Website refactor",
                        "position": 26,
                        "assignments": [
                            {
                                "slug": "meetup-clone-react",
                                "title": "The Meetup.com Clone using react.js"
                            }
                        ],
                        "description": "Demonstrate the React Context API and how to implement centralized Actions and Store.",
                        "instructions": "Refactor the website mini-project to include Context Provider and consumer. Each team should refactor to consume the Context instead of consuming local State.",
                        "technologies": [
                            "React Context"
                        ],
                        "teacher_instructions": "Refactor the website mini-project to include Context Provider and consumer. Each team should refactor to consume the Context instead of consuming local State."
                    },
                    {
                        "id": 27,
                        "label": "Day 21",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Finish the Website refactor",
                        "position": 27,
                        "assignments": [],
                        "description": "Demonstrate the React Context API and how to implement centralized Actions and Store.",
                        "instructions": "Refactor the website mini-project to include Context Provider and consumer. Each team should refactor to consume the Context instead of consuming local State.",
                        "key-concepts": [
                            "React Context"
                        ],
                        "technologies": [
                            "React Context"
                        ],
                        "teacher_instructions": "Refactor the website mini-project to include Context Provider and consumer. Each team should refactor to consume the Context instead of consuming local State."
                    },
                    {
                        "id": 28,
                        "label": "Weekend",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "weekend": true,
                        "homework": "",
                        "position": 28,
                        "assignments": [],
                        "description": "",
                        "teacher_instructions": ""
                    },
                    {
                        "id": 29,
                        "label": "Day 22",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Using postman, and then using React, students must use the WordPress API to Bookmark and RSVP to the events",
                        "position": 29,
                        "assignments": [],
                        "description": "Intro to Fetch. Make your frontend app consume any API.",
                        "instructions": "Intro to AJAX: Re-Explain HTTP Requests but now using GET, POST, PUT & DELETE. Introduce JSON instead of HTML as the main communication format. Serialize and Unserialize.",
                        "key-concepts": [
                            "How to use POSTMan, set environment variables and use collections",
                            "JSON is a Javascript object but as TEXT",
                            "The goal is to send/receive everything as JSON Serialize>Send>Unserialize",
                            "What is serialization and how to do it (Parsing)",
                            "Why using several request types (GET, POST, PUT, DELETE)?",
                            "Explan the 3 mains types content-types: Form, URL-Encoded, Raw (With JSON)"
                        ],
                        "technologies": [
                            "HTTP",
                            "HTTP Fetch",
                            "JSON",
                            "API",
                            "Serialization"
                        ],
                        "teacher_instructions": "Intro to AJAX: Re-Explain HTTP Requests but now using GET, POST, PUT & DELETE. Introduce JSON instead of HTML as the main communication format. Serialize and Unserialize."
                    },
                    {
                        "id": 30,
                        "label": "Day 23",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must finish Meetup API intetration and finish the PHP Replits",
                        "position": 30,
                        "assignments": [],
                        "instructions": "Finish the Meetup-Clone API integration, focus on Debugging procedures and start the introduction to PHP/WordPress",
                        "technologies": [
                            "PHP",
                            "Back-end",
                            "API",
                            "REST"
                        ],
                        "teacher_instructions": "Finish the Meetup-Clone API integration, focus on Debugging procedures and start the introduction to PHP/WordPress"
                    },
                    {
                        "id": 31,
                        "label": "Day 24",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must build the needed model to build the Meetup-Clone API and the API RESTful services to CRUD the models",
                        "position": 31,
                        "assignments": [],
                        "instructions": "Use Composer+WPCLI to install (WordPress + WPAS Dash + ACPT Plugin) and demonstrate how create you own WordPress model. Explain what Entities are and Entity-Relationship Diagram. Do not explain composer that much (do the analogy with NPM) and do not explain WP-CLI to much either, start using it and students will learn by doing",
                        "key-concepts": [
                            "Database Entities: Modeling Data with Wordpress",
                            "The WordPress Dashboard",
                            "Creating a CPT",
                            "Relationships between Custom Post Types",
                            "POSTMan: How to use it to create all types of requests, headers and content-types"
                        ],
                        "technologies": [
                            "HTTP",
                            "JSON",
                            "REST",
                            "API's",
                            "Serialization",
                            "Custom Post Types",
                            "Composer",
                            "WordPress Dash",
                            "WP-CLI"
                        ],
                        "teacher_instructions": "Use Composer+WPCLI to install (WordPress + WPAS Dash + ACPT Plugin) and demonstrate how create you own WordPress model. Explain what Entities are and Entity-Relationship Diagram. Do not explain composer that much (do the analogy with NPM) and do not explain WP-CLI to much either, start using it and students will learn by doing"
                    },
                    {
                        "id": 32,
                        "label": "Weekend",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "weekend": true,
                        "homework": "",
                        "position": 32,
                        "assignments": [],
                        "description": "",
                        "instructions": "Students must build the API for the Meetup-Clone project",
                        "teacher_instructions": "Students must build the API for the Meetup-Clone project"
                    },
                    {
                        "id": 33,
                        "label": "Day 25",
                        "lessons": [
                            {
                                "slug": "php-syntax",
                                "title": "From JS to PHP"
                            }
                        ],
                        "quizzes": [],
                        "replits": [
                            {
                                "slug": "from-js-to-php",
                                "title": "Intro to PHP"
                            }
                        ],
                        "homework": "PHP Replits",
                        "position": 33,
                        "assignments": [],
                        "description": "Welcome to the Backend! Now you'll have access to the File System, DB and more computing power, but from great power, [insert uncle Ben's quote]... First, is there a difference between JS and PHP?",
                        "instructions": "Talk about the differences between JS and PHP, the way of showing (echo, print) things, looping and object oriente programming",
                        "technologies": [
                            "PHP"
                        ],
                        "teacher_instructions": "Talk about the differences between JS and PHP, the way of showing (echo, print) things, looping and object oriente programming"
                    },
                    {
                        "id": 34,
                        "label": "Day 26",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must write all the API Methods documentation that are going to be needed for the  project and finish the Meetup-Clone if not already.",
                        "position": 34,
                        "assignments": [],
                        "description": "PHP isn't that bad, the problem is the order of the files, which is inexistant... But don't worry, we'll fix that with a framework, specifically, Wordpress.",
                        "instructions": "Install Wordpress, using the Wordpress-CLI ",
                        "technologies": [
                            "PHP",
                            "Back-end",
                            "API",
                            "REST"
                        ],
                        "teacher_instructions": "Install Wordpress, using the Wordpress-CLI "
                    },
                    {
                        "id": 35,
                        "label": "Day 27",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must keep working on the Final Project API and Final React Application",
                        "position": 35,
                        "assignments": [],
                        "description": "",
                        "instructions": "Time to start working on the Project API with WordPress, make the students write all their API Requests un a RESTFul way. Time to code the API! Review the API methods that students spec out and make them start coding them our using WordPress Dash",
                        "key-concepts": [
                            "Review everything we have learned"
                        ],
                        "teacher_instructions": "Time to start working on the Project API with WordPress, make the students write all their API Requests un a RESTFul way. Time to code the API! Review the API methods that students spec out and make them start coding them our using WordPress Dash"
                    },
                    {
                        "id": 36,
                        "label": "Weekend",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "weekend": true,
                        "homework": "",
                        "position": 36,
                        "assignments": [],
                        "description": "",
                        "instructions": "Students must keep working on the Final Project API and Final React Application",
                        "teacher_instructions": "Students must keep working on the Final Project API and Final React Application"
                    },
                    {
                        "id": 37,
                        "label": "Day 28",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Implement login on your React application and save the WordPress user id on the Context Store to open a session, use cookies to avoid user from looging our even if the website is the React App is refreshed",
                        "position": 37,
                        "assignments": [],
                        "description": "",
                        "instructions": "Help students build the API services to login the user on both sides: on the React Side but at the same time opening the cookins on WordPress.",
                        "key-concepts": [
                            "Managing cookies with PHP and Javascript",
                            "Using <PrivateRoute /> component on React",
                            "Creating a Session Store"
                        ],
                        "technologies": [
                            "Server Sessions",
                            "Cookies"
                        ],
                        "teacher_instructions": "Help students build the API services to login the user on both sides: on the React Side but at the same time opening the cookins on WordPress."
                    },
                    {
                        "id": 38,
                        "label": "Day 29",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must keep working on the project",
                        "position": 38,
                        "assignments": [],
                        "instructions": "Finish Implementing Login with your students and help them finish any other needed implementation",
                        "teacher_instructions": "Finish Implementing Login with your students and help them finish any other needed implementation"
                    },
                    {
                        "id": 39,
                        "label": "Day 30",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must keep working on the project",
                        "position": 39,
                        "assignments": [],
                        "instructions": "Keep working on the final project with your students",
                        "teacher_instructions": "Keep working on the final project with your students"
                    },
                    {
                        "id": 40,
                        "label": "Weekend",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "weekend": true,
                        "position": 40,
                        "assignments": [],
                        "instructions": "Students must keep working on the project",
                        "teacher_instructions": "Students must keep working on the project"
                    },
                    {
                        "id": 41,
                        "label": "Day 31",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students are required to have some parts of the project on php templates, they need to complete those parts starting right now!",
                        "position": 41,
                        "assignments": [],
                        "instructions": "Explain what a WordPress template and how to use them to render HTML. Explain how the controllers can be used to prepare the view information and how to use PHP to insert the values on the templates",
                        "key-concepts": [
                            "WordPress Templating Engine",
                            "Working with the Controller to prepare the template views",
                            "Using PHP as template engine (conditional display and loops)"
                        ],
                        "technologies": [
                            "PHP",
                            "WordPress Themes",
                            "PHP Templating",
                            "MVC",
                            "WordPress Dash"
                        ],
                        "teacher_instructions": "Explain what a WordPress template and how to use them to render HTML. Explain how the controllers can be used to prepare the view information and how to use PHP to insert the values on the templates"
                    },
                    {
                        "id": 42,
                        "label": "Day 32",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must work on the project",
                        "position": 42,
                        "assignments": [],
                        "description": "",
                        "instructions": "Work with students on the project",
                        "teacher_instructions": "Work with students on the project"
                    },
                    {
                        "id": 43,
                        "label": "Day 33",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must work on the project",
                        "position": 43,
                        "assignments": [],
                        "instructions": "Students must work on the project",
                        "teacher_instructions": "Students must work on the project"
                    },
                    {
                        "id": 44,
                        "label": "Weekend",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "weekend": true,
                        "position": 44,
                        "assignments": [],
                        "instructions": "Students must work on the project",
                        "teacher_instructions": "Students must work on the project"
                    },
                    {
                        "id": 45,
                        "label": "Day 34",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must implement their project payment subscription or plans",
                        "position": 45,
                        "assignments": [],
                        "instructions": "Install Woocommerce as gateway for payment services and explain the students how to integrate their website to it",
                        "key-concepts": [
                            "Installing Woocommerce",
                            "Configuring Woocommerce",
                            "Woocommerce API Integration"
                        ],
                        "technologies": [
                            "Woocommerce"
                        ],
                        "teacher_instructions": "Install Woocommerce as gateway for payment services and explain the students how to integrate their website to it"
                    },
                    {
                        "id": 46,
                        "label": "Day 35",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must keep working on the project",
                        "position": 46,
                        "assignments": [],
                        "instructions": "Finish Implementing payment options with your students and help them finish any other needed implementation",
                        "teacher_instructions": "Finish Implementing payment options with your students and help them finish any other needed implementation"
                    },
                    {
                        "id": 47,
                        "label": "Day 36",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must keep working on the project",
                        "position": 47,
                        "assignments": [],
                        "instructions": "Keep working on the final project with your students",
                        "teacher_instructions": "Keep working on the final project with your students"
                    },
                    {
                        "id": 48,
                        "label": "Weekend",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "weekend": true,
                        "position": 48,
                        "assignments": [],
                        "instructions": "Students must keep working on the project",
                        "teacher_instructions": "Students must keep working on the project"
                    },
                    {
                        "id": 49,
                        "label": "Day 37",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must map all the relevant interactions on a diagram and start messuring them with Javascript",
                        "position": 49,
                        "assignments": [],
                        "instructions": "Make students and model their Website needs and Data-Model based on the business, collect all possible data and measure Call To Actions, Leads, Impressions, etc. Report all that data to Google Analytics and other 3rd party services",
                        "key-concepts": [
                            "Google Tag Manager Integration",
                            "Identifing and Dispatching Events",
                            "Collection Data",
                            "AdWords Integration"
                        ],
                        "technologies": [
                            "Google Analytics",
                            "Google Tag Manager",
                            "Lean Generation"
                        ],
                        "teacher_instructions": "Make students and model their Website needs and Data-Model based on the business, collect all possible data and measure Call To Actions, Leads, Impressions, etc. Report all that data to Google Analytics and other 3rd party services"
                    },
                    {
                        "id": 50,
                        "label": "Day 38",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must integrate the data-layer",
                        "position": 50,
                        "assignments": [],
                        "instructions": "Finish Implementing the data-layer with your students",
                        "teacher_instructions": "Finish Implementing the data-layer with your students"
                    },
                    {
                        "id": 51,
                        "label": "Day 39",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must keep working on the project",
                        "position": 51,
                        "assignments": [],
                        "instructions": "Keep working on the final project with your students",
                        "teacher_instructions": "Keep working on the final project with your students"
                    },
                    {
                        "id": 52,
                        "label": "Weekend",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "weekend": true,
                        "position": 52,
                        "assignments": [],
                        "description": "",
                        "instructions": "Students must keep working on the project",
                        "teacher_instructions": "Students must keep working on the project"
                    },
                    {
                        "id": 53,
                        "label": "Day 40",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must upload their project for the final presentation",
                        "position": 53,
                        "assignments": [],
                        "description": "",
                        "instructions": "Explain students how to login into CPanel, use GIT and the WP-CLI to publish their projects",
                        "key-concepts": [
                            "Configuring your server database",
                            "Using GIT to upload your WordPress",
                            "Using WordPress-CLI on Production",
                            "Setting up the wp-config.php"
                        ],
                        "technologies": [
                            "MySQL",
                            "GIT",
                            "CPanel",
                            "Hosting"
                        ],
                        "teacher_instructions": "Explain students how to login into CPanel, use GIT and the WP-CLI to publish their projects"
                    },
                    {
                        "id": 54,
                        "label": "Day 41",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must keep working on the project",
                        "position": 54,
                        "assignments": [],
                        "description": "",
                        "instructions": "No new stuff: Help students to finish their projects",
                        "teacher_instructions": "No new stuff: Help students to finish their projects"
                    },
                    {
                        "id": 55,
                        "label": "Day 42 Graduation",
                        "lessons": [],
                        "quizzes": [],
                        "replits": [],
                        "homework": "Students must present projects and be there for the picture!",
                        "position": 55,
                        "assignments": [],
                        "description": "",
                        "instructions": "Go and have a drink with your students",
                        "teacher_instructions": "Go and have a drink with your students"
                    }
                ],
                "slug": "web-development",
                "label": "Web Development",
                "profile": "web-development",
                "version": 1,
                "academy_author": "4"
            },
            "version": 1,
            "updated_at": "2021-09-14T23:33:08.593008Z",
            "created_at": "2021-09-14T23:33:08.592981Z",
            "slug": "web-development",
            "name": "Web Developer",
            "syllabus": 30,
            "duration_in_hours": 126,
            "duration_in_days": 42,
            "week_hours": 9,
            "github_url": null,
            "logo": null,
            "private": false
        }
    ]
  
    ).as('cohort_edit_new_version')
  }); 

  Cypress.Commands.add('cohort_edit_load_user', () => {
    // the data of the new cohort so can be edit
    cy.intercept('GET', '**/admissions/academy/cohort/user?cohorts=**', 

    {
        "count": 1,
        "first": null,
        "next": null,
        "previous": null,
        "last": null,
        "results": [
            {
                "user": {
                    "id": 3793,
                    "first_name": "Christina",
                    "last_name": "Vorous",
                    "email": "cnvorous@gmail.com",
                    "profile": {
                        "id": 3493,
                        "avatar_url": "https://avatars.githubusercontent.com/u/88951791?v=4",
                        "show_tutorial": false,
                        "github_username": null
                    }
                },
                "cohort": {
                    "id": 159,
                    "slug": "miami-xxxi",
                    "name": "Miami XXXI",
                    "kickoff_date": "2021-12-07T00:00:00Z",
                    "ending_date": "2022-05-27T00:00:00Z",
                    "stage": "INACTIVE"
                },
                "role": "STUDENT",
                "finantial_status": null,
                "educational_status": "ACTIVE",
                "created_at": "2021-10-04T21:10:12.231850Z",
                "profile_academy": {
                    "id": 2610,
                    "first_name": "Christina",
                    "last_name": "Vorous",
                    "email": "cnvorous@gmail.com",
                    "phone": "8137890055"
                }
            }
        ]
    }


    ).as('cohort_edit_load_user')
  }); 

Cypress.Commands.add('cohort_edit_full', () => {
    // the data of the new cohort so can be edit
    cy.intercept('GET', '**/admissions/syllabus/41', 

    {
        "id": 41,
        "slug": "full-stack",
        "name": "Full-Stack Software Developer",
        "github_url": null,
        "duration_in_hours": 320,
        "duration_in_days": 48,
        "week_hours": 9,
        "logo": "https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack",
        "private": false,
        "academy_owner": 4,
        "created_at": "2021-09-14T23:33:08.542059Z",
        "updated_at": "2021-09-14T23:33:08.542072Z"
    }

    ).as('cohort_edit_full')
}); 

Cypress.Commands.add('cohort_edit_students', () => {
    // the data of the new cohort so can be edit
    cy.intercept('GET', '**/admissions/academy/cohort/user?cohorts**', 

    {
        "count": 0,
        "first": null,
        "next": null,
        "previous": null,
        "last": null,
        "results": []
    }

    ).as('cohort_edit_students')
}); 

Cypress.Commands.add('cohort_edit_schedule', () => {
    // the data of the new cohort so can be edit
    cy.intercept('GET', '**/admissions/schedule?syllabus', 

    [
        {
            "id": 3,
            "slug": "pt-tue-thu-frid-6-9",
            "name": "PT Tues-Thru-Frid from 6-9",
            "syllabus": 41
        }
    ]

    ).as('cohort_edit_schedule')
}); 