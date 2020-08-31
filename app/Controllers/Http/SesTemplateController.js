'use strict'
const Env = use('Env');
const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
const ses = new AWS.SES();

class SesTemplateController {
  listTemplates({ request, response }) {
    const params = {
      MaxItems: '5',
    };

    const responseObj = {};

    ses.listTemplates(params, function(err, data) {
      if (err) {
        responseObj.error = err;
      } else {
        responseObj.data = data;
      }
    });

    const all = request.all();

    response.status(200);
    response.send(responseObj);
  }
}

module.exports = SesTemplateController
