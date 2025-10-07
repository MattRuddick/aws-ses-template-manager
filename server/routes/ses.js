const express = require('express');
const { SESClient, ListTemplatesCommand, GetTemplateCommand, CreateTemplateCommand, UpdateTemplateCommand, DeleteTemplateCommand, SendTemplatedEmailCommand } = require('@aws-sdk/client-ses');

const router = express.Router();

// Helper function to extract dynamic fields from template content
const get_dynamic_fields = (content_str) => {
  let dynamic_fields_arr = [];
  if (content_str) {
    const match_regex = content_str.match(/{{\s*[\w\.]+\s*}}/g);
    if (match_regex) {
      dynamic_fields_arr = match_regex.map(function(x) { 
        return x.match(/[\w\.]+/)[0]; 
      });
    }
  }
  return dynamic_fields_arr;
};

// Create SES client with credentials
const create_ses_client = (region) => {
  return new SESClient({
    region: region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });
};

// List templates
router.get('/list-templates', async (req, res) => {
  try {
    const { region, max_items = 5000 } = req.query;
    
    const ses_client = create_ses_client(region);
    const command = new ListTemplatesCommand({ MaxItems: parseInt(max_items) });
    const data = await ses_client.send(command);
    
    res.json({ items: data });
  } catch (err) {
    console.error('Error listing templates:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get template
router.get('/get-template/:template_name', async (req, res) => {
  try {
    const { template_name } = req.params;
    const { region } = req.query;

    const ses_client = create_ses_client(region);
    const command = new GetTemplateCommand({ TemplateName: template_name });
    const data = await ses_client.send(command);
    
    // Extract dynamic fields
    const { SubjectPart, TextPart, HtmlPart } = data.Template;
    let dynamic_fields_arr = [];
    dynamic_fields_arr = [...dynamic_fields_arr, ...get_dynamic_fields(SubjectPart)];
    dynamic_fields_arr = [...dynamic_fields_arr, ...get_dynamic_fields(TextPart)];
    dynamic_fields_arr = [...dynamic_fields_arr, ...get_dynamic_fields(HtmlPart)];
    dynamic_fields_arr = Array.from(new Set(dynamic_fields_arr));

    data.Template.dynamic_fields = dynamic_fields_arr;
    res.json({ data: data.Template });
  } catch (err) {
    console.error('Error getting template:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create template
router.post('/create-template', async (req, res) => {
  try {
    const { template_name, html_part, subject_part, text_part, region } = req.body;

    const ses_client = create_ses_client(region);
    const command = new CreateTemplateCommand({
      Template: {
        TemplateName: template_name,
        HtmlPart: html_part,
        SubjectPart: subject_part,
        TextPart: text_part
      }
    });

    await ses_client.send(command);
    res.status(200).json({ message: 'Template created successfully' });
  } catch (err) {
    console.error('Error creating template:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update template
router.put('/update-template', async (req, res) => {
  try {
    const { template_name, html_part, subject_part, text_part, region } = req.body;

    const ses_client = create_ses_client(region);
    const command = new UpdateTemplateCommand({
      Template: {
        TemplateName: template_name,
        HtmlPart: html_part,
        SubjectPart: subject_part,
        TextPart: text_part
      }
    });

    await ses_client.send(command);
    res.status(200).json({ message: 'Template updated successfully' });
  } catch (err) {
    console.error('Error updating template:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete template
router.delete('/delete-template/:template_name', async (req, res) => {
  try {
    const { template_name } = req.params;
    const { region } = req.query;

    const ses_client = create_ses_client(region);
    const command = new DeleteTemplateCommand({ TemplateName: template_name });
    await ses_client.send(command);
    
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (err) {
    console.error('Error deleting template:', err);
    res.status(500).json({ error: err.message });
  }
});

// Send template email
router.post('/send-template', async (req, res) => {
  try {
    const { template_name, source, template_data, to_address, region } = req.body;

    const ses_client = create_ses_client(region);
    const command = new SendTemplatedEmailCommand({
      Destination: {
        ToAddresses: [to_address]
      },
      Source: source,
      Template: template_name,
      TemplateData: template_data
    });

    const data = await ses_client.send(command);
    res.status(200).json({ message: 'Email sent successfully', message_id: data.MessageId });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
