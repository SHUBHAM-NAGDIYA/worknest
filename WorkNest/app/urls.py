from django.urls import path
from app import views

urlpatterns = [
    path('api/test/', views.test_api),

    #path('owner/registration/', views.owner_view, name='owner_view'),
    path('user/', views.register_view, name = 'register_view'),
    #path('user/', views.owner_view, name='owner_view'),
    path('login/', views.login_view, name='login_view'),
    path('owner/profile/', views.owner_profile, name='owner_profile'),

    path('admin/create/', views.admin_view, name='admin_view'),
    #path('admin/login/', views.admin_login_view, name='admin_login_view'),
    path('admin/profile/', views.admin_profile, name='admin_profile'),

    path('member/create/', views.member_view, name='member_view'),
    #path('member/login/', views.member_login_view, name='member_login_view'),
    path('member/profile/', views.member_profile, name='member_profile'),

    path('logout/', views.logout_view, name='logout'),

    path('add_team_member/', views.add_team_member_view, name='add_team_member'),
    path('create_team/', views.create_team_view, name='create_team'),
    path('projects/', views.create_project_view, name='create_project'),
    path('create_task/', views.create_task_view, name= 'create_task'),

    path('update_taask_status/', views.update_task_status_view, name='update_task_status'),
    path('list_project/', views.list_projects_view, name='list_project'),
    path('list_task/', views.list_tasks_view, name='list_task'),
    path('delete_task/',views.delete_task_view, name='delete_task'),


]
