import { intercept } from '../tools'

export default {
    getTokenKey() {
        cy.fixture('auth/login.json').then(({ token, user_id }) => {
            window.localStorage.setItem('accessToken', token)
            cy.intercept(/\/v1\/auth\/token\/([\w\W]+)$/, {
                'body': {
                    "token": token,
                    "token_type": "login",
                    "expires_at": "2021-08-15T13:18:05.345917Z",
                    "user_id": user_id
                }
            }).as('getAuthTokenKeyRequest')
        })

        // cy.fixture('auth/bc-session.json').then((session) => {
        //     window.localStorage.setItem('bc-session', JSON.stringify(session))
        // })
    },
    getUserMe(body) {
        intercept({
            url: /\/v1\/auth\/user\/me$/,
            fixture: 'auth/user/me.json',
            method: 'GET',
            as: 'getAuthUserMeRequest',
            body,
        });
    },
};