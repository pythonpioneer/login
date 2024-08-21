/**
  Maximum and minimum lengths for users and it's fields
*/
const USER_FIELD_LENGTH_RESTRICTIONS = {
	emailMaxLength: 100,
	passwordMinLength: 6,
	passwordMaxLength: 17,
	fullNameMinLength: 1,
	fullNameMaxLength: 50,
}

/*
  Email validation regex
  - Non-whitespace characters before and after '@'
  - A domain name
  - A top-level domain (TLD) following a dot
*/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
  Password validation regex
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character
  - No whitespace characters
  - Minimum length is 6 characters
*/
const PASSWORD_REGEX = new RegExp(
  "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\\W_])[^\\s]{" +
  USER_FIELD_LENGTH_RESTRICTIONS.passwordMinLength +
  ",}$"
);

// exporting all constants
export { EMAIL_REGEX, PASSWORD_REGEX, USER_FIELD_LENGTH_RESTRICTIONS };