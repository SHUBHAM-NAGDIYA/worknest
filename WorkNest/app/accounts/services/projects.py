from django.db import transaction, IntegrityError
from ...models import Project, Team
from logger import logger




def create_project(name, team_id, created_by, deadline=None):

    # 🔹 Fetch team safely
    team = Team.objects.filter(id=team_id).first()
    if not team:
        raise ValueError("Team not found")

    organization = team.organization

    # 🔹 User must belong to same organization
    if not created_by.organization:
        raise ValueError("User is not assigned to any organization")

    if created_by.organization != organization:
        raise ValueError("Unauthorized organization access")

    # 🔹 Role check
    if created_by.role not in ["OWNER", "ADMIN"]:
        raise ValueError("Only owner or admin can create project")

    # 🔹 Subscription check
    plan = organization.subscription_plan
    if plan and plan.max_projects:
        if organization.projects.count() >= plan.max_projects:
            raise ValueError("Project limit reached")

    # 🔹 Duplicate check (extra safety)
    if Project.objects.filter(name=name, organization=organization).exists():
        raise ValueError("Project with this name already exists")

    # 🔹 Create project
    try:
        with transaction.atomic():
            project = Project.objects.create(
                name=name,
                organization=organization,
                team=team,
                created_by=created_by,
                deadline=deadline
            )
        return project

    except IntegrityError:
        raise ValueError("Project already exists")

def list_projects(user, page=1, limit=10):

    if not user.organization:
        raise ValueError("User not assigned to organization")

    organization = user.organization

    page = int(page)
    limit = int(limit)

    if page < 1:
        page = 1

    if limit < 1:
        limit = 10

    start = (page - 1) * limit
    end = start + limit

    projects_queryset = Project.objects.filter(
        organization=organization
    ).order_by("-created_at")

    total_projects = projects_queryset.count()

    projects = projects_queryset[start:end]

    data = []

    for project in projects:
        data.append({
            "id": project.id,
            "name": project.name,
            "team": project.team.name,
            "status": project.status,
            "deadline": project.deadline,
            "created_at": project.created_at
        })

    return {
        "page": page,
        "limit": limit,
        "total": total_projects,
        "data": data
    }