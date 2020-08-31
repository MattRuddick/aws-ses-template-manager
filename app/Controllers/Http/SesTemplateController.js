'use strict'
const Env = use('Env');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
let ses = new AWS.SES();  //allow this to be re-assigned if we change region from the FE

class SesTemplateController {

  changeRegion({request, response}) {
    //Allow changing of AWS region
    /*var credentials = new AWS.SharedIniFileCredentials({profile: });
    AWS.config.credentials = credentials;*/
  }

  async createTemplate({request, response}) {
    const params = {
      Template: {
        TemplateName: 'Test-Template-3', /* required */
        HtmlPart: '<html><head></head><body><h1>Test Content</h1></body></html>',
        SubjectPart: 'Test SES Template',
        TextPart: 'Test SES template preview content'
      }
    };


    await new Promise((resolve, reject) => {
      //do async AWS createTemplate
      ses.createTemplate(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }).then(response.send(200, 'Created')).catch(err => response.send(500, err));
  }

  async listTemplates({request, response}) {
    await new Promise((resolve, reject) => {
      ses.listTemplates({MaxItems: '5'}, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }).then(data => {
      response.status(200);
      response.send({items: data});
    }).catch(err => response.send(500, err));
  }
}

module.exports = SesTemplateController
