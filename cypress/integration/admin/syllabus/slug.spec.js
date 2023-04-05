// <reference types="cypress" />
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(tz);
dayjs.extend(utc);
dayjs.tz.guess();

const timeslotStartingAt = '2021-10-12T20:40:07Z';
const timeslotEndingAt = '2021-10-12T21:40:07Z';
const timezone = 'Pacific/Pago_Pago';

describe('/admissions/syllabus/:slug', () => {
  beforeEach(() => {
    // cy.auth();

    cy.mock().then(({ breathecode }) => {
      // auth
      breathecode.auth.getTokenKey();
      breathecode.auth.getUserMe({
        roles: [
          {
            academy: {
              id: 4,
              name: '4Geeks Academy Miami',
              slug: 'downtown-miami',
              timezone: 'Pacific/Pago_Pago',
            },
            role: 'admin',
          },
        ],
      });
      breathecode.admissions.putAcademyCohortId();

      // mock requests
      breathecode.admissions.getSyllabus();
      breathecode.admissions.getSyllabusSlug('full-stack-ft', {
        private: true,
      });
      breathecode.admissions.getSchedule([
        {
          id: 4,
          slug: 'full-stack-pt-mon',
          name: 'Full Stack PT Mon',
        },
        {
          id: 5,
          slug: 'full-stack-pt-sun',
          name: 'Full Stack PT Sun',
        },
        {
          id: 6,
          slug: 'full-stack-pt-wet',
          name: 'Full Stack PT Wet',
        },
      ]);
      breathecode.admissions.getAcademyScheduleIdTimeslot(4, [
        {
          id: 11,
          starting_at: timeslotStartingAt,
          ending_at: timeslotEndingAt,
        },
      ]);
      breathecode.admissions.getAcademyScheduleIdTimeslot(5, [
        {
          id: 12,
          starting_at: timeslotStartingAt,
          ending_at: timeslotEndingAt,
          recurrency_type: 'DAILY',
        },
      ]);
      breathecode.admissions.getAcademyScheduleIdTimeslot(6, [
        {
          id: 13,
          starting_at: timeslotStartingAt,
          ending_at: timeslotEndingAt,
          recurrency_type: 'MONTH',
        },
      ]);
      breathecode.admissions.getAcademyScheduleIdTimeslot(7, []);
      breathecode.admissions.putSyllabusId();
      breathecode.admissions.deleteAcademyScheduleIdTimeslotId();
      breathecode.admissions.postAcademySchedule();
      breathecode.admissions.postAcademyScheduleIdTimeslot();

      cy.visit('/admissions/syllabus/full-stack-ft', {
        onBeforeLoad(win) {
          cy.stub(win, 'open');
          // debug in cypress.io
          // cy.stub(win.console, 'log', console.log)
          // cy.stub(win.console, 'error', console.error)
        },
      });
    });
  });

  context('Additional Actions', () => {
    it('Make public/private', () => {
      cy.mock().then(({ breathecode }) => {
        // mock requests
        cy.wait(2000);

        cy.get('[cy-data="syllabus-private-alert"]').should(
          'have.text',
          'This syllabus is private'
        );
        breathecode.admissions.getSyllabusSlug('full-stack-ft', {
          private: false,
        });
        cy.get('[data-cy="additional-actions"]').click();
        cy.contains('li', 'Make public').click();
        cy.get('[data-cy="confirm-alert-accept-button"]').click();
        cy.wait(2000);

        cy.get('[cy-data="syllabus-private-alert"]').should('not.exist');
        breathecode.admissions.getSyllabusSlug('full-stack-ft', {
          private: true,
        });
        cy.get('[data-cy="additional-actions"]').click();
        cy.contains('li', 'Make private').click();
        cy.get('[data-cy="confirm-alert-accept-button"]').click();
        cy.wait(2000);

        cy.get('[cy-data="syllabus-private-alert"]').should(
          'have.text',
          'This syllabus is private'
        );
        cy.get('[data-cy="additional-actions"]').click();
        cy.contains('li', 'Make public').should('exist');
      });
    });
    it('Edit syllabus content', () => {
      cy.get('[data-cy="additional-actions"]').click();
      cy.contains('li', 'Edit Syllabus Content').click();

      cy.window().its('open').should('be.calledOnce');
      // cy.window().its('open').should('be.calledWith', 'https://build.breatheco.de/', '_blank');
    });
  });

  context('Syllabus form', () => {
    it('How many days ago', () => {
      cy.fixture('admissions/syllabus/slug.json').then(({ created_at }) => {
        const howManyDaysAgo = dayjs().diff(created_at, 'days');
        cy.get('[data-cy="how-many-days-ago"]').should(
          'have.text',
          `Created at: ${howManyDaysAgo} days ago`
        );
      });
    });

    it('Slug field validations', () => {
      cy.get('[data-cy="default-slug"]').should('not.be.enabled');
    });

    it('Name field validations', () => {
      cy.testNameField('default', 'name', 'Full-Stack Software Developer FT');
    });

    it('Total hours field validations', () => {
      cy.testNonZeroPositiveNumberField(
        'default',
        'Total hours',
        'duration-in-hours',
        '320'
      );
    });

    it('Weekly hours field validations', () => {
      cy.testNonZeroPositiveNumberField(
        'default',
        'Weekly hours',
        'week-hours',
        '40'
      );
    });

    it('Total days field validations', () => {
      cy.testNonZeroPositiveNumberField(
        'default',
        'Total days',
        'duration-in-days',
        '45'
      );
    });

    it('Github URL field validations', () => {
      cy.get('[data-cy="default-github-url"] input').should(
        'have.value',
        'https://github.com/jefer94/apiv2'
      );

      cy.get('[data-cy="default-github-url"] input').focus().clear();
      cy.get('[data-cy="default-github-url"] input')
        .type('https://www.google.com/')
        .blur();
      cy.get('[data-cy="default-github-url"] input').should(
        'have.value',
        'https://www.google.com/'
      );
      // cy.get('[data-cy="default-github-url"] p').should('have.text', 'Invalid github url');

      cy.get('[data-cy="default-github-url"] input').focus().clear();
      cy.get('[data-cy="default-github-url"] input').type('https://').blur();
      cy.get('[data-cy="default-github-url"] input').should(
        'have.value',
        'https://'
      );
      // cy.get('[data-cy="default-github-url"] p').should('have.text', 'Invalid github url');

      cy.get('[data-cy="default-github-url"] input').focus().clear();
      cy.get('[data-cy="default-github-url"] input')
        .type('https://github.com')
        .blur();
      cy.get('[data-cy="default-github-url"] input').should(
        'have.value',
        'https://github.com'
      );
      // cy.get('[data-cy="default-github-url"] p').should('have.text', 'Invalid github url');

      cy.get('[data-cy="default-github-url"] input').focus().clear();
      cy.get('[data-cy="default-github-url"] input').type(
        'https://github.com/jefer94/apiv2'
      );
      cy.get('[data-cy="default-github-url"] input').should(
        'have.value',
        'https://github.com/jefer94/apiv2'
      );
      cy.get('[data-cy="default-github-url"] p').should('not.exist');

      cy.get('[data-cy="default-github-url"] input').focus().clear();
      cy.get('[data-cy="default-github-url"] input')
        .type('http://github.com/jefer94/apiv2')
        .blur();
      cy.get('[data-cy="default-github-url"] input').should(
        'have.value',
        'http://github.com/jefer94/apiv2'
      );
      cy.get('[data-cy="default-github-url"] p').should('not.exist');
    });

    it('Logo field validations', () => {
      cy.get('[data-cy=default-logo] input').should(
        'have.value',
        'https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack-ft'
      );

      cy.get('[data-cy=default-logo] input').focus().clear();
      cy.get('[data-cy=default-logo] input').type('https://').blur();
      cy.get('[data-cy=default-logo] input').should('have.value', 'https://');
      cy.get('[data-cy=default-logo] p').should(
        'have.text',
        'Invalid logo url'
      );

      cy.get('[data-cy=default-logo] input').focus().clear();
      cy.get('[data-cy=default-logo] input')
        .type('https://www.google.com')
        .blur();
      cy.get('[data-cy=default-logo] input').should(
        'have.value',
        'https://www.google.com'
      );
      cy.get('[data-cy=default-logo] p').should('not.exist');

      cy.get('[data-cy=default-logo] input').focus().clear();
      cy.get('[data-cy=default-logo] input')
        .type('https://www.google.com/')
        .blur();
      cy.get('[data-cy=default-logo] input').should(
        'have.value',
        'https://www.google.com/'
      );
      cy.get('[data-cy=default-logo] p').should('not.exist');

      cy.get('[data-cy=default-logo] input').focus().clear();
      cy.get('[data-cy=default-logo] input')
        .type('http://github.com/jefer94/apiv2')
        .blur();
      cy.get('[data-cy=default-logo] input').should(
        'have.value',
        'http://github.com/jefer94/apiv2'
      );
      cy.get('[data-cy=default-logo] p').should('not.exist');
    });

    it('Check request', () => {
      cy.get('[data-cy="default-slug"] input').should(
        'have.value',
        'full-stack-ft'
      );
      cy.get('[data-cy="default-name"] input').should(
        'have.value',
        'Full-Stack Software Developer FT'
      );
      cy.get('[data-cy="default-duration-in-hours"] input').should(
        'have.value',
        '320'
      );
      cy.get('[data-cy="default-week-hours"] input').should('have.value', '40');
      cy.get('[data-cy="default-duration-in-days"] input').should(
        'have.value',
        '45'
      );
      cy.get('[data-cy="default-github-url"] input').should(
        'have.value',
        'https://github.com/jefer94/apiv2'
      );
      cy.get('[data-cy="default-logo"] input').should(
        'have.value',
        'https://storage.googleapis.com/admissions-breathecode/certificate-logo-full-stack-ft'
      );

      // change values
      cy.get('[data-cy="default-slug"] input').clear({ force: true });
      cy.get('[data-cy="default-slug"] input').type('regular-show', {
        force: true,
      });

      cy.get('[data-cy="default-name"] input').focus().clear();
      cy.get('[data-cy="default-name"] input').type('Regular Show').blur();

      cy.get('[data-cy="default-duration-in-hours"] input').focus().clear();
      cy.get('[data-cy="default-duration-in-hours"] input').type('890').blur();

      cy.get('[data-cy="default-week-hours"] input').focus().clear();
      cy.get('[data-cy="default-week-hours"] input').type('1').blur();

      cy.get('[data-cy="default-duration-in-days"] input').focus().clear();
      cy.get('[data-cy="default-duration-in-days"] input').type('890').blur();

      cy.get('[data-cy="default-github-url"] input').focus().clear();
      cy.get('[data-cy="default-github-url"] input')
        .type('https://github.com/jefer94/gitpod-desktop')
        .blur();

      cy.get('[data-cy="default-logo"] input').focus().clear();
      cy.get('[data-cy="default-logo"] input')
        .type('https://i1.sndcdn.com/avatars-000096076334-121vuv-t500x500.jpg')
        .blur();

      // check after fill the form
      cy.get('[data-cy="default-slug"] input').should(
        'have.value',
        'regular-show'
      );
      cy.get('[data-cy="default-name"] input').should(
        'have.value',
        'Regular Show'
      );
      cy.get('[data-cy="default-duration-in-hours"] input').should(
        'have.value',
        '890'
      );
      cy.get('[data-cy="default-week-hours"] input').should('have.value', '1');
      cy.get('[data-cy="default-duration-in-days"] input').should(
        'have.value',
        '890'
      );
      cy.get('[data-cy="default-github-url"] input').should(
        'have.value',
        'https://github.com/jefer94/gitpod-desktop'
      );
      cy.get('[data-cy="default-logo"] input').should(
        'have.value',
        'https://i1.sndcdn.com/avatars-000096076334-121vuv-t500x500.jpg'
      );

      // send request
      cy.get('[data-cy=submit]').click();

      // check the payload
      cy.wait('@putAdmissionsSyllabusIdRequest').then(({ request }) => {
        cy.wrap(request.body).its('id').should('eq', 36);
        cy.wrap(request.body).its('name').should('eq', 'Regular Show');
        cy.wrap(request.body).its('slug').should('eq', 'regular-show');
        cy.wrap(request.body).its('duration_in_hours').should('eq', 890);
        cy.wrap(request.body).its('week_hours').should('eq', 1);
        cy.wrap(request.body).its('duration_in_days').should('eq', 890);
        cy.wrap(request.body)
          .its('github_url')
          .should('eq', 'https://github.com/jefer94/gitpod-desktop');
        cy.wrap(request.body)
          .its('logo')
          .should(
            'eq',
            'https://i1.sndcdn.com/avatars-000096076334-121vuv-t500x500.jpg'
          );
      });

      // cy.location('pathname').should('eq', '/admissions/cohorts');
    });
  });

  context('Schedule Form', () => {
    it('Schedule label', () => {
      cy.get('[data-cy="schedules-label"]').should(
        'have.text',
        'Available schedules:'
      );
    });

    it('Name field validations', () => {
      cy.get('[data-cy="new-schedule"]').should('have.text', 'New schedule');
      cy.get('[data-cy="new-schedule"]').click();

      cy.testNameField('new-schedule', 'name');
    });

    it('Description field validations', () => {
      cy.get('[data-cy="new-schedule"]').should('have.text', 'New schedule');
      cy.get('[data-cy="new-schedule"]').click();

      cy.testDescriptionField('new-schedule', 'description');
    });

    it('Schedule type field validations', () => {
      cy.get('[data-cy="new-schedule"]').should('have.text', 'New schedule');
      cy.get('[data-cy="new-schedule"]').click();

      cy.testSelectField(
        'new-schedule',
        'schedule-type',
        ['Part time', 'Full time'],
        undefined,
        true
      );
    });

    it('Check request', () => {
      const text =
        "You can pass with confidence, you will see me clean as a sun. It's me, I " +
        'clean myself with the MAS pot cleaner. \nThat removes more stains, that disinfects ' +
        'more, that cleans more and does not harm.\nClean us with MAS well cleaner.';

      cy.get('[data-cy="new-schedule"]').should('have.text', 'New schedule');
      cy.get('[data-cy="new-schedule"]').click();

      cy.get('[data-cy="new-schedule-name"] input').should('have.value', '');
      cy.get('[data-cy="new-schedule-description"] textarea[required]')
        .first()
        .should('have.value', '');
      cy.get('[data-cy="new-schedule-schedule-type"] input').should(
        'have.value',
        ''
      );

      // change values
      cy.get('[data-cy="new-schedule-name"] input')
        .focus()
        .clear({ force: true });
      cy.get('[data-cy="new-schedule-name"] input').type('Regular Show').blur();

      cy.get('[data-cy="new-schedule-description"] textarea[required]')
        .focus()
        .clear();
      cy.get('[data-cy="new-schedule-description"] textarea[required]')
        .type(text)
        .blur();

      cy.get('[data-cy="new-schedule-schedule-type"] input').focus().clear();
      cy.get('[data-cy="new-schedule-schedule-type"] input')
        .type('part time{downarrow}{enter}')
        .blur();

      // check after fill the form
      cy.get('[data-cy="new-schedule-name"] input').should(
        'have.value',
        'Regular Show'
      );
      cy.get('[data-cy="new-schedule-description"]  textarea[required]').should(
        'have.value',
        text
      );
      cy.get('[data-cy="new-schedule-schedule-type"] input').should(
        'have.value',
        'Part time'
      );

      // send request
      cy.get('[data-cy="new-schedule-submit"]').click();

      // check the payload
      cy.wait('@postAdmissionsAcademyScheduleRequest').then(({ request }) => {
        cy.wrap(request.body).its('name').should('eq', 'Regular Show');
        cy.wrap(request.body).its('description').should('eq', text);
        cy.wrap(request.body).its('schedule_type').should('eq', 'PART-TIME');
        cy.wrap(request.body).its('syllabus').should('eq', 36);

        cy.get('[data-cy="schedule-title-4"]').should(
          'have.text',
          'Full Stack PT Mon:'
        );
        cy.get('[data-cy="schedule-title-5"]').should(
          'have.text',
          'Full Stack PT Sun:'
        );
        cy.get('[data-cy="schedule-title-6"]').should(
          'have.text',
          'Full Stack PT Wet:'
        );
        cy.get('[data-cy="schedule-title-7"]').should(
          'have.text',
          'Regular Show:'
        );
        cy.get('[data-cy="new-timeslot-7"]').should('exist');
      });
    });
  });

  context('Timeslot Form', () => {
    it('List and delete', () => {
      cy.window().then((win) => {
        const startingHour = dayjs(timeslotStartingAt)
          .tz(timezone)
          .format('HH:mm');
        const endingHour = dayjs(timeslotEndingAt).tz(timezone).format('HH:mm');

        cy.get('[data-cy="schedule-title-4"]').should(
          'have.text',
          'Full Stack PT Mon:'
        );
        cy.get('[data-cy="schedule-title-5"]').should(
          'have.text',
          'Full Stack PT Sun:'
        );
        cy.get('[data-cy="schedule-title-6"]').should(
          'have.text',
          'Full Stack PT Wet:'
        );

        cy.get('[data-cy="timeslot-detail-11"]').should(
          'have.text',
          `Every WEEK on Tuesday from ${startingHour} to ${endingHour}`
        );
        cy.get('[data-cy="timeslot-detail-12"]').should(
          'have.text',
          `Every DAY on Tuesday from ${startingHour} to ${endingHour}`
        );
        cy.get('[data-cy="timeslot-detail-13"]').should(
          'have.text',
          `Every MONTH on Tuesday from ${startingHour} to ${endingHour}`
        );

        cy.mock().then(({ breathecode }) => {
          breathecode.admissions.getAcademyScheduleIdTimeslot(5, []);
          cy.get('[data-cy="delete-timeslot-12"]').click();
          cy.testConfirmAlert();

          cy.get('[data-cy="confirm-alert-accept-button"]').click();

          cy.get('[data-cy="schedule-title-4"]').should(
            'have.text',
            'Full Stack PT Mon:'
          );
          cy.get('[data-cy="schedule-title-5"]').should(
            'have.text',
            'Full Stack PT Sun:'
          );
          cy.get('[data-cy="schedule-title-6"]').should(
            'have.text',
            'Full Stack PT Wet:'
          );

          cy.get('[data-cy="timeslot-detail-11"]').should(
            'have.text',
            `Every WEEK on Tuesday from ${startingHour} to ${endingHour}`
          );
          cy.get('[data-cy="timeslot-detail-12"]').should('not.exist');
          cy.get('[data-cy="timeslot-detail-13"]').should(
            'have.text',
            `Every MONTH on Tuesday from ${startingHour} to ${endingHour}`
          );

          cy.get('@deleteAdmissionsAcademyScheduleIdTimeslotIdRequest').then(
            ({ request }) => {
              cy.wrap(request.body).should('eq', '');
              cy.wrap(request.method).should('eq', 'DELETE');
            }
          );
        });
      });
    });

    it('Recurrency type field validations', () => {
      cy.get('[data-cy="new-timeslot-4"]').click();

      // click the recurrent checkbox
      cy.get('[data-cy="new-timeslot-recurrent"] input').click();

      // test the select field
      cy.testSelectField('new-timeslot', 'recurrency-type', [
        'Daily',
        'Weekly',
        'Monthly',
      ]);
    });

    it('Starting date field validations', () => {
      cy.get('[data-cy="new-timeslot-4"]').click();
      cy.testDateField('new-timeslot', 'starting-date');
    });

    it('Starting hour field validations', () => {
      cy.get('[data-cy="new-timeslot-4"]').click();
      cy.testTimeField('new-timeslot', 'starting-hour');
    });

    it('Ending hour field validations', () => {
      cy.get('[data-cy="new-timeslot-4"]').click();
      cy.testTimeField('new-timeslot', 'ending-hour');
    });

    it('Check request', () => {
      // Don't forget 🦾
      let startingAt = '1911-10-03T04:00:00.000Z';
      let endingAt = '1911-10-03T06:00:00.000Z';

      const startingDate = 'October 02, 1911';
      const startingHour = '17:00 PM';
      const endingHour = '19:00 PM';

      cy.get('[data-cy="new-timeslot-4"]').click();

      cy.get('[data-cy="new-timeslot-recurrent"] input').should(
        'have.value',
        'false'
      );
      cy.get('[data-cy="new-timeslot-recurrency-type"] input').should(
        'have.value',
        ''
      );
      cy.get('[data-cy="new-timeslot-starting-date"] input').should(
        'have.value',
        ''
      );
      cy.get('[data-cy="new-timeslot-starting-hour"] input').should(
        'have.value',
        ''
      );
      cy.get('[data-cy="new-timeslot-ending-hour"] input').should(
        'have.value',
        ''
      );

      // change values
      cy.get('[data-cy="new-timeslot-recurrent"] input').click();
      cy.get('[data-cy="new-timeslot-recurrency-type"] input').focus().clear();
      cy.get('[data-cy="new-timeslot-recurrency-type"] input')
        .type('daily{downarrow}{enter}')
        .blur();

      cy.get('[data-cy="new-timeslot-starting-date"] input').focus().clear();
      cy.get('[data-cy="new-timeslot-starting-date"] input')
        .type(startingDate)
        .blur();

      cy.get('[data-cy="new-timeslot-starting-hour"] input').focus().clear();
      cy.get('[data-cy="new-timeslot-starting-hour"] input')
        .type(startingHour)
        .blur();

      cy.get('[data-cy="new-timeslot-ending-hour"] input').focus().clear();
      cy.get('[data-cy="new-timeslot-ending-hour"] input')
        .type(endingHour)
        .blur();

      // check after fill the form
      cy.get('[data-cy="new-timeslot-recurrent"] input').should(
        'have.value',
        'true'
      );
      cy.get('[data-cy="new-timeslot-recurrency-type"] input').should(
        'have.value',
        'Daily'
      );
      cy.get('[data-cy="new-timeslot-starting-date"] input').should(
        'have.value',
        startingDate
      );
      cy.get('[data-cy="new-timeslot-starting-hour"] input').should(
        'have.value',
        startingHour
      );
      cy.get('[data-cy="new-timeslot-ending-hour"] input').should(
        'have.value',
        endingHour
      );

      // send request
      cy.get('[data-cy="new-timeslot-submit"]').click();

      // check the payload
      cy.wait('@postAdmissionsAcademyScheduleIdTimeslotRequest').then(
        ({ request }) => {
          cy.wrap(request.body).its('recurrent').should('eq', true);
          cy.wrap(request.body).its('recurrency_type').should('eq', 'DAILY');
          cy.wrap(request.body).its('starting_at').should('eq', startingAt);
          cy.wrap(request.body).its('ending_at').should('eq', endingAt);

          const startingHour = dayjs(request.body.starting_at)
            .tz(timezone)
            .format('HH:mm');
          const endingHour = dayjs(request.body.ending_at)
            .tz(timezone)
            .format('HH:mm');

          cy.get('[data-cy="timeslot-detail-17"]').should(
            'have.text',
            `Every DAY on Monday from ${startingHour} to ${endingHour}`
          );
        }
      );
    });

    it('Check request not recurrent', () => {
      // Don't forget 🦾
      let startingAt = '1911-10-03T04:00:00.000Z';
      let endingAt = '1911-10-03T06:00:00.000Z';

      const startingDate = 'October 02, 1911';
      const startingHour = '17:00 PM';
      const endingHour = '19:00 PM';

      cy.get('[data-cy="new-timeslot-4"]').click();

      cy.get('[data-cy="new-timeslot-recurrent"] input').should(
        'have.value',
        'false'
      );
      cy.get('[data-cy="new-timeslot-recurrency-type"] input').should(
        'have.value',
        ''
      );
      cy.get('[data-cy="new-timeslot-starting-date"] input').should(
        'have.value',
        ''
      );
      cy.get('[data-cy="new-timeslot-starting-hour"] input').should(
        'have.value',
        ''
      );
      cy.get('[data-cy="new-timeslot-ending-hour"] input').should(
        'have.value',
        ''
      );

      cy.get('[data-cy="new-timeslot-starting-date"] input').focus().clear();
      cy.get('[data-cy="new-timeslot-starting-date"] input')
        .type(startingDate)
        .blur();

      cy.get('[data-cy="new-timeslot-starting-hour"] input').focus().clear();
      cy.get('[data-cy="new-timeslot-starting-hour"] input')
        .type(startingHour)
        .blur();

      cy.get('[data-cy="new-timeslot-ending-hour"] input').focus().clear();
      cy.get('[data-cy="new-timeslot-ending-hour"] input')
        .type(endingHour)
        .blur();

      // check after fill the form
      cy.get('[data-cy="new-timeslot-recurrent"] input').should(
        'have.value',
        'false'
      );
      // cy.get('[data-cy="new-timeslot-recurrency-type"] input').should('have.value', '');
      cy.get('[data-cy="new-timeslot-starting-date"] input').should(
        'have.value',
        startingDate
      );
      cy.get('[data-cy="new-timeslot-starting-hour"] input').should(
        'have.value',
        startingHour
      );
      cy.get('[data-cy="new-timeslot-ending-hour"] input').should(
        'have.value',
        endingHour
      );

      // send request
      cy.get('[data-cy="new-timeslot-submit"]').click();

      // check the payload
      cy.wait('@postAdmissionsAcademyScheduleIdTimeslotRequest').then(
        ({ request }) => {
          cy.wrap(request.body.recurrency_type).should('eq', undefined);
          cy.wrap(request.body).its('recurrent').should('eq', false);
          cy.wrap(request.body).its('starting_at').should('eq', startingAt);
          cy.wrap(request.body).its('ending_at').should('eq', endingAt);

          const startingHour = dayjs(request.body.starting_at)
            .tz(timezone)
            .format('HH:mm');
          const endingHour = dayjs(request.body.ending_at)
            .tz(timezone)
            .format('HH:mm');

          cy.get('[data-cy="timeslot-detail-17"]').should(
            'have.text',
            `Every DAY on Monday from ${startingHour} to ${endingHour}`
          );
        }
      );
    });
  });
});
