from django.urls import path


import nested_admin.views


urlpatterns = [
    path('server-data.js', nested_admin.views.server_data_js,
        name="nesting_server_data"),
]
