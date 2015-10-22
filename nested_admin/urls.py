from django.conf.urls import url


import nested_admin.views


urlpatterns = [
    url(r'^server-data\.js$', nested_admin.views.server_data_js,
        name="nesting_server_data"),
]
