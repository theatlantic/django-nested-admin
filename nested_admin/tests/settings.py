import glob
import os
import tempfile

import django

import django_admin_testutils.settings
import dj_database_url


current_dir = os.path.abspath(os.path.dirname(__file__))
temp_dir = tempfile.mkdtemp()


DEBUG = NESTED_ADMIN_DEBUG = True
DATABASES = {
    'default': dj_database_url.parse(os.environ.get('DATABASE_URL', 'sqlite://:memory:')),
}
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
    try:
        import suit  # noqa
    except ImportError:
        INSTALLED_APPS = tuple([])
    else:
        INSTALLED_APPS = tuple(['suit'])
        SUIT_CONFIG = {'CONFIRM_UNSAVED_CHANGES': False}
else:
    INSTALLED_APPS = tuple(['grappelli'])


TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': django_admin_testutils.settings.TEMPLATES[0]['DIRS'],
    'APP_DIRS': True,
    'OPTIONS': {
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

if 'suit' in INSTALLED_APPS:
    # django-suit has issues with string_if_invalid,
    # so don't use this setting if testing suit.
    TEMPLATES[0]['OPTIONS'].pop('string_if_invalid')


INSTALLED_APPS += (
    'django_admin_testutils',
    'nested_admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.messages',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'nested_admin.tests',
)

# Add apps within the tests folder
for p in glob.glob(os.path.join(current_dir, '*', 'models.py')):
    INSTALLED_APPS += tuple(["nested_admin.tests.%s" %
        os.path.basename(os.path.dirname(p))])


if django.VERSION >= (1, 10):
    MIDDLEWARE = [
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
    ]
else:
    MIDDLEWARE_CLASSES = (
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    )

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
TEST_RUNNER = 'django_admin_testutils.DiscoverRunner'

AWS_S3_REGION_NAME = "us-east-1"
AWS_STORAGE_BUCKET_NAME = 'django-nested-admin-artifacts'
