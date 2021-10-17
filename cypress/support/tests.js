Cypress.Commands.add('testSlugField', (form='default', name='slug', value) => {
  const inputSelector = `[data-cy="${form}-${name}"] input`
  const errorSelector = `[data-cy="${form}-${name}"] p`

  if (value) cy.get(inputSelector).should('have.value', value);

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('Defence-Against-The-Dark-Arts').blur();
  cy.get(inputSelector).should('have.value', 'Defence-Against-The-Dark-Arts');
  cy.get(errorSelector).should('have.text', 'Slug can\'t contains uppercase');

  // http://www.robertecker.com/hp/research/leet-converter.php?lang=en
  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('d3f3nc3-4641n57-7h3-d4rk-4r75').blur();
  cy.get(inputSelector).should('have.value', 'd3f3nc3-4641n57-7h3-d4rk-4r75');
  cy.get(errorSelector).should('not.exist');

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('Defence Against The Dark Arts').blur();
  cy.get(inputSelector).should('have.value', 'Defence Against The Dark Arts');
  cy.get(errorSelector).should('have.text', 'Slug can\'t contains spaces');

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('defence-against-the-dark-arts').blur();
  cy.get(inputSelector).should('have.value', 'defence-against-the-dark-arts');
  cy.get(errorSelector).should('not.exist');

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('defence-against-the-dark-arts-').blur();
  cy.get(inputSelector).should('have.value', 'defence-against-the-dark-arts-');
  cy.get(errorSelector).should('have.text', 'Slug can\'t end with (-)');

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('*>*>defence-against-the-dark-arts<*<*').blur();
  cy.get(inputSelector).should('have.value', '*>*>defence-against-the-dark-arts<*<*');
  cy.get(errorSelector).should('have.text', 'Slug can\'t contains symbols');
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
  cy.get(errorSelector).should('have.text', 'Name can\'t contains symbols');
});

Cypress.Commands.add('testNonZeroPositiveNumberField', (form='default', label, name, value) => {
  const inputSelector = `[data-cy="${form}-${name}"] input`
  const errorSelector = `[data-cy="${form}-${name}"] p`
  const requiredError = `${label} is a required field`;

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
  cy.get(errorSelector).should('have.text', `${label} can\'t be less that 0`);

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('0').blur();
  cy.get(inputSelector).should('have.value', '0');
  cy.get(errorSelector).should('have.text', `${label} can\'t be equal to 0`);

  cy.get(inputSelector).focus().clear();
  cy.get(inputSelector).type('200').blur();
  cy.get(inputSelector).should('have.value', '200');
  cy.get(errorSelector).should('not.exist');
});
