from pathlib import Path
import dj_database_url
import os

BASE_DIR = Path(__file__).resolve().parent.parent


# -------------------------------
# SECURITY
# -------------------------------
# Use environment variable (Render)
SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback-secret-key')

DEBUG = False

ALLOWED_HOSTS = [
    "worknest-elmw.onrender.com",
]


# -------------------------------
# APPLICATIONS
# -------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'app',
    'corsheaders',
    'rest_framework',
]


# -------------------------------
# MIDDLEWARE
# -------------------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',   # moved up
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'WorkNest.urls'
WSGI_APPLICATION = 'WorkNest.wsgi.application'


# -------------------------------
# DATABASE
# -------------------------------
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get("DATABASE_URL"),
        conn_max_age=600
    )
}


# -------------------------------
# CORS / CSRF
# -------------------------------
CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
]

CORS_ALLOW_CREDENTIALS = True


# -------------------------------
# STATIC FILES
# -------------------------------
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


# -------------------------------
# CUSTOM USER MODEL
# -------------------------------
AUTH_USER_MODEL = 'app.User'


# -------------------------------
# INTERNATIONALIZATION
# -------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
