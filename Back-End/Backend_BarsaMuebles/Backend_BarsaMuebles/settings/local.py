from .base import *

DEBUG = True

ALLOWED_HOSTS = []

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'MuebleriaDB',
        'USER': 'admin',
        'PASSWORD': '@dm1nDB',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

STATIC_URL = 'static/'