'use strict'

const Env = use('Env')
const AWS = require('aws-sdk')

// Charge les credentials AWS depuis le .env
AWS.config.update({
  accessKeyId: Env.get('AWS_ACCESS_KEY_ID'),
  secretAccessKey: Env.get('AWS_SECRET_ACCESS_KEY'),
  // sessionToken:    Env.get('AWS_SESSION_TOKEN'), // décommentez si vous utilisez STS
})

class SesTemplateController {

  getDynamicFields(contentStr) {
    // Extrait les champs mustache de type {{field}}
    let dynamicFieldsArr = []
    if (contentStr) {
      const matchRegex = contentStr.match(/{{\s*[\w\.]+\s*}}/g)
      if (matchRegex) {
        dynamicFieldsArr = matchRegex.map(x => x.match(/[\w\.]+/)[0])
      }
    }
    return dynamicFieldsArr
  }

  async createTemplate({ request, response }) {
    const requestBody = request.post()

    // Si vous souhaitez surcharger la région à la volée
    AWS.config.update({ region: requestBody.region })

    const ses = new AWS.SES()
    const params = {
      Template: {
        TemplateName: requestBody.TemplateName,
        HtmlPart: requestBody.HtmlPart,
        SubjectPart: requestBody.SubjectPart,
        TextPart: requestBody.TextPart,
      }
    }

    await new Promise((resolve, reject) => {
      ses.createTemplate(params, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
      .then(() => response.send(200, 'Created'))
      .catch(err => {
        response.status(500)
        response.send(err)
      })
  }

  async listTemplates({ request, response }) {
    const requestParams = request.get()

    AWS.config.update({ region: requestParams.region })
    const ses = new AWS.SES()

    await new Promise((resolve, reject) => {
      ses.listTemplates(
        { MaxItems: requestParams.MaxItems || 5000 },
        (err, data) => {
          if (err) reject(err)
          else resolve(data)
        }
      )
    })
      .then(data => {
        response.status(200)
        response.send({ items: data })
      })
      .catch(err => {
        response.status(500)
        response.send(err)
      })
  }

  async getTemplate({ request, response }) {
    const { TemplateName } = request.params
    const { region } = request.get()

    AWS.config.update({ region })
    const ses = new AWS.SES()

    await new Promise((resolve, reject) => {
      ses.getTemplate({ TemplateName }, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
      .then(data => {
        response.status(200)

        const { SubjectPart, TextPart, HtmlPart } = data.Template
        let dynamicFieldsArr = []
        dynamicFieldsArr = [
          ...dynamicFieldsArr,
          ...this.getDynamicFields(SubjectPart),
          ...this.getDynamicFields(TextPart),
          ...this.getDynamicFields(HtmlPart),
        ]
        dynamicFieldsArr = Array.from(new Set(dynamicFieldsArr))

        data.Template.dynamicFields = dynamicFieldsArr
        response.send({ data: data.Template })
      })
      .catch(err => {
        response.status(500)
        response.send(err)
      })
  }

  async updateTemplate({ request, response }) {
    const requestBody = request.post()

    AWS.config.update({ region: requestBody.region })
    const ses = new AWS.SES()

    const params = {
      Template: {
        TemplateName: requestBody.TemplateName,
        HtmlPart: requestBody.HtmlPart,
        SubjectPart: requestBody.SubjectPart,
        TextPart: requestBody.TextPart,
      }
    }

    await new Promise((resolve, reject) => {
      ses.updateTemplate(params, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
      .then(() => response.send(200))
      .catch(err => {
        response.status(500)
        response.send(err)
      })
  }

  async deleteTemplate({ request, response }) {
    const { TemplateName } = request.params
    const { region } = request.get()

    AWS.config.update({ region })
    const ses = new AWS.SES()

    await new Promise((resolve, reject) => {
      ses.deleteTemplate({ TemplateName }, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
      .then(() => response.send(200))
      .catch(err => {
        response.status(500)
        response.send(err)
      })
  }

  async sendTemplate({ request, response }) {
    const requestBody = request.post()
    const params = {
      Destination: { ToAddresses: [requestBody.toAddress] },
      Source: requestBody.source,
      Template: requestBody.templateName,
      TemplateData: requestBody.templateData,
    }

    AWS.config.update({ region: requestBody.region })
    const ses = new AWS.SES()

    await new Promise((resolve, reject) => {
      ses.sendTemplatedEmail(params, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
      .then(() => response.send(200))
      .catch(err => {
        response.status(500)
        response.send(err)
      })
  }
}

module.exports = SesTemplateController