// <reference types="cypress" />

const moment = require('moment');

describe('/admin/syllabus/:slug', () => {
  beforeEach(() => {
    cy.auth();
    cy.mockPostAdmissionsSyllabusResponse();
    cy.visit('/admin/syllabus/new');
  });
  context('Syllabus form', () => {
    it('Slug field validations', () => {
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

    it('Name field validations', () => {
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

    it('Total hours field validations', () => {
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

    it('Weekly hours field validations', () => {
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

    it('Total days field validations', () => {
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

    it('Github URL field validations', () => {
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

    it('Logo field validations', () => {
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

      // send request
      cy.get('[data-cy=submit]').click()

      // check the payload
      cy.wait('@postAdmissionsSyllabusRequest').then(({ request }) => {
        cy.wrap(request.body).its('name').should('eq', 'Regular Show');
        cy.wrap(request.body).its('slug').should('eq', 'regular-show');
        cy.wrap(request.body).its('duration_in_hours').should('eq', 890);
        cy.wrap(request.body).its('week_hours').should('eq', 1);
        cy.wrap(request.body).its('duration_in_days').should('eq', 890);
        cy.wrap(request.body).its('github_url').should('eq', 'https://github.com/jefer94/gitpod-desktop');
        cy.wrap(request.body).its('logo').should('eq', 'https://i1.sndcdn.com/avatars-000096076334-121vuv-t500x500.jpg');
      })

      cy.location('pathname').should('eq', '/admin/syllabus');
    });
  });
});
