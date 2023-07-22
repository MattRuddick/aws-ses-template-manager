const parseContent = (content) => {
  if (!content) return "";
  // Parse unicode escaped characters
  return decodeURIComponent(
    JSON.parse(`"${content.replace(/"/g, '\\"').replace(/(?:\r\n|\r|\n)/g, '\\n')}"`)
  );
};

$(document).ready(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const templateName = urlParams.get('name');

  if (!templateName) {
    window.location.href = '/'; //something went wrong
  }

  window.codeMirrorEditor = window.CodeMirror.fromTextArea(document.querySelector('#codeMirror'), {
    mode: "htmlmixed",
    lineNumbers: true
  });

  $.get(`/get-template/${templateName}?region=${localStorage.getItem('region')}`, function (response) {
    $('#templateName').val(response.data.TemplateName);
    const subjectParsed = parseContent(response.data.SubjectPart);
    $('#templateSubject').val(subjectParsed);
    const textParsed = parseContent(response.data.TextPart);
    $('#templateText').val(textParsed);

    const htmlParsed = parseContent(response.data.HtmlPart);
    window.codeMirrorEditor.setValue(htmlParsed);

    $('#updateTemplateForm').removeClass('d-none'); //show the form only when we have pre-populated all inputs
    window.codeMirrorEditor.refresh();  //must be called to re draw the code editor
  });

  $('#updateTemplateForm').on('input', () => {
    $('#updateTemplateForm button').attr('disabled', false);
  });


  $('#updateTemplateForm').submit(function (e) {
    e.preventDefault();
    const putPayload = {
      "TemplateName": $('#templateName').val(),
      "HtmlPart": window.codeMirrorEditor.getValue(),
      "SubjectPart": $('#templateSubject').val(),
      "TextPart": $('#templateText').val(),
      "region": localStorage.getItem('region')
    };

    $.ajax({
      url: `/update-template`,
      type: 'PUT',
      data: putPayload,
      success: function () {
        window.location.href = '/';
      },
      error: function (xhr) {
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

});

