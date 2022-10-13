try:
    from django.urls import re_path
except ImportError:
    from django.conf.urls import url as re_path


import nested_admin.views


urlpatterns = [
    re_path(
        r"^server-data\.js$",
        nested_admin.views.server_data_js,
        name="nesting_server_data",
    ),
]
