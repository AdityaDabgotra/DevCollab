export const RegisterSchema = {
    type: 'object',
    properties: {
        username: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        role: { type: 'string', enum: ['user', 'admin','projectOwner'] },
        bio: { type: 'string', default: '' },
        techStack: { type: 'array', items: { type: 'string' },default: [] },
        projectsJoined: { type: 'array', items: { type: 'string' },default: [] },
    },
    required: ['email', 'password', 'username','role'],
    additionalProperties: false,
}