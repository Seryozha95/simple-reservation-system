const messages = {
    response: {
        error: {
            userNotFound: "The specified user not found",
            tableNotFound: "The specified table not found",
            userAlreadyHasReservation: 'The user has a reservation for the specified period',
            tableAlreadyReserved: 'The specified table already reserved',
            invalidDateFormat: "Invalid date format"
        },
        success: {
            reservedPartial: 'The table reserved partial',
            reservedFull: 'The table reserved full'

        }
    },
    local: {
        userSuccessInitiate: 'Default users inserted successfully.',
        userAlreadyInitiated: 'User collection already has documents. Skipping insertion.',
        userFailInitiate: 'Uable to initiate default user',
        internalServerError: 'Internal Server Error',
        serverStart: "Server is running at http://localhost:"
    }
}

export {
    messages
}