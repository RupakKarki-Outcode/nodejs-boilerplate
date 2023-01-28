const customMessages = {

    //users
    ERROR_LISTING_USERS: 'Error on listing users.',
    ERROR_FETCHING_USER_ID: 'Error while fetching user with ID.',
    EMAIL_ALREADY_USED: 'Email has already been taken.',
    ERROR_CREATING_USER: 'Error while creating new user.',
    ERROR_SIGN_IN: 'Invalid email or password.',
    NO_USER_FOUND: 'No user found.',
    SUCCESS_USER_UPDATE: 'User updated successfully.',
    FAILURE_USER_UPDATE: 'User update failed.',
    INVALID_PASSWORD: 'Invalid password.',
    SUCCESS_PASSWORD_UPDATE: 'Password updated successfully.',
    FAILURE_PASSWORD_UPDATE: 'Password update failed.',
    INVALID_EMAIL: 'Invalid email.',
    FORGOT_PASSWORD_SUCCESS: 'Password recovery email has been sent.',
    FORGOT_PASSWORD_FAILURE: 'Password recovery failed.',
    INVALID_TOKEN: 'Given token was not valid.',
    RESET_PASSWORD_FAILURE: 'Password reset has failed.',
    RESET_PASSWORD_SUCCESS: 'Password reset successfully.',



    // smtp
    SMTP_ERROR: 'SMTP ERROR: unable to send email.',
    EMAIL_SUBJECT_RESET: 'Reset-password',
    EMAIL_SUBJECT_RESET_SUCCESS: 'Password Reset Successful',


    // email body
    EMAIL_BODY_RESET_SUCCESS: 'Your email was successfully reset. Feel free to login and continue with your work.',
}

export default customMessages