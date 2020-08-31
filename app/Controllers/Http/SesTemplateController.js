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
    const requestBody = request.post();

    const params = {
      Template: {
        TemplateName: requestBody.TemplateName, /* required */
        HtmlPart: requestBody.HtmlPart,
        SubjectPart: requestBody.SubjectPart,
        TextPart: requestBody.TextPart
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
    }).then(response.send(200, 'Created')).catch(err => {
      response.status(500);
      response.send(err);
    });
  }

  async listTemplates({request, response}) {
    const requestParams = request.get();

    await new Promise((resolve, reject) => {
      ses.listTemplates({MaxItems: (requestParams.MaxItems | 5)}, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }).then(data => {
      response.status(200);
      response.send({items: data});
    }).catch(err => {
      response.status(500);
      response.send(err)
    });
  }

  async getTemplate({request, response}) {
    const requestParams = request.get();

    const params = {
      TemplateName: requestParams.TemplateName
    };

    await new Promise((resolve, reject) => {
      ses.getTemplate(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }).then(data => {
      response.status(200);
      response.send({data: data});
    }).catch(err => {
      response.status(500);
      response.send(err);
    });
  }

  async updateTemplate({request, response}) {
    const params = {
      Template: { /* required */
        TemplateName: 'Test-Template-3', /* required */
        HtmlPart: '<html><head></head><body><h1>Test Content (Updated)</h1></body></html>',
        SubjectPart: 'Test SES Template (Updated)',
        TextPart: 'Test SES template preview content (updated)'
      }
    };

    await new Promise((resolve, reject) => {
      ses.updateTemplate(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).then(data => {
      response.send(200);
    }).catch(err => response.send(500, err));
  }

  async deleteTemplate({request, response}) {
    await new Promise((resolve, reject) => {
      const params = {
        TemplateName: 'Test-Template-3' /* required */
      };
      ses.deleteTemplate(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).then(data => {
      response.send(200, 'created');
    }).catch(err => {
      response.status(500);
      response.send(err);
    });
  }
}

module.exports = SesTemplateController
