$(document).ready(function(){
  $('#createTemplateForm').submit(function(e) {
    e.preventDefault();
    const createPayload = {
      "TemplateName": $('#templateName').val(),
      "HtmlPart": $('#templateHtml').val(),
      "SubjectPart": $('#templateSubject').val(),
      "TextPart": $('#templateText').val()
    };

    $.ajax({
      type: "POST",
      url: "/create-template",
      data: createPayload,
      dataType: 'application/json',
      success: function() {
        window.location.href = '/';
      }
    });
  });
});

