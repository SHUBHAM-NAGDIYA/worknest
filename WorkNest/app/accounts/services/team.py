from django.db import transaction
from ..decorators import role_required
from ...models import Organization, User, Team, TeamMembership


def create_team(name, organization, created_by):

    if Team.objects.filter(name=name, organization=organization).exists():
        raise ValueError("Team already exists")

    with transaction.atomic():

        team = Team.objects.create(
            name=name,
            organization=organization,
            created_by=created_by
        )

    return team


def add_member_to_team(member_username, team_id, added_by):

    member = User.objects.filter(username=member_username).first()

    if not member:
        raise ValueError("Member not found")

    team = Team.objects.filter(id=team_id).first()

    if not team:
        raise ValueError("Team not found")

    if member.organization != team.organization:
        raise ValueError("User and team must belong to same organization")

    if added_by.organization != team.organization:
        raise ValueError("Unauthorized action")

    if member.role != "MEMBER":
        raise ValueError("Only members can be added to teams")

    if TeamMembership.objects.filter(member=member, team=team).exists():
        raise ValueError("Member already in team")

    with transaction.atomic():

        membership = TeamMembership.objects.create(
            member=member,
            team=team,
            added_by=added_by
        )

    return membership