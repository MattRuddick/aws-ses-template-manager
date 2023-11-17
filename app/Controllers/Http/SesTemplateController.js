'use strict'
const Env = use('Env');
const AWS = require('aws-sdk');
if (!(Env.get('AWS_ACCESS_KEY_ID') && Env.get('AWS_SECRET_ACCESS_KEY'))) {
  const credentials = new AWS.SharedIniFileCredentials({profile: Env.get('AWS_PROFILE_NAME', 'default')});
  AWS.config.credentials = credentials;
}

class SesTemplateController {

  getDynamicFields(contentStr) {
    // a helper function which will convert a string into an array of any mustache dynamic fields
    let dynamicFieldsArr = [];
    if (contentStr) {
      const matchRegex = contentStr.match(/{{\s*[\w\.]+\s*}}/g);  // match on any mustache templates
      if(matchRegex) {
        dynamicFieldsArr = matchRegex.map(function(x) { return x.match(/[\w\.]+/)[0]; });
      }
    }

    return dynamicFieldsArr;
  }

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
      ses.listTemplates({MaxItems: requestParams.MaxItems || 5000}, function (err, data) {
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

      // get dynamic fields to return to the FE
      const {SubjectPart, TextPart, HtmlPart} = data.Template;

      // get 'SubjectPart', 'HtmlPart', 'TextPart' dynamic fields
      let dynamicFieldsArr = [];
      dynamicFieldsArr = [...dynamicFieldsArr, ...this.getDynamicFields(SubjectPart)]; // SubjectPart
      dynamicFieldsArr = [...dynamicFieldsArr, ...this.getDynamicFields(TextPart)]; // TextPart
      dynamicFieldsArr = [...dynamicFieldsArr, ...this.getDynamicFields(HtmlPart)]; // HtmlPart

      dynamicFieldsArr = Array.from(new Set(dynamicFieldsArr)); // removes any dupes

      data.Template['dynamicFields'] = dynamicFieldsArr;  // add the dynamicFields to the payload
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
      ses.updateTemplate(params, function (err, data) {
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
      ses.deleteTemplate(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).then((data) => {
      response.send(200);
    }).catch(err => {
      response.status(500);
      response.send(err);
    });
  }

  async sendTemplate({request, response}) {
    const requestBody = request.post();
    const params = {
      Destination: { /* required */
        ToAddresses: [
          requestBody.toAddress
        ]
      },
      Source: requestBody.source, /* required */
      Template: requestBody.templateName, /* required */
      TemplateData: requestBody.templateData, /* required */
    };

    AWS.config.update({region: requestBody.region});
    const ses = new AWS.SES();

    await new Promise((resolve, reject) => {
      ses.sendTemplatedEmail(params, function(err, data) {
        if (err) {
          // an error occurred
          console.log(err, err.stack);
          reject(err);
        } else{
          resolve(data);           // successful response
        }
      });
    }).then((data) => {
      response.send(200);
    }).catch((err) => {
      response.status(500);
      response.send(err);
    });

  }
}

module.exports = SesTemplateController
