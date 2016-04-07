import textwrap
import json

from django.contrib.staticfiles.storage import staticfiles_storage
try:
    # Django 1.10
    from django.urls import reverse, NoReverseMatch
except ImportError:
    # Django <= 1.9
    from django.core.urlresolvers import reverse, NoReverseMatch
from django.http import HttpResponse, HttpResponseForbidden


def server_data_js(request):
    """
    Dynamic javascript serve defining the grappelli lookup urls.
    """
    if not (request.user.is_active and request.user.is_staff):
        return HttpResponseForbidden('"Permission denied"')

    grappelli_lookup_urls = {}
    # Reverse names are "grp_%(key)s_lookup"
    grappelli_lookup_keys = ("related", "m2m", "autocomplete",)

    for k in grappelli_lookup_keys:
        try:
            grappelli_lookup_urls[k] = reverse("grp_%s_lookup" % k)
        except NoReverseMatch:
            pass

    server_data_js = textwrap.dedent(u"""
        var DJNesting = (typeof window.DJNesting != "undefined")
                       ? DJNesting : {};
        DJNesting.adminStaticPrefix = %s;
        DJNesting.LOOKUP_URLS = %s;""" % (
            json.dumps(staticfiles_storage.url("admin/")),
            json.dumps(grappelli_lookup_urls),))

    return HttpResponse(server_data_js.strip(),
        content_type='application/javascript')
