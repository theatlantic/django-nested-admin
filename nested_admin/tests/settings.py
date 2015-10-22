import os
import django
import tempfile


current_dir = os.path.abspath(os.path.dirname(__file__))
temp_dir = tempfile.mkdtemp()


DEBUG = True,
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
        # 'NAME': '/tmp/test.db',
    }
}
SECRET_KEY = 'z-i*xqqn)r0i7leak^#clq6y5j8&tfslp^a4duaywj2$**s*0_'

if django.VERSION > (1, 9):
    context_processor_path = 'django.template.context_processors'
else:
    context_processor_path = 'django.core.context_processors'

if django.VERSION > (1, 9):
    TEMPLATES = [{
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(current_dir, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                '%s.debug' % context_processor_path,
                '%s.i18n' % context_processor_path,
                '%s.media' % context_processor_path,
                '%s.static' % context_processor_path,
                '%s.tz' % context_processor_path,
                '%s.request' % context_processor_path,
                'django.contrib.messages.context_processors.messages',
            ],
        },
    }]
else:
    TEMPLATE_LOADERS = (
        'django.template.loaders.filesystem.Loader',
        'django.template.loaders.app_directories.Loader',
    )
    TEMPLATE_CONTEXT_PROCESSORS = (
        'django.contrib.auth.context_processors.auth',
        '%s.debug' % context_processor_path,
        '%s.i18n' % context_processor_path,
        '%s.media' % context_processor_path,
        '%s.static' % context_processor_path,
        '%s.tz' % context_processor_path,
        '%s.request' % context_processor_path,
        'django.contrib.messages.context_processors.messages',
    )
    TEMPLATE_DIRS = (
        os.path.join(current_dir, 'templates'),
    )


try:
    import grappelli
except ImportError:
    INSTALLED_APPS = tuple([])
else:
    INSTALLED_APPS = tuple(['grappelli'])

INSTALLED_APPS += (
    'nested_admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.messages',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.staticfiles',
    'django.contrib.admin',
)
MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)
SITE_ID = 1
ROOT_URLCONF = 'nested_admin.tests.urls'
MEDIA_ROOT = os.path.join(temp_dir, 'media')
MEDIA_URL = '/media/'
STATIC_URL = '/static/'
DEBUG_PROPAGATE_EXCEPTIONS = True
TEST_RUNNER = 'django.test.runner.DiscoverRunner' if django.VERSION >= (1, 6) else 'discover_runner.runner.DiscoverRunner'
