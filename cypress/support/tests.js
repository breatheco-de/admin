import { capitalizeTheFirstLetter } from '../../src/app/utils';

Cypress.Commands.add('testSlugField', (form='default', name='slug', value) => {
  const inputSelector = `[data-cy="${form}-${name}"] input`
  const errorSelector = `[data-cy="${form}-${name}"] p`

  if (value) cy.get(inputSelector).should('have.value', value);
  if(cy.get(inputSelector).should('be.enabled') === true) {
    cy.get(inputSelector).focus().clear();
    cy.get(inputSelector).type('Defence-Against-The-Dark-Arts').blur();
    cy.get(inputSelector).should('have.value', 'Defence-Against-The-Dark-Arts');
    cy.get(errorSelector).should('have.text', `${capitalizeTheFirstLetter(name)} can\'t contains uppercase`);
  
    // http://www.robertecker.com/hp/research/leet-converter.php?lang=en
    cy.get(inputSelector).focus().clear();
    cy.get(inputSelector).type('d3f3nc3-4641n57-7h3-d4rk-4r75').blur();
    cy.get(inputSelector).should('have.value', 'd3f3nc3-4641n57-7h3-d4rk-4r75');
    cy.get(errorSelector).should('not.exist');
  
    cy.get(inputSelector).focus().clear();
    cy.get(inputSelector).type('Defence Against The Dark Arts').blur();
    cy.get(inputSelector).should('have.value', 'Defence Against The Dark Arts');
    cy.get(errorSelector).should('have.text', `${capitalizeTheFirstLetter(name)} can\'t contains spaces`);
  
    cy.get(inputSelector).focus().clear();
    cy.get(inputSelector).type('defence-against-the-dark-arts').blur();
    cy.get(inputSelector).should('have.value', 'defence-against-the-dark-arts');
    cy.get(errorSelector).should('not.exist');
  
    cy.get(inputSelector).focus().clear();
    cy.get(inputSelector).type('defence-against-the-dark-arts-').blur();
    cy.get(inputSelector).should('have.value', 'defence-against-the-dark-arts-');
    cy.get(errorSelector).should('have.text', `${capitalizeTheFirstLetter(name)} can\'t end with (-)`);
  
    cy.get(inputSelector).focus().clear();
    cy.get(inputSelector).type('*>*>defence-against-the-dark-arts<*<*').blur();
    cy.get(inputSelector).should('have.value', '*>*>defence-against-the-dark-arts<*<*');
    cy.get(errorSelector).should('have.text', `${capitalizeTheFirstLetter(name)} can\'t contains symbols`);
  } else {
    cy.log("Field is disabled");
  }
});

Cypress.Commands.add('testNameField', (form='default', name='name', value) => {
  const inputSelector = `[data-cy="${form}-${name}"] input`
  const errorSelector = `[data-cy="${form}-${name}"] p`

  if (value) cy.get(inputSelector).should('have.value', value);

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('Defence-Against-The-Dark-Arts').blur();
  cy.get(inputSelector).should('have.value', 'Defence-Against-The-Dark-Arts');
  cy.get(errorSelector).should('not.exist');

  // http://www.robertecker.com/hp/research/leet-converter.php?lang=en
  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('d3f3nc3-4641n57-7h3-d4rk-4r75').blur();
  cy.get(inputSelector).should('have.value', 'd3f3nc3-4641n57-7h3-d4rk-4r75');
  cy.get(errorSelector).should('not.exist');

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('Defence Against The Dark Arts').blur();
  cy.get(inputSelector).should('have.value', 'Defence Against The Dark Arts');
  cy.get(errorSelector).should('not.exist');

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('*>*>defence-against-the-dark-arts<*<*').blur();
  cy.get(inputSelector).should('have.value', '*>*>defence-against-the-dark-arts<*<*');
  cy.get(errorSelector).should('have.text', `${capitalizeTheFirstLetter(name)} can\'t contains symbols`);
});

Cypress.Commands.add('testNonZeroPositiveNumberField', (form='default', label, name, value) => {
  const inputSelector = `[data-cy="${form}-${name}"] input`
  const errorSelector = `[data-cy="${form}-${name}"] p`
  const requiredError = `${capitalizeTheFirstLetter(label)} is a required field`;

  if (value) cy.get(inputSelector).should('have.value', value);

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('Defence-Against-The-Dark-Arts').blur();
  cy.get(inputSelector).should('have.value', '');
  cy.get(errorSelector).should('have.text', requiredError);

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('*>*>defence-against-the-dark-arts<*<*').blur();
  cy.get(inputSelector).should('have.value', '');
  cy.get(errorSelector).should('have.text', requiredError);

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('1').blur();
  cy.get(inputSelector).should('have.value', '1');
  cy.get(errorSelector).should('not.exist');

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('-1').blur();
  cy.get(inputSelector).should('have.value', '-1');
  cy.get(errorSelector).should('have.text', `${capitalizeTheFirstLetter(label)} can\'t be less that 0`);

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('0').blur();
  cy.get(inputSelector).should('have.value', '0');
  cy.get(errorSelector).should('have.text', `${capitalizeTheFirstLetter(label)} can\'t be equal to 0`);

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('200').blur();
  cy.get(inputSelector).should('have.value', '200');
  cy.get(errorSelector).should('not.exist');
});

Cypress.Commands.add('testConfirmAlert', (obj={}) => {
  const titleSelector = '[data-cy="confirm-alert-title"]'
  const descriptionSelector = '[data-cy="confirm-alert-description"]'
  const acceptButtonSelector = '[data-cy="confirm-alert-accept-button"]'
  const cancelButtonSelector = '[data-cy="confirm-alert-cancel-button"]'

  const title = obj.title || 'Are you sure you want to delete this resource'
  const accept = obj.accept || 'Yes'
  const cancel = obj.accept || 'Cancel'
  const description = obj.description


  cy.get(titleSelector).should('have.text', title);

  if (description) {
    cy.get(descriptionSelector).should('have.text', description);
  } else {
    cy.get(descriptionSelector).should('not.exist');
  }

  cy.get(acceptButtonSelector).should('have.text', accept);
  cy.get(cancelButtonSelector).should('have.text', cancel);
});

Cypress.Commands.add('testDescriptionField', (form='default', name='description', value) => {
  const inputSelector = `[data-cy="${form}-${name}"] textarea[required]`
  const errorSelector = `[data-cy="${form}-${name}"] p`
  const text = 'Lorem ipsum dolor sit amet consectetur adipiscing elit viverra massa hendrerit, penatibus ' +
    'fringilla eu nec conubia cras orci maecenas bibendum.';
  // const requiredError = `${label} is a required field`;

  if (value) cy.get(inputSelector).first().should('have.value', value);

  cy.get(inputSelector).first().should('have.value', '');

  cy.get(inputSelector).first().focus().clear().blur();
  cy.get(inputSelector).first().should('have.value', '');
  cy.get(errorSelector).should('have.text', `${capitalizeTheFirstLetter(name)} is a required field`);

  cy.get(inputSelector).first().focus().clear();
  cy.get(inputSelector).first().type(text).blur();
  cy.get(inputSelector).first().should('have.value', text);
  cy.get(errorSelector).should('not.exist');
});

Cypress.Commands.add('testCheckboxField', (form='default', name, value=false) => {
  const inputSelector = `[data-cy="${form}-${name}"] input`;
  let status = value

  cy.get(inputSelector).first().should('have.value', status ? 'true' : 'false');

  status = !status;
  cy.get(inputSelector).first().click();
  cy.get(inputSelector).first().should('have.value', status ? 'true' : 'false');

  status = !status;
  cy.get(inputSelector).first().click();
  cy.get(inputSelector).first().should('have.value', status ? 'true' : 'false');

  status = !status;
  cy.get(inputSelector).first().click();
  cy.get(inputSelector).first().should('have.value', status ? 'true' : 'false');
});

Cypress.Commands.add('testSelectField', (form='default', name, options=[], value) => {
  const inputSelector = `[data-cy="${form}-${name}"] input`
  const errorSelector = `[data-cy="${form}-${name}"] p`
  const requiredError = `${capitalizeTheFirstLetter(name.replace('-', ' '))} is a required field`;

  if (value) cy.get(inputSelector).first().should('have.value', value);

  cy.get(inputSelector).first().should('have.value', '');

  cy.get(inputSelector).first().focus().clear().blur();
  // cy.get(inputSelector).first().type('').blur();
  cy.get(inputSelector).first().should('have.value', '');
  // cy.get(errorSelector).should('not.exist');
  cy.get(errorSelector).should('have.text', requiredError);

  cy.get(inputSelector).first().focus().clear().blur();
  cy.get(inputSelector).first().type('odyssey{downarrow}').blur();
  cy.get(inputSelector).first().should('have.value', '');
  cy.get(errorSelector).should('have.text', requiredError);

  for (let option of options) {
    cy.get(inputSelector).first().focus().clear();
    cy.get(inputSelector).first().type(`${option}{downarrow}{enter}`).blur();
    cy.get(inputSelector).first().should('have.value', option);
    cy.get(errorSelector).should('not.exist');
  }
});

Cypress.Commands.add('testDateField', (form='default', name='name', value) => {
  const inputSelector = `[data-cy="${form}-${name}"] input`
  const errorSelector = `[data-cy="${form}-${name}"] p`
  const error = `${capitalizeTheFirstLetter(name.replace('-', ' '))} is empty or had invalid date`

  if (value) cy.get(inputSelector).should('have.value', value);

  cy.get(inputSelector).focus().clear().blur();
  cy.get(inputSelector).should('have.value', '');
  cy.get(errorSelector).should('have.text', error);

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('October , 1911').blur();
  cy.get(inputSelector).should('have.value', 'October , 1911');
  cy.get(errorSelector).should('have.text', error);

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('October 3, 1911').blur();
  cy.get(inputSelector).should('have.value', 'October 3, 1911');
  cy.get(errorSelector).should('not.exist');
});

Cypress.Commands.add('testTimeField', (form='default', name='name', value) => {
    const inputSelector = `[data-cy="${form}-${name}"] input`
    const errorSelector = `[data-cy="${form}-${name}"] p`
    const error = `${capitalizeTheFirstLetter(name.replace('-', ' '))} is empty or had invalid hour`

    if (value) cy.get(inputSelector).should('have.value', value);

    cy.get(inputSelector).focus().clear().blur();
    cy.get(inputSelector).should('have.value', '');
    cy.get(errorSelector).should('have.text', error);

    cy.get(inputSelector).focus().clear();
    cy.get(inputSelector).type('10:00').blur();
    cy.get(inputSelector).should('have.value', '10:00');
    cy.get(errorSelector).should('have.text', error);

    cy.get(inputSelector).focus().clear();
    cy.get(inputSelector).type('10:00 AM').blur();
    cy.get(inputSelector).should('have.value', '10:00 AM');
    cy.get(errorSelector).should('not.exist');
});
