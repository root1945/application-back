export default {
  openapi: '3.0.3',
  info: {
    title: 'Application API',
    description: 'API documentation for the application',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': {
      post: {
        tags: ['Login'],
        summary: 'API to authenticate a user',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/schemas/loginParams'
              },
              example: {
                email: 'juliana@gmail.com',
                password: 'juliana54'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                example: {
                  accessToken: 'any_token'
                }
              }
            }
          },
          400: {
            $ref: '#/components/badRequest'
          },
          401: {
            $ref: '#/components/unauthorized'
          },
          500: {
            $ref: '#/components/serverError'
          }
        }
      }
    }
  },
  schemas: {
    loginParams: {
      type: 'object',
      properties: {
        email: {
          type: 'string'
        },
        password: {
          type: 'string'
        }
      },
      required: ['email', 'password']
    }
  },
  components: {
    badRequest: {
      description: 'Invalid request'
    },
    unauthorized: {
      description: 'Invalid credentials'
    },
    serverError: {
      description: 'Internal server error'
    }
  }
}
