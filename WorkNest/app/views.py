# Create your views here.
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout as auth_logout
from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.paginator import Paginator
from django.core.exceptions import PermissionDenied
from .accounts.decorators import role_required
from .models import Organization, User, Team, Task, Project, SubscriptionPlan
from .accounts.services.user_service import create_owner, create_admin, create_member
from .accounts.services.team import add_member_to_team,  create_team
from .accounts.services.projects import create_project, list_projects
from .accounts.services.task import create_task, update_task_status, list_tasks, delete_task
from django.views.decorators.csrf import csrf_exempt
from .models import SubscriptionPlan
from django.utils import timezone
from datetime import timedelta, datetime
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

    # ✅ Safe JSON parsing
    try:
        body = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({
            "success": False,
            "message": "Invalid JSON format",
            "data": None
        }, status=400)

    role = body.get("role")

    if not role:
        return JsonResponse({
            "success": False,
            "message": "Role is required",
            "data": None
        }, status=400)

    try:
        # ================= OWNER =================
        if role == "OWNER":

            user = create_owner(body)

            return JsonResponse({
                "success": True,
                "message": "Owner registered successfully",
                "data": {
                    "username": user.username,
                    "role": user.role
                }
            }, status=201)

        # ================= ADMIN =================
        elif role == "ADMIN":

            if not request.user.is_authenticated or request.user.role != "OWNER":
                return JsonResponse({
                    "success": False,
                    "message": "Only owner can create admin",
                    "data": None
                }, status=403)

            organization = request.user.organization

            user = create_admin(body, organization)

            return JsonResponse({
                "success": True,
                "message": "Admin created successfully",
                "data": {
                    "username": user.username,
                    "role": user.role,
                    "organization": organization.name
                }
            }, status=201)

        # ================= MEMBER =================
        elif role == "MEMBER":

            if not request.user.is_authenticated or request.user.role not in ["OWNER", "ADMIN"]:
                return JsonResponse({
                    "success": False,
                    "message": "Permission denied",
                    "data": None
                }, status=403)

            organization = request.user.organization

            print(body)
            print(request.user.organization)
            user = create_member(body, organization)
            

            return JsonResponse({
                "success": True,
                "message": "Member created successfully",
                "data": {
                    "username": user.username,
                    "role": user.role,
                    "organization": organization.name
                }
            }, status=201)

        # ================= INVALID ROLE =================
        else:
            return JsonResponse({
                "success": False,
                "message": "Invalid role",
                "data": None
            }, status=400)

    # ✅ Business validation errors
    except ValueError as e:
        return JsonResponse({
            "success": False,
            "message": str(e),
            "data": None
        }, status=400)

    # ✅ Unexpected errors
    except Exception as e:
        print("REGISTER ERROR:", str(e))  # Debug log
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

@csrf_exempt
@role_required("OWNER")
def owner_dashboard_view(request):

    org = request.user.organization

    if not org:
        return JsonResponse({
            "success": False,
            "message": "No organization found"
        }, status=400)

    return JsonResponse({
        "success": True,
        "data": {
            "organization": {
                "name": org.name,
                "subscription_plan": org.subscription_plan.name if org.subscription_plan else "No Plan",
                "is_subscription_active": org.is_subscription_active(),
                "expires_at": org.subscription_expires_at
            },
            "usage": {
                "active_users": org.usage.active_users if hasattr(org, "usage") else 0,
                "total_teams": org.usage.total_teams if hasattr(org, "usage") else 0,
                "total_projects": org.usage.total_projects if hasattr(org, "usage") else 0,
            }
        }
    })


@csrf_exempt
@role_required("ADMIN")
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
    }, status=200)

@csrf_exempt
@role_required("MEMBER")
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
@csrf_exempt
@role_required("OWNER", "ADMIN")
def add_team_member_view(request):

    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Invalid request"}, status=405)

    try:
        data = json.loads(request.body)

        username = data.get("username")
        team_id = data.get("team_id")

        membership = add_member_to_team(
            username,
            team_id,
            request.user
        )

        return JsonResponse({
            "success": True,
            "message": "Member added successfully"
        })

    except ValueError as e:
        return JsonResponse({"success": False, "message": str(e)}, status=400)


@csrf_exempt
@role_required("OWNER", "ADMIN")
def create_team_view(request):
    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        }, status=405)

    if request.content_type != "application/json":
        return JsonResponse({
            "success": False,
            "message": "Content-Type must be application/json"
        }, status=400)

    try:
        body = json.loads(request.body or "{}")
        name = body.get("name")

        if not name:
            raise ValueError("Team name is required")

        # Validate organization
        if not hasattr(request.user, "organization") or not request.user.organization:
            return JsonResponse({
                "success": False,
                "message": "User is not associated with any organization"
            }, status=400)

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

    except Exception:
        return JsonResponse({
            "success": False,
            "message": "Something went wrong"
        }, status=500)


@csrf_exempt
@role_required("OWNER", "ADMIN")
def create_project_view(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        }, status=405)

    try:
        # 🔹 Parse JSON safely
        try:
            data = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({
                "success": False,
                "message": "Invalid JSON format"
            }, status=400)

        name = data.get("name")
        team_id = data.get("team_id")
        deadline_str = data.get("deadline")

        # 🔹 Basic validation
        if not name:
            raise ValueError("Project name is required")

        if not team_id:
            raise ValueError("Team ID is required")

        # 🔹 Parse deadline
        deadline = None
        if deadline_str:
            try:
                deadline = datetime.strptime(deadline_str, "%Y-%m-%d").date()
            except ValueError:
                raise ValueError("Invalid date format (YYYY-MM-DD expected)")

        # 🔹 Call service
        project = create_project(
            name=name.strip(),
            team_id=team_id,
            created_by=request.user,
            deadline=deadline
        )

        # 🔹 Success response
        return JsonResponse({
            "success": True,
            "message": "Project created successfully",
            "data": {
                "project_id": project.id,
                "project_name": project.name,
                "team": project.team.name,
                "organization": project.organization.name,
                "created_by": project.created_by.username,
                "deadline": project.deadline.strftime("%Y-%m-%d") if project.deadline else None
            }
        }, status=201)

    except ValueError as e:
        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=400)

    except Exception as e:
        import traceback
        traceback.print_exc()  # 🔥 helpful during debugging

        return JsonResponse({
            "success": False,
            "message": "Something went wrong",
            "error": str(e)
        }, status=500)


@csrf_exempt
@role_required("OWNER", "ADMIN")
def create_task_view(request):

    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Invalid request"}, status=405)

    try:
        data = json.loads(request.body)

        title = data.get("title")
        project_id = data.get("project_id")
        assigned_username = data.get("assigned_to")
        deadline = data.get("deadline")

        if not title or not project_id:
            raise ValueError("Title and project required")

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
                "title": task.title
            }
        })

    except ValueError as e:
        return JsonResponse({"success": False, "message": str(e)}, status=400)
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

def UpdatePlan(request):
    if request.method == 'POST':
        data = {
             
        }
        plan = SubscriptionPlan.objects(
            name =  request.name,
            price = request.price,
            max_users =  request.max_user,
            max_projects = request.max_projects,
            max_teams = request.max_teams,
            features = request.features 

        )
        render
        
def manage_subscription(requet):
    if requet.Post.method == 'POST':
        subscription = requet.SubscriptionPlan
        data = {
            "name": subscription.name,
            "price": subscription.price,
        }
        
@csrf_exempt
def pricing(request):
    plans = SubscriptionPlan.objects.all()

    data = []
    for plan in plans:
        data.append({
            "id": plan.id,          # ✅ IMPORTANT (added)
            "name": plan.name,
            "price": plan.price,
        })

    return JsonResponse({
        "success": True,
        "data": data
    })

@role_required("OWNER")
def subscription_status_view(request):

    org = request.user.organization

    if not org:
        return JsonResponse({
            "success": False,
            "message": "No organization found"
        }, status=400)

    return JsonResponse({
        "success": True,
        "data": {
            "plan": org.subscription_plan.name if org.subscription_plan else None,
            "price": str(org.subscription_plan.price) if org.subscription_plan else None,
            "started_at": org.subscription_started_at,
            "expires_at": org.subscription_expires_at,
            "is_active": org.is_subscription_active()
        }
    })

@csrf_exempt
@role_required("OWNER")
def update_subscription_view(request):


    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        }, status=405)

    try:
        body = json.loads(request.body or "{}")  # ✅ SAFE
    except json.JSONDecodeError:
        return JsonResponse({
            "success": False,
            "message": "Invalid JSON format"
        }, status=400)

    plan_id = body.get("plan_id")

    if not plan_id:
        return JsonResponse({
            "success": False,
            "message": "Plan ID is required"
        }, status=400)

    try:
        plan = SubscriptionPlan.objects.get(id=plan_id)
    except SubscriptionPlan.DoesNotExist:
        return JsonResponse({
            "success": False,
            "message": "Plan not found"
        }, status=404)

    org = request.user.organization

    if not org:
        return JsonResponse({
            "success": False,
            "message": "Organization not found"
        }, status=400)

    org.subscription_plan = plan
    org.subscription_started_at = timezone.now()
    org.subscription_expires_at = timezone.now() + timedelta(days=30)
    org.save()

    return JsonResponse({
        "success": True,
        "message": "Subscription updated successfully",
        "data": {
            "plan": plan.name,
            "expires_at": org.subscription_expires_at,
            "is_active": org.is_subscription_active()
        }
    })

@csrf_exempt
def team_view(request):
    teams = Team.objects.all()
    data = []

    for team in teams:
        data.append({
            "id": team.id,          # ✅ IMPORTANT (added)
            "name": team.name,
            
        })
        print(data)

    return JsonResponse({
        "success": True,
        "data": data
    })


@csrf_exempt
def task_view(request):
    tasks = Task.objects.all()
    data = []

    for task in tasks:
        data.append({
            "id": task .id,          # ✅ IMPORTANT (added)
            "name": task.name,
            
        })

    return JsonResponse({
        "success": True,
        "data": data
    })

@csrf_exempt
def project_view(request):
    projects = Project.objects.all()
    data = []

    for project in projects:
        data.append({
            "id": project.id,          # ✅ IMPORTANT (added)
            "name": project.name,
            
        })
    print(data)
    return JsonResponse({
        "success": True,
        "data": data
    })


@csrf_exempt
@role_required("OWNER", "ADMIN")
def assign_project_view(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        }, status=405)

    try:
        data = json.loads(request.body)

        project_id = data.get("project_id")
        team_id = data.get("team_id")

        if not project_id or not team_id:
            raise ValueError("Project ID and Team ID required")

        project = Project.objects.get(id=project_id)
        team = Team.objects.get(id=team_id)

        # 🔒 Same org check
        if project.organization != request.user.organization:
            raise ValueError("Unauthorized")

        if team.organization != request.user.organization:
            raise ValueError("Unauthorized")

        # ✅ Assign
        project.team = team
        project.save()

        return JsonResponse({
            "success": True,
            "message": "Project assigned successfully"
        })

    except Project.DoesNotExist:
        return JsonResponse({"success": False, "message": "Project not found"}, status=404)

    except Team.DoesNotExist:
        return JsonResponse({"success": False, "message": "Team not found"}, status=404)

    except ValueError as e:
        return JsonResponse({"success": False, "message": str(e)}, status=400)

    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=500)
    

@csrf_exempt
@role_required("OWNER", "ADMIN")
def list_members_view(request):

    if request.method != "GET":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        }, status=405)

    users = User.objects.filter(
        organization=request.user.organization,
        role="MEMBER"
    )

    data = []
    for user in users:
        data.append({
            "id": user.id,
            "username": user.username
        })

    return JsonResponse({
        "success": True,
        "data": data
    })