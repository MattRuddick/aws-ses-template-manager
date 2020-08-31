'use strict'

class SesTemplateController {
  get({ request, response }) {
    const all = request.all();

    response.status(200);
    response.send({
        message: 'Test Response'
    });
  }
}

module.exports = SesTemplateController
