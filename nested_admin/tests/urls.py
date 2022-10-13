from django.conf import settings
from django.contrib import admin

try:
    from django.urls import re_path, include
except ImportError:
    from django.conf.urls import include, url as re_path

# Explicitly import to register the admins for the test models
for app in settings.INSTALLED_APPS:
    if app.startswith("nested_admin.tests."):
        __import__("%s.admin" % app)


urlpatterns = [
    re_path(r"^_nesting/", include("nested_admin.urls")),
    re_path(r"^admin/", admin.site.urls),
]

try:
    import grappelli  # noqa
except ImportError:
    pass
else:
    urlpatterns += [re_path(r"^grappelli/", include("grappelli.urls"))]
