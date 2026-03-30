from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    # Limits (SaaS enforcement level)
    max_users = models.IntegerField(null=True)
    max_projects = models.IntegerField(null=True)
    max_teams = models.IntegerField(null=True)

    # Feature flags (can store JSON later if needed)
    features = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
class Organization(models.Model):
    name = models.CharField(max_length=100, unique=True)

    # Subscription handling (Org specific, NOT plan specific)
    subscription_plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.SET_NULL,
        null=True,
        related_name='organizations'
    )

    subscription_started_at = models.DateTimeField(default=timezone.now)
    subscription_expires_at = models.DateTimeField(null=True, blank=True)

    is_active = models.BooleanField(default=True)

    created_by = models.ForeignKey(
        'User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='organizations_created'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def is_subscription_active(self):
        if self.subscription_expires_at:
            return self.subscription_expires_at > timezone.now()
        return False

    def __str__(self):
        return self.name
class User(AbstractUser):
    ROLE_CHOICES = (
        ('OWNER', 'Owner'),
        ('ADMIN', 'Admin'),
        ('MEMBER', 'Member'),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='MEMBER'
    )

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='users',
        null=True,
        blank=True
    )

    class Meta:
        indexes = [
            models.Index(fields=['organization']),
        ]

    def __str__(self):
        return self.username
class Team(models.Model):
    name = models.CharField(max_length=100)

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='teams'
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='teams_created'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('name', 'organization')
        indexes = [
            models.Index(fields=['organization']),
        ]

    def __str__(self):
        return self.name
class TeamMembership(models.Model):
        member = models.ForeignKey(
                                User,
                                on_delete=models.CASCADE,
                                related_name="team_memberships"

        )

        team = models.ForeignKey(
                                Team,
                                on_delete=models.CASCADE,
                                related_name='team'
                                )
        
        added_by = models.ForeignKey(
                                User,
                                on_delete=models.SET_NULL,
                                null=True,
                                related_name="team_members_added"
                                )
        added_at = models.DateTimeField(auto_now_add=True)

        class Meta:
            unique_together = ("member", "team")

        def __str__(self):
            return f"{self.member.username}-{self.team.name}"
class Project(models.Model):

    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('ON_HOLD', 'On Hold'),
    )

    name = models.CharField(max_length=100)

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='projects'
    )

    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='projects'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ACTIVE'
    )

    deadline = models.DateField(null=True, blank=True)

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='projects_created'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('name', 'organization')
        indexes = [
            models.Index(fields=['organization']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return self.name
class UsageTracking(models.Model):
    organization = models.OneToOneField(
        Organization,
        on_delete=models.CASCADE,
        related_name='usage'
    )

    active_users = models.IntegerField(default=0)
    total_projects = models.IntegerField(default=0)
    total_teams = models.IntegerField(default=0)

    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Usage for {self.organization.name}"         
class Task(models.Model):

    STATUS_CHOICES = (
        ("TODO", "Todo"),
        ("IN_PROGRESS", "In Progress"),
        ("DONE", "Done"),
    )

    title = models.CharField(max_length=200)

    description = models.TextField(blank=True)

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="tasks"
    )

    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tasks"
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="tasks_created"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="TODO"
    )

    deadline = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    