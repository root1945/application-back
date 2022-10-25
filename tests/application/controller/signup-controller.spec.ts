
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
  it('should returns 400 if no name is provided', async () => {
    const sut = new SignupController()

    const httpResponse = await sut.handle({
      name: ''
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('Missing param: name')
    })
  })
})
