import { Accounts } from 'meteor/accounts-base';
import { render } from 'react-dom';

Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY",
});