from functools import wraps
from django.core.exceptions import PermissionDenied
from django.contrib.auth.decorators import login_required

def role_required(*allowed_roles):
    def decorator(view_func):
        @wraps(view_func)
        @login_required
        def wrapper(request, *args, **kargs):
            if request.user.role not in allowed_roles:
                raise PermissionDenied('You do not have permission to access')
            return view_func(request, *args, **kargs)
        
        return wrapper
    
    return decorator

    pass