from django.db import transaction
from ...models import Task, Project, User, TeamMembership
from logger import logger


def create_task(title, project_id, assigned_username, created_by, deadline=None):

    project = Project.objects.filter(id=project_id).first()

    if not project:
        raise ValueError("Project not found")

    organization = project.organization

    if created_by.organization != organization:
        raise ValueError("Unauthorized access")

    if created_by.role not in ["OWNER", "ADMIN"]:
        raise ValueError("Only owner or admin can create tasks")

    # deadline parsing
    if deadline:
        from datetime import datetime
        try:
            deadline = datetime.strptime(deadline, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Invalid date format")

    assigned_user = None

    if assigned_username:

        assigned_user = User.objects.filter(
            username=assigned_username,
            organization=organization
        ).first()

        if not assigned_user:
            raise ValueError("Assigned user not found")

        # team check
        if not TeamMembership.objects.filter(
            member=assigned_user,
            team=project.team
        ).exists():
            raise ValueError("User is not part of this project team")

    with transaction.atomic():
        task = Task.objects.create(
            title=title,
            project=project,
            assigned_to=assigned_user,
            created_by=created_by,
            deadline=deadline
        )

    logger.info(
        f"Task created by {created_by.username}, "
        f"assigned to {assigned_user.username if assigned_user else 'Unassigned'}"
    )

    return task

def update_task_status(task_id, new_status, updated_by):

    task = Task.objects.filter(id=task_id).first()

    if not task:
        raise ValueError("Task not found")

    organization = task.project.organization

    # Organization security check
    if updated_by.organization != organization:
        raise ValueError("Unauthorized access")

    # Status validation
    allowed_status = ["TODO", "IN_PROGRESS", "DONE"]

    if new_status not in allowed_status:
        raise ValueError("Invalid task status")

    # Permission check
    if updated_by.role not in ["OWNER", "ADMIN"] and task.assigned_to != updated_by:
        raise ValueError("You are not allowed to update this task")

    with transaction.atomic():

        task.status = new_status
        task.save()
    
    return task




def list_tasks(project_id, user, page=1, limit=10):

    project = Project.objects.filter(id=project_id).first()

    if not project:
        raise ValueError("Project not found")

    # organization security check
    if user.organization != project.organization:
        raise ValueError("Unauthorized organization access")

    # pagination calculation
    offset = (page - 1) * limit

    tasks_queryset = Task.objects.filter(
        project=project
    ).order_by("-created_at")

    total_tasks = tasks_queryset.count()

    tasks = tasks_queryset[offset: offset + limit]

    return {
        "page": page,
        "limit": limit,
        "total_tasks": total_tasks,
        "total_pages": (total_tasks + limit - 1) // limit,
        "tasks": tasks
    }


def delete_task(task_id, user):

    task = Task.objects.filter(id=task_id, is_active=True).first()

    if not task:
        raise ValueError("Task not found")

    project = task.project
    organization = project.organization

    # Security check
    if user.organization != organization:
        raise ValueError("Unauthorized organization access")

    # Permission check
    if user.role not in ["OWNER", "ADMIN"] and task.created_by != user:
        raise ValueError("You do not have permission to delete this task")

    with transaction.atomic():

        task.is_active = False
        task.save()

    return task