export const RegisterSchema = {
    type: 'object',
    properties: {
        identifier: { type: 'string', minLength: 1 },
        password: { type: 'string', minLength: 6 },
    },
    required: ['email', 'password', 'username','role'],
    additionalProperties: false,
}