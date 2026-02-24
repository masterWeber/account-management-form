# Account Management Form

Stack:
- Vue.js 3 + Composition API
- TypeScript
- Pinia
- Any UI framework of your choice.

The form consists of:
A header and an "Add Account" button.
Tooltips for the label field.
A list of accounts with field labels.

An account consists of:

- Label - Optional field. Maximum 50 characters. Text labels are entered in the field, separated by a `;` sign.
- Account Type - Dropdown list. Choices are allowed from predefined options:
  LDAP - When this type is selected, the "Password" field is hidden and saved as `null`.
  Local - When this type is selected, the "Password" field is shown and saved as the entered value.
- Login - Required field. Maximum 100 characters.
- Password - Required field. Displayed if the value "Local" is selected in the "Account Type" field. Maximum 100 characters.
Delete account buttons.

Form Logic:

When clicking the "+" button, a new empty entry is added to the end of the list of accounts, consisting of: Label, Account Type, Login, Password.
When clicking the delete button, the account must be completely removed.
Upon completion of entering values into the account fields (for text fields - loss of focus, for select - value change), validation of required fields occurs. In case of validity - the account is saved/updated; otherwise, the fields are outlined in red.
All fields are saved in text format, except for the Label field. It must be converted into an array, where each element is a string value before `;`. The array should contain objects where the `text` field is equal to one label element - ({ text: label element }).
The account must be saved to the state manager. When the page is refreshed, the saved accounts must be displayed.

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```
