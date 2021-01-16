$(document).ready(() => {
  if (!localStorage.getItem('region')) {
    localStorage.setItem('region', 'us-east-1');  //default region if none set
  } else {
    $('#regionSelector').val(localStorage.getItem('region')); //always ensure the select region dropdown matches localstorage region
  }

  // apply region select listener
  $('#regionSelector').change(function () {
    const regionName = $(this).val(); //get changed to selection
    localStorage.setItem('region', regionName);
    window.location.reload();
  });

  // get templates and build table
  $.get(`/list-templates?region=${localStorage.getItem('region')}`, function (data) {
    const templatesArr = data.items.TemplatesMetadata;

    if (templatesArr.length === 0) {
      $('#noTemplatesPlaceholder').fadeIn();
      return; //no need to continue
    }

    //Build table
    let tableContent = ``;
    for (let template of templatesArr) {

      // change the UTC 'created timestamp' string for better readability
      const createdDate = template.CreatedTimestamp.slice(0, 10);
      const createdTime = template.CreatedTimestamp.slice(11, 19);
      const dateTimeString = `${createdDate} ${createdTime}`;

      tableContent += `
          <tr>
            <td scope="row">${template.Name}</td>
            <td>${dateTimeString}</td>
            <td class="text-right">
            
            <a href="/update-template?name=${template.Name}" class="mr-2" data-toggle="tooltip" data-placement="top" title="Edit / view template">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
              </svg>
            </a>
            
            <a href="javascript:;" onclick="triggerDeleteConfimationModal('${template.Name}')" class="text-danger" data-toggle="tooltip" data-placement="top" title="Delete template">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
              </svg>
            </a>
            
            <div class="dropdown d-inline-block mx-2">
              <a id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-three-dots" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
              </a>
              <div class="dropdown-menu" aria-labelledby="dLabel">
                <a class="dropdown-item" type="button" href="javascript:;" onclick="triggerDuplicateAsModal('${template.Name}')">
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-front" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm5 10v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2v5a2 2 0 0 1-2 2H5z"/>
                  </svg>
                  Duplicate
                </a>
                <a class="dropdown-item" type="button" href="javascript:;" onclick="triggerSendTestEmailModal('${template.Name}')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply-fill" viewBox="0 3 16 16">
                    <path d="M9.079 11.9l4.568-3.281a.719.719 0 0 0 0-1.238L9.079 4.1A.716.716 0 0 0 8 4.719V6c-1.5 0-6 0-7 8 2.5-4.5 7-4 7-4v1.281c0 .56.606.898 1.079.62z"/>
                  </svg>
                  Send test email
                </a>
              </div>
            </div>
            </td>
          </tr>`;
    }

    $('#templateListTable tbody').append(tableContent);
    $('#templateListTable').show();
    $('[data-toggle="tooltip"]').tooltip();
  }).fail(function (response) {
    $('#credentialsErrorModal .modal-body').append(`<p><strong>${response.responseJSON.code}</strong> <br> ${response.responseJSON.message} </p>`);
    $('#credentialsErrorModal').modal();
  });

});

function deleteTemplate(templateName) {
  //Upon modal confirmation, make the delete template API call
  $.ajax({
    url: `/delete-template/${templateName}?region=${localStorage.getItem('region')}`,
    type: 'DELETE',
    success: function (result) {
      // Do something with the result
      window.location.reload();
    }
  });
}

// Email sending
function triggerSendTestEmailModal(templateName) {
  $('#sendTestEmailModal #sendEmailCta').attr('data-action-name', templateName);  // set the template name for later reference if form gets submitted
  $('#sendTestEmailModal #templateName').text(templateName);  // set the template name for the sub title
  $('#sendTestEmailModal #loadingTemplateText').show(); // set loading content back to original status

  $('#sendTestEmailModal #loadingTemplateText').show(); // reset modal to initial state
  $('#sendTestEmailModal #dynamicFieldsContainer').html(''); // reset modal to initial state
  $('#sendTestEmailModal #errorOutput').addClass('d-none'); // reset modal to initial state
  $('#sendTestEmailModal #confirmationText').hide();  // reset modal to initial state

  $.get(`/get-template/${templateName}?region=${localStorage.getItem('region')}`, function (response) { // get the templates to display dynamic fields
    const dynamicFieldsArr = response.data.dynamicFields;
    if (dynamicFieldsArr.length > 0) {
      $('#sendTestEmailModal #dynamicFieldsContainer').append(` 
        <div class="my-3">
          <p class="m-0">Template replacement tags</p>
          <small>Specify any of your ${dynamicFieldsArr.length} implemented replacement tag values here:</small>
        </div>
      `);

      for (const dynamicFieldItem of dynamicFieldsArr) {
        // per each replacement tag, show an input row
        $('#sendTestEmailModal #dynamicFieldsContainer').append(`
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">${dynamicFieldItem}</label>
            <div class="col-sm-9">
              <input type="text" class="form-control dynamicField" name="${dynamicFieldItem}" placeholder="value">
            </div>
          </div>
        `);
      }
    } else {
      $('#sendTestEmailModal #dynamicFieldsContainer').html('<div class="text-center text-muted">No replacement tag fields to display</div>');
    }

    $('#sendTestEmailModal #dynamicFieldsContainer').removeClass('d-none'); // display the dynamic fields now that they are loaded into the dom
    $('#sendTestEmailModal #loadingTemplateText').hide(); // reset modal to initial state
  });

  // build dynamic form based on mustache templates
  $('#sendTestEmailModal').modal();
}

function sendEmailSubmission(e, form){
  // called inline onsubmit from modal form
  e.preventDefault();

  const source = form.querySelector('input#sourceAddress').value;
  const toAddress = form.querySelector('input#toAddress').value;
  const templateName = e.submitter.attributes['data-action-name'].value;

  $('#sendTestEmailModal #sendEmailCta').attr('disabled', true);  // dont allow user to rage click the button if network is slow

  const dynamicFieldsEl = form.querySelectorAll('input.dynamicField');
  const dynamicFieldPayload = {};

  if(dynamicFieldsEl.length > 0) {
    // take into consideration dynamic fields in the payload
    dynamicFieldsEl.forEach((el) => {
      dynamicFieldPayload[el.name] = el.value;
    });
  }

  $.post(`/send-template`, { templateName, source, templateData: JSON.stringify(dynamicFieldPayload), toAddress, region: localStorage.getItem('region')}, (response) => {
    // show confirmation content
    $('#sendTestEmailModal #errorOutput').addClass('d-none');
    $('#sendTestEmailModal #confirmationText #sentTime').html(new Date());
    $('#sendTestEmailModal #confirmationText').fadeIn();

    window.setTimeout(() => {
      $('#sendTestEmailModal #confirmationText').fadeOut(200);
    },8000);
  }).fail((err) => {
    console.log(err);
    let errorMessage = 'Error, please check console';
    if(err.responseJSON && err.responseJSON.message) {
      errorMessage = err.responseJSON.message;  // specific error message back from AWS
    }
    $('#sendTestEmailModal #errorOutput').text(errorMessage).removeClass('d-none');
  }).always(() => {
    $('#sendTestEmailModal #sendEmailCta').removeAttr('disabled'); // re-enable the send button again for future submissions
  });
}

// template deleting
function triggerDeleteConfimationModal(templateName) {
  $('#deleteConfirmationModal #templateName').text(templateName);
  $('#deleteConfirmationModal #deleteTemplateCta').attr('data-action-name', templateName);
  $('#deleteConfirmationModal').modal();
}

// template duplicating
function triggerDuplicateAsModal(existingTemplateName) {
  $('#duplicateTemplateCta').attr('data-existing-template-name', existingTemplateName);
  $('#template-name').text(existingTemplateName); //the existing template name
  $('#duplicateAsModal').modal();
}

function duplicateCtaAction(existingTemplateName) {
  // we need to build the link and redirect to the create template page
  const newTemplateName = $('#newTemplateName').val();
  window.location.href = `/create-template?d-origin=${existingTemplateName}&d-name=${newTemplateName}`;
}
