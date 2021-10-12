// <reference types="cypress" />

const moment = require('moment');

describe('New cohort view', () => {
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
  context('Syllabus form', () => {
    it.skip('Slug field validations', () => {
      cy.get('[data-cy=slug] input').should('have.value', 'full-stack-ft');

      cy.get('[data-cy=slug] input').focus().clear();
      cy.get('[data-cy=slug] input').type('Defence-Against-The-Dark-Arts');
      cy.get('[data-cy=slug] input').should('have.value', 'Defence-Against-The-Dark-Arts');
      cy.get('[data-cy=slug] p').should('have.text', 'Slug can\'t contains uppercase');

      // http://www.robertecker.com/hp/research/leet-converter.php?lang=en
      cy.get('[data-cy=slug] input').focus().clear();
      cy.get('[data-cy=slug] input').type('d3f3nc3-4641n57-7h3-d4rk-4r75');
      cy.get('[data-cy=slug] input').should('have.value', 'd3f3nc3-4641n57-7h3-d4rk-4r75');
      cy.get('[data-cy=slug] p').should('not.exist');

      cy.get('[data-cy=slug] input').focus().clear();
      cy.get('[data-cy=slug] input').type('Defence Against The Dark Arts');
      cy.get('[data-cy=slug] input').should('have.value', 'Defence Against The Dark Arts');
      cy.get('[data-cy=slug] p').should('have.text', 'Slug can\'t contains spaces');

      cy.get('[data-cy=slug] input').focus().clear();
      cy.get('[data-cy=slug] input').type('defence-against-the-dark-arts');
      cy.get('[data-cy=slug] input').should('have.value', 'defence-against-the-dark-arts');
      cy.get('[data-cy=slug] p').should('not.exist');

      cy.get('[data-cy=slug] input').focus().clear();
      cy.get('[data-cy=slug] input').type('defence-against-the-dark-arts-');
      cy.get('[data-cy=slug] input').should('have.value', 'defence-against-the-dark-arts-');
      cy.get('[data-cy=slug] p').should('have.text', 'Slug can\'t end with (-)');

      cy.get('[data-cy=slug] input').focus().clear();
      cy.get('[data-cy=slug] input').type('*>*>defence-against-the-dark-arts<*<*');
      cy.get('[data-cy=slug] input').should('have.value', '*>*>defence-against-the-dark-arts<*<*');
      cy.get('[data-cy=slug] p').should('have.text', 'Slug can\'t contains symbols');
    });

    it.skip('Name field validations', () => {
      cy.get('[data-cy=name] input').should('have.value', 'Full-Stack Software Developer FT');

      cy.get('[data-cy=name] input').focus().clear();
      cy.get('[data-cy=name] input').type('Defence-Against-The-Dark-Arts');
      cy.get('[data-cy=name] input').should('have.value', 'Defence-Against-The-Dark-Arts');
      cy.get('[data-cy=name] p').should('not.exist');

      // http://www.robertecker.com/hp/research/leet-converter.php?lang=en
      cy.get('[data-cy=name] input').focus().clear();
      cy.get('[data-cy=name] input').type('d3f3nc3-4641n57-7h3-d4rk-4r75');
      cy.get('[data-cy=name] input').should('have.value', 'd3f3nc3-4641n57-7h3-d4rk-4r75');
      cy.get('[data-cy=name] p').should('not.exist');

      cy.get('[data-cy=name] input').focus().clear();
      cy.get('[data-cy=name] input').type('Defence Against The Dark Arts');
      cy.get('[data-cy=name] input').should('have.value', 'Defence Against The Dark Arts');
      cy.get('[data-cy=name] p').should('not.exist');

      cy.get('[data-cy=name] input').focus().clear();
      cy.get('[data-cy=name] input').type('*>*>defence-against-the-dark-arts<*<*');
      cy.get('[data-cy=name] input').should('have.value', '*>*>defence-against-the-dark-arts<*<*');
      cy.get('[data-cy=name] p').should('have.text', 'Name can\'t contains symbols');
    });

    it.skip('Total hours field validations', () => {
      cy.get('[data-cy="duration-in-hours"] input').should('have.value', '320');

      cy.get('[data-cy="duration-in-hours"] input').focus().clear();
      cy.get('[data-cy="duration-in-hours"] input').type('Defence-Against-The-Dark-Arts');
      cy.get('[data-cy="duration-in-hours"] input').should('have.value', '');
      cy.get('[data-cy="duration-in-hours"] p').should('not.exist');

      cy.get('[data-cy="duration-in-hours"] input').focus().clear();
      cy.get('[data-cy="duration-in-hours"] input').type('*>*>defence-against-the-dark-arts<*<*');
      cy.get('[data-cy="duration-in-hours"] input').should('have.value', '');
      cy.get('[data-cy="duration-in-hours"] p').should('not.exist');

      cy.get('[data-cy="duration-in-hours"] input').focus().clear();
      cy.get('[data-cy="duration-in-hours"] input').type('1');
      cy.get('[data-cy="duration-in-hours"] input').should('have.value', '1');
      cy.get('[data-cy="duration-in-hours"] p').should('not.exist');

      cy.get('[data-cy="duration-in-hours"] input').focus().clear();
      cy.get('[data-cy="duration-in-hours"] input').type('-1');
      cy.get('[data-cy="duration-in-hours"] input').should('have.value', '-1');
      cy.get('[data-cy="duration-in-hours"] p').should('have.text', 'Total hours can\'t be equat less that 0');

      cy.get('[data-cy="duration-in-hours"] input').focus().clear();
      cy.get('[data-cy="duration-in-hours"] input').type('0');
      cy.get('[data-cy="duration-in-hours"] input').should('have.value', '0');
      cy.get('[data-cy="duration-in-hours"] p').should('have.text', 'Total hours can\'t be equat to 0');

      cy.get('[data-cy="duration-in-hours"] input').focus().clear();
      cy.get('[data-cy="duration-in-hours"] input').type('200');
      cy.get('[data-cy="duration-in-hours"] input').should('have.value', '200');
      cy.get('[data-cy="duration-in-hours"] p').should('not.exist');
    });

    it.skip('Weekly hours field validations', () => {
      cy.get('[data-cy="week-hours"] input').should('have.value', '40');

      cy.get('[data-cy="week-hours"] input').focus().clear();
      cy.get('[data-cy="week-hours"] input').type('Defence-Against-The-Dark-Arts');
      cy.get('[data-cy="week-hours"] input').should('have.value', '');
      cy.get('[data-cy="week-hours"] p').should('not.exist');

      cy.get('[data-cy="week-hours"] input').focus().clear();
      cy.get('[data-cy="week-hours"] input').type('*>*>defence-against-the-dark-arts<*<*');
      cy.get('[data-cy="week-hours"] input').should('have.value', '');
      cy.get('[data-cy="week-hours"] p').should('not.exist');

      cy.get('[data-cy="week-hours"] input').focus().clear();
      cy.get('[data-cy="week-hours"] input').type('1');
      cy.get('[data-cy="week-hours"] input').should('have.value', '1');
      cy.get('[data-cy="week-hours"] p').should('not.exist');

      cy.get('[data-cy="week-hours"] input').focus().clear();
      cy.get('[data-cy="week-hours"] input').type('-1');
      cy.get('[data-cy="week-hours"] input').should('have.value', '-1');
      cy.get('[data-cy="week-hours"] p').should('have.text', 'Weekly hours can\'t be equat less that 0');

      cy.get('[data-cy="week-hours"] input').focus().clear();
      cy.get('[data-cy="week-hours"] input').type('0');
      cy.get('[data-cy="week-hours"] input').should('have.value', '0');
      cy.get('[data-cy="week-hours"] p').should('have.text', 'Weekly hours can\'t be equat to 0');

      cy.get('[data-cy="week-hours"] input').focus().clear();
      cy.get('[data-cy="week-hours"] input').type('200');
      cy.get('[data-cy="week-hours"] input').should('have.value', '200');
      cy.get('[data-cy="week-hours"] p').should('not.exist');
    });

    it.skip('Total days field validations', () => {
      cy.get('[data-cy="duration-in-days"] input').should('have.value', '45');

      cy.get('[data-cy="duration-in-days"] input').focus().clear();
      cy.get('[data-cy="duration-in-days"] input').type('Defence-Against-The-Dark-Arts');
      cy.get('[data-cy="duration-in-days"] input').should('have.value', '');
      cy.get('[data-cy="duration-in-days"] p').should('not.exist');

      cy.get('[data-cy="duration-in-days"] input').focus().clear();
      cy.get('[data-cy="duration-in-days"] input').type('*>*>defence-against-the-dark-arts<*<*');
      cy.get('[data-cy="duration-in-days"] input').should('have.value', '');
      cy.get('[data-cy="duration-in-days"] p').should('not.exist');

      cy.get('[data-cy="duration-in-days"] input').focus().clear();
      cy.get('[data-cy="duration-in-days"] input').type('1');
      cy.get('[data-cy="duration-in-days"] input').should('have.value', '1');
      cy.get('[data-cy="duration-in-days"] p').should('not.exist');

      cy.get('[data-cy="duration-in-days"] input').focus().clear();
      cy.get('[data-cy="duration-in-days"] input').type('-1');
      cy.get('[data-cy="duration-in-days"] input').should('have.value', '-1');
      cy.get('[data-cy="duration-in-days"] p').should('have.text', 'Total days can\'t be equat less that 0');

      cy.get('[data-cy="duration-in-days"] input').focus().clear();
      cy.get('[data-cy="duration-in-days"] input').type('0');
      cy.get('[data-cy="duration-in-days"] input').should('have.value', '0');
      cy.get('[data-cy="duration-in-days"] p').should('have.text', 'Total days can\'t be equat to 0');

      cy.get('[data-cy="duration-in-days"] input').focus().clear();
      cy.get('[data-cy="duration-in-days"] input').type('200');
      cy.get('[data-cy="duration-in-days"] input').should('have.value', '200');
      cy.get('[data-cy="duration-in-days"] p').should('not.exist');
    });

    it.skip('Github URL field validations', () => {
      cy.get('[data-cy="github-url"] input').should('have.value', 'https://github.com/jefer94/apiv2');

      cy.get('[data-cy="github-url"] input').focus().clear();
      cy.get('[data-cy="github-url"] input').type('https://www.google.com/');
      cy.get('[data-cy="github-url"] input').should('have.value', 'https://www.google.com/');
      cy.get('[data-cy="github-url"] p').should('have.text', 'Invalid github url');

      cy.get('[data-cy="github-url"] input').focus().clear();
      cy.get('[data-cy="github-url"] input').type('https://');
      cy.get('[data-cy="github-url"] input').should('have.value', 'https://');
      cy.get('[data-cy="github-url"] p').should('have.text', 'Invalid github url');

      cy.get('[data-cy="github-url"] input').focus().clear();
      cy.get('[data-cy="github-url"] input').type('https://github.com');
      cy.get('[data-cy="github-url"] input').should('have.value', 'https://github.com');
      cy.get('[data-cy="github-url"] p').should('have.text', 'Invalid github url');

      cy.get('[data-cy="github-url"] input').focus().clear();
      cy.get('[data-cy="github-url"] input').type('https://github.com/jefer94/apiv2');
      cy.get('[data-cy="github-url"] input').should('have.value', 'https://github.com/jefer94/apiv2');
      cy.get('[data-cy="github-url"] p').should('not.exist');

      cy.get('[data-cy="github-url"] input').focus().clear();
      cy.get('[data-cy="github-url"] input').type('http://github.com/jefer94/apiv2');
      cy.get('[data-cy="github-url"] input').should('have.value', 'http://github.com/jefer94/apiv2');
      cy.get('[data-cy="github-url"] p').should('not.exist');
    });

    it.skip('Logo field validations', () => {
      cy.get('[data-cy=logo] input').should('have.value', 'https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack-ft');

      cy.get('[data-cy=logo] input').focus().clear();
      cy.get('[data-cy=logo] input').type('https://');
      cy.get('[data-cy=logo] input').should('have.value', 'https://');
      cy.get('[data-cy=logo] p').should('have.text', 'Invalid logo url');

      cy.get('[data-cy=logo] input').focus().clear();
      cy.get('[data-cy=logo] input').type('https://www.google.com');
      cy.get('[data-cy=logo] input').should('have.value', 'https://www.google.com');
      cy.get('[data-cy=logo] p').should('have.text', 'Invalid logo url');

      cy.get('[data-cy=logo] input').focus().clear();
      cy.get('[data-cy=logo] input').type('https://www.google.com/');
      cy.get('[data-cy=logo] input').should('have.value', 'https://www.google.com/');
      cy.get('[data-cy=logo] p').should('not.exist');

      cy.get('[data-cy=logo] input').focus().clear();
      cy.get('[data-cy=logo] input').type('http://github.com/jefer94/apiv2');
      cy.get('[data-cy=logo] input').should('have.value', 'http://github.com/jefer94/apiv2');
      cy.get('[data-cy=logo] p').should('not.exist');
    });

    it('Check request', () => {
      cy.get('[data-cy=slug] input').should('have.value', 'full-stack-ft');
      cy.get('[data-cy=name] input').should('have.value', 'Full-Stack Software Developer FT');
      cy.get('[data-cy="duration-in-hours"] input').should('have.value', '320');
      cy.get('[data-cy="week-hours"] input').should('have.value', '40');
      cy.get('[data-cy="duration-in-days"] input').should('have.value', '45');
      cy.get('[data-cy="github-url"] input').should('have.value', 'https://github.com/jefer94/apiv2');
      cy.get('[data-cy=logo] input').should('have.value', 'https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack-ft');

      // change values
      cy.get('[data-cy=slug] input').focus().clear();
      cy.get('[data-cy=slug] input').type('regular-show');

      cy.get('[data-cy=name] input').focus().clear();
      cy.get('[data-cy=name] input').type('Regular Show');

      cy.get('[data-cy="duration-in-hours"] input').focus().clear();
      cy.get('[data-cy="duration-in-hours"] input').type('890');

      cy.get('[data-cy="week-hours"] input').focus().clear();
      cy.get('[data-cy="week-hours"] input').type('1');

      cy.get('[data-cy="duration-in-days"] input').focus().clear();
      cy.get('[data-cy="duration-in-days"] input').type('890');

      cy.get('[data-cy="github-url"] input').focus().clear();
      cy.get('[data-cy="github-url"] input').type('https://github.com/jefer94/gitpod-desktop');

      cy.get('[data-cy=logo] input').focus().clear();
      cy.get('[data-cy=logo] input').type('https://i1.sndcdn.com/avatars-000096076334-121vuv-t500x500.jpg');

      // check after fill the form
      cy.get('[data-cy=slug] input').should('have.value', 'regular-show');
      cy.get('[data-cy=name] input').should('have.value', 'Regular Show');
      cy.get('[data-cy="duration-in-hours"] input').should('have.value', '890');
      cy.get('[data-cy="week-hours"] input').should('have.value', '1');
      cy.get('[data-cy="duration-in-days"] input').should('have.value', '890');
      cy.get('[data-cy="github-url"] input').should('have.value', 'https://github.com/jefer94/gitpod-desktop');
      cy.get('[data-cy=logo] input').should('have.value', 'https://i1.sndcdn.com/avatars-000096076334-121vuv-t500x500.jpg');

      // // send request
      // cy.get('[data-cy=submit]').click()

      // // check the payload
      // cy.wait('@postAdmissionsAcademyCohortRequest').then(({ request }) => {
      //   cy.wrap(request.body).its('name').should('eq', 'Defence Against the Dark Arts');
      //   cy.wrap(request.body).its('slug').should('eq', 'defence-against-the-dark-arts');

      //   const isKickoffDateAIsoDate = moment(request.body.kickoff_date, moment.ISO_8601, true).isValid();
      //   cy.wrap(isKickoffDateAIsoDate).should('eq', true);

      //   cy.wrap(request.body).its('ending_date').should('eq', null);
      //   cy.wrap(request.body).its('never_ends').should('eq', true);
      //   cy.wrap(request.body).its('syllabus').should('eq', 'full-stack-ft.v1');
      //   cy.wrap(request.body).its('specialty_mode').should('eq', 4);
      // })

      // cy.location('pathname').should('eq', '/admissions/cohorts');
    });
  });
});
