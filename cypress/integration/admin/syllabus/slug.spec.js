// <reference types="cypress" />

const moment = require('moment');

describe('/admin/syllabus/:slug', () => {
  beforeEach(() => {
    cy.auth();

    cy.mockGetAdmissionsSyllabusSlugResponse();
    // cy.mockGetAdmissionsSyllabusResponse();
    // cy.mockGetAdmissionsSyllabusVersionResponse();
    // cy.mockPostAdmissionsAcademyCohortResponse();
    cy.mockGetAdmissionsScheduleResponse();
    // cy.mockGetPaginatedAdmissionsAcademyCohortResponse();
    cy.mockPutAdmissionsSyllabusIdResponse();

    cy.visit('/admin/syllabus/full-stack-ft');
  });
  context.skip('Syllabus form', () => {
    it('How many days ago', () => {
      cy.fixture('admissions/syllabus/slug.json').then(({ created_at }) => {
        const howManyDaysAgo = moment().diff(created_at, 'days')
        cy.get('[data-cy="how-many-days-ago"]').should('have.text', `Created at: ${howManyDaysAgo} days ago`)
      });
    });

    it('Slug field validations', () => {
      cy.testSlugField('default', 'slug', 'full-stack-ft');
    });

    it('Name field validations', () => {
      cy.testNameField('default', 'name', 'Full-Stack Software Developer FT')
    });

    it('Total hours field validations', () => {
      cy.testNonZeroPositiveNumberField('default', 'Total hours', 'duration-in-hours', '320')
    });

    it('Weekly hours field validations', () => {
       cy.testNonZeroPositiveNumberField('default', 'Weekly hours', 'week-hours', '40')
    });

    it('Total days field validations', () => {
      cy.testNonZeroPositiveNumberField('default', 'Total days', 'duration-in-days', '45')
    });

    it('Github URL field validations', () => {
      cy.get('[data-cy="default-github-url"] input').should('have.value', 'https://github.com/jefer94/apiv2');

      cy.get('[data-cy="default-github-url"] input').focus().clear();
      cy.get('[data-cy="default-github-url"] input').type('https://www.google.com/').blur();
      cy.get('[data-cy="default-github-url"] input').should('have.value', 'https://www.google.com/');
      cy.get('[data-cy="default-github-url"] p').should('have.text', 'Invalid github url');

      cy.get('[data-cy="default-github-url"] input').focus().clear();
      cy.get('[data-cy="default-github-url"] input').type('https://').blur();
      cy.get('[data-cy="default-github-url"] input').should('have.value', 'https://');
      cy.get('[data-cy="default-github-url"] p').should('have.text', 'Invalid github url');

      cy.get('[data-cy="default-github-url"] input').focus().clear();
      cy.get('[data-cy="default-github-url"] input').type('https://github.com').blur();
      cy.get('[data-cy="default-github-url"] input').should('have.value', 'https://github.com');
      cy.get('[data-cy="default-github-url"] p').should('have.text', 'Invalid github url');

      cy.get('[data-cy="default-github-url"] input').focus().clear();
      cy.get('[data-cy="default-github-url"] input').type('https://github.com/jefer94/apiv2');
      cy.get('[data-cy="default-github-url"] input').should('have.value', 'https://github.com/jefer94/apiv2');
      cy.get('[data-cy="default-github-url"] p').should('not.exist');

      cy.get('[data-cy="default-github-url"] input').focus().clear();
      cy.get('[data-cy="default-github-url"] input').type('http://github.com/jefer94/apiv2').blur();
      cy.get('[data-cy="default-github-url"] input').should('have.value', 'http://github.com/jefer94/apiv2');
      cy.get('[data-cy="default-github-url"] p').should('not.exist');
    });

    it('Logo field validations', () => {
      cy.get('[data-cy=default-logo] input').should('have.value', 'https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack-ft');

      cy.get('[data-cy=default-logo] input').focus().clear();
      cy.get('[data-cy=default-logo] input').type('https://').blur();
      cy.get('[data-cy=default-logo] input').should('have.value', 'https://');
      cy.get('[data-cy=default-logo] p').should('have.text', 'Invalid logo url');

      cy.get('[data-cy=default-logo] input').focus().clear();
      cy.get('[data-cy=default-logo] input').type('https://www.google.com').blur();
      cy.get('[data-cy=default-logo] input').should('have.value', 'https://www.google.com');
      cy.get('[data-cy=default-logo] p').should('not.exist');

      cy.get('[data-cy=default-logo] input').focus().clear();
      cy.get('[data-cy=default-logo] input').type('https://www.google.com/').blur();
      cy.get('[data-cy=default-logo] input').should('have.value', 'https://www.google.com/');
      cy.get('[data-cy=default-logo] p').should('not.exist');

      cy.get('[data-cy=default-logo] input').focus().clear();
      cy.get('[data-cy=default-logo] input').type('http://github.com/jefer94/apiv2').blur();
      cy.get('[data-cy=default-logo] input').should('have.value', 'http://github.com/jefer94/apiv2');
      cy.get('[data-cy=default-logo] p').should('not.exist');
    });

    it('Check request', () => {
      cy.get('[data-cy="default-slug"] input').should('have.value', 'full-stack-ft');
      cy.get('[data-cy="default-name"] input').should('have.value', 'Full-Stack Software Developer FT');
      cy.get('[data-cy="default-duration-in-hours"] input').should('have.value', '320');
      cy.get('[data-cy="default-week-hours"] input').should('have.value', '40');
      cy.get('[data-cy="default-duration-in-days"] input').should('have.value', '45');
      cy.get('[data-cy="default-github-url"] input').should('have.value', 'https://github.com/jefer94/apiv2');
      cy.get('[data-cy="default-logo"] input').should('have.value', 'https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack-ft');

      // change values
      cy.get('[data-cy="default-slug"] input').focus().clear();
      cy.get('[data-cy="default-slug"] input').type('regular-show').blur();

      cy.get('[data-cy="default-name"] input').focus().clear();
      cy.get('[data-cy="default-name"] input').type('Regular Show').blur();

      cy.get('[data-cy="default-duration-in-hours"] input').focus().clear();
      cy.get('[data-cy="default-duration-in-hours"] input').type('890').blur();

      cy.get('[data-cy="default-week-hours"] input').focus().clear();
      cy.get('[data-cy="default-week-hours"] input').type('1').blur();

      cy.get('[data-cy="default-duration-in-days"] input').focus().clear();
      cy.get('[data-cy="default-duration-in-days"] input').type('890').blur();

      cy.get('[data-cy="default-github-url"] input').focus().clear();
      cy.get('[data-cy="default-github-url"] input').type('https://github.com/jefer94/gitpod-desktop').blur();

      cy.get('[data-cy="default-logo"] input').focus().clear();
      cy.get('[data-cy="default-logo"] input').type('https://i1.sndcdn.com/avatars-000096076334-121vuv-t500x500.jpg').blur();

      // check after fill the form
      cy.get('[data-cy="default-slug"] input').should('have.value', 'regular-show');
      cy.get('[data-cy="default-name"] input').should('have.value', 'Regular Show');
      cy.get('[data-cy="default-duration-in-hours"] input').should('have.value', '890');
      cy.get('[data-cy="default-week-hours"] input').should('have.value', '1');
      cy.get('[data-cy="default-duration-in-days"] input').should('have.value', '890');
      cy.get('[data-cy="default-github-url"] input').should('have.value', 'https://github.com/jefer94/gitpod-desktop');
      cy.get('[data-cy="default-logo"] input').should('have.value', 'https://i1.sndcdn.com/avatars-000096076334-121vuv-t500x500.jpg');

      // send request
      cy.get('[data-cy=submit]').click()

      // check the payload
      cy.wait('@putAdmissionsSyllabusIdRequest').then(({ request }) => {
        cy.wrap(request.body).its('id').should('eq', 36);
        cy.wrap(request.body).its('name').should('eq', 'Regular Show');
        cy.wrap(request.body).its('slug').should('eq', 'regular-show');
        cy.wrap(request.body).its('duration_in_hours').should('eq', 890);
        cy.wrap(request.body).its('week_hours').should('eq', 1);
        cy.wrap(request.body).its('duration_in_days').should('eq', 890);
        cy.wrap(request.body).its('github_url').should('eq', 'https://github.com/jefer94/gitpod-desktop');
        cy.wrap(request.body).its('logo').should('eq', 'https://i1.sndcdn.com/avatars-000096076334-121vuv-t500x500.jpg');
      })

      // cy.location('pathname').should('eq', '/admissions/cohorts');
    });
  });
  context('Schedule Form', () => {
    // cy.location('pathit(')
    it('Schedule label', () => {
      cy.get('[data-cy="schedules-label"]').should('have.text', 'Available schedules:');
    });

    it('Slug field validations', () => {
      cy.get('[data-cy="new-schedule"]').should('have.text', 'New schedule');
      cy.get('[data-cy="new-schedule"]').click();

      cy.testSlugField('new-schedule', 'slug');
    });

    it('Name field validations', () => {
      cy.get('[data-cy="new-schedule"]').should('have.text', 'New schedule');
      cy.get('[data-cy="new-schedule"]').click();

      cy.testNameField('new-schedule', 'name');
    });

    it('Description field validations', () => {
      const inputSelector = `[data-cy="new-schedule-description"] textarea[required]`
      const errorSelector = `[data-cy="new-schedule-description"] p`
      const text = 'Lorem ipsum dolor sit amet consectetur adipiscing elit viverra massa hendrerit, penatibus fringilla eu nec conubia cras orci maecenas bibendum, donec vivamus netus ultricies sodales eros augue blandit sem. Sagittis lectus magnis tempor id purus aptent mi commodo molestie lacinia iaculis sodales, velit fringilla fusce pretium rutrum dignissim suscipit cras facilisis vel nisi, euismod consequat nisl facilisi placerat rhoncus leo aenean cum vestibulum gravida. Massa porttitor diam volutpat proin tristique feugiat phasellus habitasse per mus, laoreet ligula orci fringilla vivamus quis ridiculus felis.';

      cy.get('[data-cy="new-schedule"]').should('have.text', 'New schedule');
      cy.get('[data-cy="new-schedule"]').click();

      cy.get(inputSelector).should('have.value', '');

      cy.get(inputSelector).focus().clear();
      cy.get(inputSelector).type(text).blur();
      cy.get(inputSelector).should('have.value', text);
      cy.get(errorSelector).should('have.text', 'Slug can\'t contains uppercase');


      // cy.testNameField('new-schedule', 'name');
    });
  });
});
