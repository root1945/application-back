
type HttpRequest = {
  name: string
}

type HttpResponse = {
  statusCode: number
  data: any
}

class SignupController {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: 400,
      data: new Error('Missing param: name')
    }
  }
}

describe('SignupController', () => {
  let sut: SignupController

  beforeEach(() => {
    sut = new SignupController()
  })

  it('should returns 400 if no name is provided', async () => {
    const httpResponse = await sut.handle({
      name: ''
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('Missing param: name')
    })
  })
})
