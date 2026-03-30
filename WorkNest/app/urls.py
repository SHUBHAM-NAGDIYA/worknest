from django.urls import path
from app import views

urlpatterns = [
    path('api/test/', views.test_api),
    path('user/', views.register_view, name = 'register_view'),
    path('login/', views.login_view, name='login_view'),
    path('logout/', views.logout_view, name='logout'),

    path('owner/dashboard/', views.owner_dashboard_view, name='owner_dashboard'),
    path('ad/profile/', views.admin_profile, name='admin_profile'),
    path('member/profile/', views.member_profile, name='member_profile'),

    path('add_team_member/', views.add_team_member_view, name='add_team_member'),
    path('create_team/', views.create_team_view, name='create_team'),
    path('create_project/', views.create_project_view, name='create_project'),
    path('create_task/', views.create_task_view, name= 'create_task'),

    path('update_task_status/', views.update_task_status_view, name='update_task_status'),
    path('list_project/', views.list_projects_view, name='list_project'),
    path('list_task/', views.list_tasks_view, name='list_task'),
    path('delete_task/',views.delete_task_view, name='delete_task'),

    path('pricing/', views.pricing, name='pricing'),
    path('subscription_status_view/', views.subscription_status_view, name = 'subscription_status_view'),
    path('updateSubscription/', views. update_subscription_view, name = 'update_subscription_view'),
   
    path('teams/', views.team_view, name= 'team_view'),
    path('projects/', views.project_view, name= 'project_view'),
    path('tasks/', views.task_view, name= 'task_view'),
    path('assign-project/', views.assign_project_view, name='assign_project_view'),
 

    path('list-members-view/', views.list_members_view, name='list_members_view'),

  
]
