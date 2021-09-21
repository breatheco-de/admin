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
  cy.intercept('GET', '**/admissions/certificate', 
    
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
  cy.intercept('GET', '**/admissions/certificate/full-stack/academy/4/syllabus', [{
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