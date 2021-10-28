export const intercept = ({ fixture, method, url, statusCode, headers, body, as }) => {
    if (fixture) {
        cy.fixture(fixture).then((values) => {
            let response = values;

            if (body instanceof Array) {
                response = body.map((v) => ({ ...values[0], ...v }))
            } else if (body instanceof Object) {
                response = { ...values, ...body };
            }

            cy.intercept({
                method,
                url,
            }, {
                body: response,
                statusCode,
                headers,
            }).as(as);
        });
    } else { // no fixture, should be a 204
        cy.intercept({
            method,
            url,
        }, {
            statusCode,
            headers,
        }).as(as);
    }
}