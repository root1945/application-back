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
  }, {
    name: 'Register'
  }],
  paths: {
    '/account/login': {
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
    },
    '/account/signup': {
      post: {
        tags: ['Register'],
        summary: 'API to create a user',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/schemas/registerParams'
              },
              example: {
                name: 'Juliana',
                email: 'juliana@gmail.com',
                password: 'juliana54',
                passwordConfirmation: 'juliana54'
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
    },
    registerParams: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
        password: {
          type: 'string'
        },
        passwordConfirmation: {
          type: 'string'
        }
      },
      required: ['name', 'email', 'password', 'passwordConfirmation']
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
