'use strict'
const Env = use('Env');
const AWS = require('aws-sdk');

class SesTemplateController {

  async createTemplate({request, response}) {
    const requestBody = request.post();

    AWS.config.update({region: requestBody.region});
    const ses = new AWS.SES();

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

    AWS.config.update({region: requestParams.region});
    const ses = new AWS.SES();

    await new Promise((resolve, reject) => {
      ses.listTemplates({MaxItems: (requestParams.MaxItems | 500)}, function (err, data) {
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
    const requestParams = request.params;
    const requestQueryParams = request.get();

    AWS.config.update({region: requestQueryParams.region});
    const ses = new AWS.SES();

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
      response.send({data: data.Template});
    }).catch(err => {
      response.status(500);
      response.send(err);
    });
  }

  async updateTemplate({request, response}) {
    const requestBody = request.post();

    AWS.config.update({region: requestBody.region});
    const ses = new AWS.SES();

    const params = {
      Template: {
        TemplateName: requestBody.TemplateName, /* required */
        HtmlPart: requestBody.HtmlPart,
        SubjectPart: requestBody.SubjectPart,
        TextPart: requestBody.TextPart
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
    }).catch(err => {
      response.status(500);
      response.send(err);
    });
  }

  async deleteTemplate({request, response}) {
    const requestParams = request.params;
    const requestQueryParams = request.get();

    AWS.config.update({region: requestQueryParams.region});
    const ses = new AWS.SES();

    await new Promise((resolve, reject) => {
      const params = {
        TemplateName: requestParams.TemplateName /* required */
      };
      ses.deleteTemplate(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).then(data => {
      response.send(200);
    }).catch(err => {
      response.status(500);
      response.send(err);
    });
  }
}

module.exports = SesTemplateController
