$(document).ready(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const templateName = urlParams.get('name');

  if (!templateName) {
    window.location.href = '/'; //something went wrong
  }

  $.get(`/get-template/${templateName}?region=${localStorage.getItem('region')}`, function (response) {
    $('#templateName').val(response.data.TemplateName);
    $('#templateSubject').val(response.data.SubjectPart);
    $('#templateText').val(response.data.TextPart);
    $('#templateHtml').val(response.data.HtmlPart);
    $('#updateTemplateForm').removeClass('d-none'); //show the form only when we have pre-populated all inputs
  });

  $('#updateTemplateForm').change(() => {
    $('#updateTemplateForm button').attr('disabled', false);
  });


  $('#updateTemplateForm').submit(function(e){
    e.preventDefault();
    const putPayload = {
      "TemplateName": $('#templateName').val(),
      "HtmlPart": $('#templateHtml').val(),
      "SubjectPart": $('#templateSubject').val(),
      "TextPart": $('#templateText').val(),
      "region": localStorage.getItem('region')
    };

    $.ajax({
      url: `/update-template`,
      type: 'PUT',
      data: putPayload,
      success: function() {
        window.location.href = '/';
      },
      error: function(xhr) {
        let content;
        if (xhr.responseJSON.message) {
          content = xhr.responseJSON.message;
        } else {
          content = "Error updating template. Please try again";
        }
        $('#errContainer').html(content).removeClass('d-none');
      }
    });
  });

  checkAppVersion();
});

