# Create your views here.
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout as auth_logout
from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.paginator import Paginator
from django.core.exceptions import PermissionDenied
from .accounts.decorators import role_required
from .models import Organization, User, Team, Project
from .accounts.services.user_service import create_owner, create_admin, create_member
from .accounts.services.team import add_member_to_team,  create_team
from .accounts.services.projects import create_project, list_projects
from .accounts.services.task import create_task, update_task_status, list_tasks, delete_task
from django.views.decorators.csrf import csrf_exempt
import json

from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def test_api(request):
    return Response({"message": "Backend connected successfully"})


@csrf_exempt
def register_view(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method",
            "data": None
        }, status=405)

    try:
        data = json.loads(request.body)
        role = data.get("role")

        if role == "OWNER":

            user = create_owner(data)

            return JsonResponse({
                "success": True,
                "message": "Owner registered successfully",
                "data": {
                    "username": user.username,
                    "role": user.role
                }
            }, status=201)

        elif role == "ADMIN":

            if request.user.role != "OWNER":
                return JsonResponse({
                    "success": False,
                    "message": "Only owner can create admin",
                    "data": None
                }, status=403)

            organization = request.user.organization
            user = create_admin(data, organization)

            return JsonResponse({
                "success": True,
                "message": "Admin created successfully",
                "data": {
                    "username": user.username,
                    "role": user.role,
                    "organization": organization.name
                }
            }, status=201)

        elif role == "MEMBER":

            if request.user.role not in ["OWNER", "ADMIN"]:
                return JsonResponse({
                    "success": False,
                    "message": "Permission denied",
                    "data": None
                }, status=403)

            organization = request.user.organization
            user = create_member(data, organization)

            return JsonResponse({
                "success": True,
                "message": "Member created successfully",
                "data": {
                    "username": user.username,
                    "role": user.role,
                    "organization": organization.name
                }
            }, status=201)

        else:
            return JsonResponse({
                "success": False,
                "message": "Invalid role",
                "data": None
            }, status=400)

    except ValueError as e:
        return JsonResponse({
            "success": False,
            "message": str(e),
            "data": None
        }, status=400)

    except Exception:
        return JsonResponse({
            "success": False,
            "message": "Internal server error",
            "data": None
        }, status=500)
    

@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method",
            "data": None
        }, status=405)

    try:
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")
        role = data.get("role")

        if not username or not password:
            return JsonResponse({
                "success": False,
                "message": "Username and password are required",
                "data": None
            }, status=400)

        user = authenticate(request, username=username, password=password)

        if user is None:
            return JsonResponse({
                "success": False,
                "message": "Invalid credentials",
                "data": None
            }, status=401)

        if role and user.role != role:
            return JsonResponse({
                "success": False,
                "message": f"Access denied: Not a {role.lower()} account",
                "data": None
            }, status=403)

        login(request, user)

        return JsonResponse({
            "success": True,
            "message": "Login successful",
            "data": {
                "username": user.username,
                "role": user.role,
                "organization": user.organization.name if user.organization else None
            }
        }, status=200)

    except Exception:
        return JsonResponse({
            "success": False,
            "message": "Internal server error",
            "data": None
        }, status=500)
    
'''
#@role_required('OWNER')
def owner_login_view(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method",
            "data": None
        }, status=405)

    username = request.POST.get("username")
    password = request.POST.get("password")

    if not username or not password:
        return JsonResponse({
            "success": False,
            "message": "Username and password are required",
            "data": None
        }, status=400)

    owner = authenticate(request, username=username, password=password)

    if owner is None:
        return JsonResponse({
            "success": False,
            "message": "Invalid credentials",
            "data": None
        }, status=401)

    if owner.role != "OWNER":
        return JsonResponse({
            "success": False,
            "message": "Access denied: Not an owner account",
            "data": None
        }, status=403)

    login(request, owner)

    return JsonResponse({
        "success": True,
        "message": "Owner login successful",
        "data": {
            "username": owner.username,
            "role": owner.role,
            "organization": owner.organization.name if owner.organization else None
        }
    }, status=200)    

#@role_required('ADMIN')
def admin_login_view(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method",
            "data": None
        }, status=405)

    username = request.POST.get("username")
    password = request.POST.get("password")

    if not username or not password:
        return JsonResponse({
            "success": False,
            "message": "Username and password are required",
            "data": None
        }, status=400)

    admin = authenticate(request, username=username, password=password)

    if admin is None:
        return JsonResponse({
            "success": False,
            "message": "Invalid credentials",
            "data": None
        }, status=401)

    if admin.role != "ADMIN":
        return JsonResponse({
            "success": False,
            "message": "Access denied: Not an admin account",
            "data": None
        }, status=403)

    login(request, admin)

    return JsonResponse({
        "success": True,
        "message": "Admin login successful",
        "data": {
            "username": admin.username,
            "role": admin.role,
            "organization": admin.organization.name if admin.organization else None
        }
    }, status=200)@role_required('MEMBER')      

def member_login_view(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method",
            "data": None
        }, status=405)

    username = request.POST.get("username")
    password = request.POST.get("password")

    if not username or not password:
        return JsonResponse({
            "success": False,
            "message": "Username and password are required",
            "data": None
        }, status=400)

    member = authenticate(request, username=username, password=password)

    if member is None:
        return JsonResponse({
            "success": False,
            "message": "Invalid credentials",
            "data": None
        }, status=401)

    if member.role != "MEMBER":
        return JsonResponse({
            "success": False,
            "message": "Access denied: Not a member account",
            "data": None
        }, status=403)

    login(request, member)

    return JsonResponse({
        "success": True,
        "message": "Member login successful",
        "data": {
            "username": member.username,
            "role": member.role,
            "organization": member.organization.name if member.organization else None
        }
    }, status=200)

'''
def logout_view(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method",
            "data": None
        }, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({
            "success": False,
            "message": "User is not logged in",
            "data": None
        }, status=401)

    auth_logout(request)

    return JsonResponse({
        "success": True,
        "message": "Logout successful",
        "data": None
    }, status=200)

@csrf_exempt
@role_required("OWNER")
def owner_profile(request):
    user = request.user

    data = {
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "organization": user.organization.name if user.organization else None
    }

    return JsonResponse({
        "success": True,
        "message": "Owner profile fetched successfully",
        "data": data
    }, status=200)


@role_required("ADMIN")
@csrf_exempt
def admin_profile(request):

    user = request.user

    data = {
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "organization": user.organization.name if user.organization else None
    }

    return JsonResponse({
        "success": True,
        "message": "Admin profile fetched successfully",
        "data": data
    }, status=200)@role_required('MEMBER')


#@role_required("MEMBER")
def member_profile(request):

    user = request.user

    data = {
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "organization": user.organization.name if user.organization else None
    }

    return JsonResponse({
        "success": True,
        "message": "Member profile fetched successfully",
        "data": data
    }, status=200)


#@role_required("OWNER", "ADMIN")
def add_team_member_view(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        }, status=405)

    try:
        username = request.POST.get("username")
        team_id = request.POST.get("team_id")

        membership = add_member_to_team(
            username,
            team_id,
            request.user
        )

        return JsonResponse({
            "success": True,
            "message": "Member added successfully",
            "data": {
                "member": membership.member.username,
                "team": membership.team.name,
                "added_by": membership.added_by.username
            }
        }, status=201)

    except ValueError as e:
        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=400)
 

#@role_required("OWNER", "ADMIN")
def create_team_view(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        }, status=405)

    try:
        name = request.POST.get("name")

        team = create_team(
            name=name,
            organization=request.user.organization,
            created_by=request.user
        )

        return JsonResponse({
            "success": True,
            "message": "Team created successfully",
            "data": {
                "team_id": team.id,
                "team_name": team.name,
                "organization": team.organization.name,
                "created_by": team.created_by.username
            }
        }, status=201)

    except ValueError as e:
        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=400)

@csrf_exempt
#@role_required("OWNER", "ADMIN")
def create_project_view(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        }, status=405)

    try:
        data = json.loads(request.body)
        
        name = data.get("name")
        team_id = data.get("team_id")
        deadline = data.get("deadline")
        print(name)
        print(team_id)
        project = create_project(
            name,
            team_id,
            request.user,
            deadline
        )
        

        return JsonResponse({
            "success": True,
            "message": "Project created successfully",
            "data": {
                "project_id": project.id,
                "project_name": project.name,
                "team": project.team.name,
                "organization": project.organization.name,
                "created_by": project.created_by.username,
                "deadline": project.deadline
            }
        }, status=201)

    except ValueError as e:
        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=400)


#@role_required("OWNER", "ADMIN")
def create_task_view(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        }, status=405)

    try:

        title = request.POST.get("title")
        project_id = request.POST.get("project_id")
        assigned_username = request.POST.get("assigned_to")
        deadline = request.POST.get("deadline")

        task = create_task(
            title,
            project_id,
            assigned_username,
            request.user,
            deadline
        )

        return JsonResponse({
            "success": True,
            "message": "Task created successfully",
            "data": {
                "task_id": task.id,
                "title": task.title,
                "project": task.project.name,
                "assigned_to": task.assigned_to.username if task.assigned_to else None,
                "created_by": task.created_by.username,
                "deadline": task.deadline,
                "status": task.status
            }
        }, status=201)

    except ValueError as e:
        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=400)
    

#@role_required("OWNER", "ADMIN", "MEMBER")
def update_task_status_view(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        }, status=405)

    try:

        task_id = request.POST.get("task_id")
        status = request.POST.get("status")

        task = update_task_status(
            task_id,
            status,
            request.user
        )

        return JsonResponse({
            "success": True,
            "message": "Task status updated successfully",
            "data": {
                "task_id": task.id,
                "title": task.title,
                "status": task.status,
                "updated_by": request.user.username
            }
        }, status=200)

    except ValueError as e:
        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=400)


#@role_required("OWNER", "ADMIN", "MEMBER")
def list_projects_view(request):

    if request.method != "GET":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        }, status=405)

    try:

        page = int(request.GET.get("page", 1))
        limit = int(request.GET.get("limit", 10))

        result = list_projects(
            request.user,
            page,
            limit
        )

        return JsonResponse({
            "success": True,
            "message": "Projects fetched successfully",
            "data": result
        }, status=200)

    except ValueError as e:
        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=400)

    except Exception:
        return JsonResponse({
            "success": False,
            "message": "Internal server error"
        }, status=500)
    

#@role_required("OWNER", "ADMIN", "MEMBER")
def list_tasks_view(request, project_id):

    if request.method != "GET":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        }, status=405)

    try:

        page = int(request.GET.get("page", 1))
        limit = int(request.GET.get("limit", 10))

        tasks = list_tasks(project_id, request.user)

        paginator = Paginator(tasks, limit)
        page_obj = paginator.get_page(page)

        tasks_data = []

        for task in page_obj:
            tasks_data.append({
                "id": task.id,
                "title": task.title,
                "status": task.status,
                "assigned_to": task.assigned_to.username if task.assigned_to else None,
                "deadline": task.deadline,
                "created_at": task.created_at
            })

        return JsonResponse({
            "success": True,
            "message": "Tasks fetched successfully",
            "data": {
                "tasks": tasks_data,
                "page": page,
                "limit": limit,
                "total_pages": paginator.num_pages
            }
        }, status=200)

    except ValueError as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=400)

    except Exception:

        return JsonResponse({
            "success": False,
            "message": "Internal server error"
        }, status=500)


#@role_required("OWNER", "ADMIN")
def delete_task_view(request, task_id):
    try:
        delete_task(task_id, request.user)
        messages.success(request, "Task deleted successfully")

    except ValueError as e:
        messages.error(request, str(e))

    return redirect(request.META.get("HTTP_REFERER", "landing"))









@role_required("OWNER")
def admin_view(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method",
            "data": None
        }, status=405)

    try:
        organization = request.user.organization

        admin = create_admin(request.POST, organization)

        return JsonResponse({
            "success": True,
            "message": "Admin created successfully",
            "data": {
                "username": admin.username,
                "role": admin.role,
                "organization": organization.name
            }
        }, status=201)

    except ValueError as e:
        return JsonResponse({
            "success": False,
            "message": str(e),
            "data": None
        }, status=400)

    except Exception:
        return JsonResponse({
            "success": False,
            "message": "Internal server error",
            "data": None
        }, status=500)

@role_required("OWNER", "ADMIN")
def member_view(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method",
            "data": None
        }, status=405)

    try:
        organization = request.user.organization

        member = create_member(request.POST, organization)

        return JsonResponse({
            "success": True,
            "message": "Member created successfully",
            "data": {
                "username": member.username,
                "role": member.role,
                "organization": organization.name
            }
        }, status=201)

    except ValueError as e:
        return JsonResponse({
            "success": False,
            "message": str(e),
            "data": None
        }, status=400)

    except Exception:
        return JsonResponse({
            "success": False,
            "message": "Internal server error",
            "data": None
        }, status=500)
    
