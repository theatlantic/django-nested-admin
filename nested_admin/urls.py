from django.conf.urls import patterns, url


urlpatterns = patterns('',
    url(r'^server-data\.js$', 'nested_admin.views.server_data_js',
        name="nesting_server_data"),
)
