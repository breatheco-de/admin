import * as Yup from 'yup';
import capitalizeTheFirstLetter from './capitalizeTheFirstLetter';

const slugSchema = (name = 'slug') => Yup.string()
  .required(`${capitalizeTheFirstLetter(name)} is a required field`)
  .test(
    'exclude-spaces',
    `${capitalizeTheFirstLetter(name)} can't contains spaces`,
    (value) => !/[ ]/.test(value),
  )
  .test(
    'exclude-uppercase',
    `${capitalizeTheFirstLetter(name)} can't contains uppercase`,
    (value) => !/[A-Z]+/.test(value),
  )
  .test(
    'exclude-symbols',
    `${capitalizeTheFirstLetter(name)} can't contains symbols`,
    (value) => !/[^a-zA-Z0-9-]+/.test(value),
  )
  .test(
    'cannot-ends-with-hypen',
    `${capitalizeTheFirstLetter(name)} can't end with (-)`,
    (value) => !/-$/.test(value),
  )
  .test(
    'invalid-slug',
    `Invalid ${name}`,
    (value) => /^[a-z0-9-]+$/.test(value),
  );

const nameSchema = (name = 'name') => Yup.string()
  .required(`${capitalizeTheFirstLetter(name)} is a required field`)
  .test(
    'exclude-symbols',
    `${capitalizeTheFirstLetter(name)} can't contains symbols`,
    (value) => !/[^a-zA-Z0-9 -]+/.test(value),
  )
  .test(
    'invalid-name',
    `Invalid ${name}`,
    (value) => /^[a-zA-Z0-9 -]+$/.test(value),
  );

const descriptionSchema = (name = 'description') => Yup.string()
  .required(`${capitalizeTheFirstLetter(name)} is a required field`);

const dateSchema = (name = 'date') => Yup.date()
  .required(`${capitalizeTheFirstLetter(name)} is empty or had invalid date`);

const timeSchema = (name = 'date') => Yup.date()
  .required(`${capitalizeTheFirstLetter(name)} is empty or had invalid hour`);

const selectSchema = (name = 'select', options = []) => Yup.mixed()
  .required(`${capitalizeTheFirstLetter(name)} is a required field`)
  // .oneOf(options, 'Invalid option');
  .test(
    'invalid-option',
    'Invalid option',
    (value) => (new RegExp(`^(${options.join('|')})$`)).test(value),
  );

// const selectSchema = (name = 'select', options = []) => Yup.string()
//   .required(`${capitalizeTheFirstLetter(name)} is a required field`)
//   .test(
//     'invalid-option',
//     'Invalid option',
//     (value) => (new RegExp(`^(${options.join('|')})$`)).test(value),
//     // (value) => /^[a-zA-Z0-9 -]+$/.test(value),
//   );

const nonZeroPositiveNumberSchema = (name) => Yup.number()
  .required(`${capitalizeTheFirstLetter(name)} is a required field`)
  // .positive('Total hours can\'t be equat less that 0')
  .integer()
  // .min(1, 'Total hours can\'t be equat to 0')
  .test(
    'is-not-zero',
    `${capitalizeTheFirstLetter(name)} can't be equal to 0`,
    (value) => value !== 0,
  )
  .test(
    'is-less-that-zero',
    `${capitalizeTheFirstLetter(name)} can't be less that 0`,
    (value) => value > 0,
  );

export const schemas = {
  slug: slugSchema,
  name: nameSchema,
  description: descriptionSchema,
  date: dateSchema,
  time: timeSchema,
  select: selectSchema,
  nonZeroPositiveNumber: nonZeroPositiveNumberSchema,
};

export default schemas;
