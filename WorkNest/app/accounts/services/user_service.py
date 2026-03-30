from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from datetime import timedelta
import logging
from ...models import User, Organization


from ...models import User, Organization

logger = logging.getLogger(__name__)


def create_owner(data):
    if User.objects.filter(username=data.get("username")).exists():
        raise ValueError("Username already exists")

    if Organization.objects.filter(name=data.get("organization_name")).exists():
        raise ValueError("Organization already exists")

    if data["password"] != data["confirm_password"]:
        raise ValueError("Passwords do not match")

    with transaction.atomic():

        user = User.objects.create_user(
            username=data.get("username"),
            password=data.get("password"),
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            email=data.get("email"),
            role="OWNER"
        )

        organization = Organization.objects.create(
            name=data.get("organization_name"),
            created_by=user,
            subscription_started_at=timezone.now(),
            is_active=True
        )

        user.organization = organization
        user.save()

    return user


def create_admin(data, organization):
    if not organization:
        raise ValueError("Organization is required")

    if User.objects.filter(username=data.get('username')).exists():
        raise ValueError("Username already exists")
    
    if data.get("password") != data.get("confirm_password"):
        raise ValueError("Passwords do not match")
    
    with transaction.atomic():
        user = User.objects.create_user(
            username = data.get('username'),
            password = data.get('password'),
            first_name = data.get('first_name'),
            last_name = data.get('last_name'),
            email=data.get('email'),
            organization=organization,
            role = 'ADMIN'

        )

    return user


def create_member(data, organization):
    if not organization:
        raise ValueError("Organization is required")

    if User.objects.filter(username=data.get('username')).exists():
        raise ValueError("Username already exists")
    
    if data.get("password") != data.get("confirm_password"):
        raise ValueError("Passwords do not match")
    
    with transaction.atomic():
        user = User.objects.create_user(
            username = data.get('username'),
            password = data.get('password'),
            first_name = data.get('first_name'),
            last_name = data.get('last_name'),
            email = data.get('email'),
            organization = organization,
            role = 'MEMBER'

        )

    return user



def buy_subscription(organization, plan):

    organization.subscription_plan = plan
    organization.subscription_started_at = timezone.now()

    # Example: 30 days plan
    organization.subscription_expires_at = timezone.now() + timedelta(days=30)

    organization.save()

    return organization