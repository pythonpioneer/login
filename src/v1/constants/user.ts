/**
  Maximum and minimum lengths for users and it's fields
*/
const userFieldLengthRestrictions = {
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
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
  Password validation regex
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character
  - No whitespace characters
  - Minimum length is 6 characters
*/
const passwordRegex = new RegExp(
    "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[\\W_])[^\s]{" +
        userFieldLengthRestrictions.passwordMinLength + 
        ",}$"
);

// exporting all constants
export { emailRegex, passwordRegex, userFieldLengthRestrictions };