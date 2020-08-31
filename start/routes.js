'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', ({ view }) => {
  return view.render('index')
});


Route.get('list-templates', 'SesTemplateController.listTemplates');
Route.post('create-template', 'SesTemplateController.createTemplate');
Route.put('update-template', 'SesTemplateController.updateTemplate');
Route.delete('delete-template', 'SesTemplateController.deleteTemplate');
