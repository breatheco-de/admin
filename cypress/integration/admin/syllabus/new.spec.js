// <reference types="cypress" />

const moment = require('moment');

describe('/admin/syllabus/new', () => {
  beforeEach(() => {
    cy.auth();
    cy.mockPostAdmissionsSyllabusResponse();
    cy.visit('/admin/syllabus/new');
  });
  context('Syllabus form', () => {
    it('Slug field validations', () => {
      cy.testSlugField('default', 'slug');
    });

    it('Name field validations', () => {
      cy.testNameField('default', 'name');
    });

    it('Total hours field validations', () => {
      cy.testNonZeroPositiveNumberField('default', 'Total hours', 'duration-in-hours');
    });

    it('Weekly hours field validations', () => {
       cy.testNonZeroPositiveNumberField('default', 'Weekly hours', 'week-hours')
    });

    it('Total days field validations', () => {
      cy.testNonZeroPositiveNumberField('default', 'Total days', 'duration-in-days')
    });

    it('Github URL field validations', () => {
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
      // change values
      cy.get('[data-cy="default-slug"] input').focus().clear();
      cy.get('[data-cy="default-slug"] input').type('regular-show');

      cy.get('[data-cy="default-name"] input').focus().clear();
      cy.get('[data-cy="default-name"] input').type('Regular Show');

      cy.get('[data-cy="default-duration-in-hours"] input').focus().clear();
      cy.get('[data-cy="default-duration-in-hours"] input').type('890');

      cy.get('[data-cy="default-week-hours"] input').focus().clear();
      cy.get('[data-cy="default-week-hours"] input').type('1');

      cy.get('[data-cy="default-duration-in-days"] input').focus().clear();
      cy.get('[data-cy="default-duration-in-days"] input').type('890');

      cy.get('[data-cy="default-github-url"] input').focus().clear();
      cy.get('[data-cy="default-github-url"] input').type('https://github.com/jefer94/gitpod-desktop');

      cy.get('[data-cy="default-logo"] input').focus().clear();
      cy.get('[data-cy="default-logo"] input').type('https://i1.sndcdn.com/avatars-000096076334-121vuv-t500x500.jpg');

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
