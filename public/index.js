$(document).ready(() => {
  if(!localStorage.getItem('region')){
    localStorage.setItem('region', 'us-east-1');  //default region if none set
  } else {
    $('#regionSelector').val(localStorage.getItem('region')); //always ensure the select region dropdown matches localstorage region
  }

  //apply region select listener
  $('#regionSelector').change(function(){
    const regionName = $(this).val(); //get changed to selection
    localStorage.setItem('region', regionName);
    window.location.reload();
  });

  //get templates and build table
  $.get(`/list-templates?region=${localStorage.getItem('region')}`, function (data) {
    const templatesArr = data.items.TemplatesMetadata;

    if (templatesArr.length === 0) {
      $('#noTemplatesPlaceholder').fadeIn();
      return; //no need to continue
    }

    //Build table
    let tableContent = ``;
    for (let template of templatesArr) {
      tableContent += `
          <tr>
            <td scope="row">${template.Name}</td>
            <td>${template.CreatedTimestamp}</td>
            <td class="text-right">
            
            <a href="/update-template?name=${template.Name}" class="mr-2">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
              </svg>
            </a>
            
            <a href="javascript:;" onclick="triggerDeleteConfimationModal('${template.Name}')" class="text-danger">
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
              </div>
            </div>
            </td>
          </tr>`;
    }

    $('#templateListTable tbody').append(tableContent);
    $('#templateListTable').show();
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
    success: function(result) {
      // Do something with the result
      window.location.reload();
    }
  });
}

function triggerDeleteConfimationModal(templateName) {
  $('#deleteTemplateCta').attr('data-action-name', templateName);
  $('#deleteConfirmationModal').modal();
}

function triggerDuplicateAsModal(templateName) {
  $('#duplicateTemplateCta').attr('data-action-name', templateName);
  $('#template-name').text(templateName);
  $('#duplicateAsModal').modal();
}

function duplicateCtaAction(existingTemplateName) {
  //we need to build the link and redirect to the create template page
  const newTemplateName = $('#newTemplateName').val();
  window.location.href = `/create-template?d-origin=${existingTemplateName}&d-name=${newTemplateName}`;
}
