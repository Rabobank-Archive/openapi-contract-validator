exports.oas3 = function oas3(responseBody, required=[], requestBody={}) {
    return {
        'openapi': '3.0.0',
        'info': {
            'title': 'test contract',
            'version': '0.0.0',
        },
        'paths': {
            '/endpoint': {
                'post': {
                    'requestBody': {
                        'content': {
                            'application/json': {
                                'schema': {
                                    '$ref': '#/components/schemas/request',
                                },
                            },
                            'application/json;version=1': {
                                'schema': {
                                    '$ref': '#/components/schemas/request',
                                },
                            },
                        },
                    },
                    'responses': {
                        '200': {
                            'description': 'ok',
                            'content': {
                                'application/json;version=1': {
                                    'schema': {
                                        '$ref': '#/components/schemas/response',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        'components': {
            'schemas': {
                'response': {
                    'required': required,
                    'type': 'object',
                    'properties': responseBody,
                },
                'request': requestBody,
            },
        },
    };
};
