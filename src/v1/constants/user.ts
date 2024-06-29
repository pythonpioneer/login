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
*/
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[^\s]{8,}$/;

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

// exporting all constants
export { emailRegex, passwordRegex, userFieldLengthRestrictions };