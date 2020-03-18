from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin

# Explicitly import to register the admins for the test models
for app in settings.INSTALLED_APPS:
    if app.startswith('nested_admin.tests.'):
        __import__("%s.admin" % app)


urlpatterns = [
    url(r'^_nesting/', include('nested_admin.urls')),
    url(r'^admin/', admin.site.urls),
]

try:
    import grappelli  # noqa
except ImportError:
    pass
else:
    urlpatterns += [url(r"^grappelli/", include("grappelli.urls"))]
