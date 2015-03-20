from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf.urls.static import static

# Explicitly import to register the admins for the test models
import nested_admin.tests.admin

urlpatterns = patterns('',
    url(r'^grappelli/', include('grappelli.urls')),
    url(r'^_nesting/', include('nested_admin.urls')),
    url(r'^admin/', include(admin.site.urls)),
)     + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
        }),)

