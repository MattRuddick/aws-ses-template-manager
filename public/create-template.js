$(document).ready(function(){
  $('#createTemplateForm').change(() => {
    $('#createTemplateForm button').attr('disabled', false);
  });

  $('#createTemplateForm').submit(function(e) {
    e.preventDefault();
    const createPayload = {
      "TemplateName": $('#templateName').val(),
      "HtmlPart": $('#templateHtml').val(),
      "SubjectPart": $('#templateSubject').val(),
      "TextPart": $('#templateText').val(),
      "region": localStorage.getItem('region')
    };

    $.ajax({
      type: "POST",
      url: "/create-template",
      data: createPayload,
      success: function() {
        window.location.href = '/';
      },
      error: function(xhr) {
        let content;
        if (xhr.responseJSON.message) {
          content = xhr.responseJSON.message;
        } else {
          content = "Error saving template. Please try again";
        }
        $('#errContainer').html(content).removeClass('d-none');
      }
    });
  });
});
