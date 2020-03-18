import glob
import os
import tempfile

import django

import selenosis.settings
import dj_database_url


current_dir = os.path.abspath(os.path.dirname(__file__))
temp_dir = tempfile.mkdtemp()


DEBUG = NESTED_ADMIN_DEBUG = True
DATABASES = {
    'default': dj_database_url.parse(os.environ.get('DATABASE_URL', 'sqlite://:memory:')),
}
DATABASES['default']['TEST'] = dict(DATABASES['default'])

SECRET_KEY = 'z-i*xqqn)r0i7leak^#clq6y5j8&tfslp^a4duaywj2$**s*0_'

if django.VERSION > (2, 0):
    MIGRATION_MODULES = {
        'auth': None,
        'contenttypes': None,
        'sessions': None,
    }

try:
    import grappelli  # noqa
except ImportError:
    INSTALLED_APPS = tuple([])
else:
    INSTALLED_APPS = tuple(['grappelli'])

polymorphic = None

if django.VERSION < (3, 0):
    try:
        import polymorphic
    except ImportError:
        pass
    else:
        INSTALLED_APPS += ('polymorphic',)

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': selenosis.settings.TEMPLATES[0]['DIRS'],
    'APP_DIRS': True,
    'OPTIONS': {
        'debug': True,
        'string_if_invalid': 'INVALID {{ %s }}',
        'context_processors': [
            'django.contrib.auth.context_processors.auth',
            'django.template.context_processors.debug',
            'django.template.context_processors.i18n',
            'django.template.context_processors.media',
            'django.template.context_processors.static',
            'django.template.context_processors.tz',
            'django.template.context_processors.request',
            'django.contrib.messages.context_processors.messages',
        ],
    },
}]

INSTALLED_APPS += (
    'selenosis',
    'nested_admin.tests',
    'nested_admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.messages',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.staticfiles',
    'django.contrib.admin',
)

# Add apps within the tests folder
for p in glob.glob(os.path.join(current_dir, '*', 'models.py')):
    INSTALLED_APPS += tuple(["nested_admin.tests.%s" %
        os.path.basename(os.path.dirname(p))])


if polymorphic is not None:
    for p in glob.glob(os.path.join(current_dir, 'nested_polymorphic/*/models.py')):
        INSTALLED_APPS += tuple(["nested_admin.tests.nested_polymorphic.%s" %
            os.path.basename(os.path.dirname(p))])


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'nested_admin.tests': {
            'handlers': ['console'],
            'level': 'WARNING',
        },
    },
}

SITE_ID = 1
ROOT_URLCONF = 'nested_admin.tests.urls'
MEDIA_ROOT = os.path.join(temp_dir, 'media')
MEDIA_URL = '/media/'
STATIC_URL = '/static/'
DEBUG_PROPAGATE_EXCEPTIONS = True
TEST_RUNNER = 'selenosis.DiscoverRunner'

AWS_S3_REGION_NAME = "us-east-1"
AWS_STORAGE_BUCKET_NAME = 'django-nested-admin-artifacts'
AWS_DEFAULT_ACL = None
