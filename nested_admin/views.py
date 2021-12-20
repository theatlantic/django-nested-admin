import textwrap
import json

from django.urls import reverse, NoReverseMatch
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

    server_data_js = textwrap.dedent("""
        var DJNesting = (typeof window.DJNesting != "undefined")
                       ? DJNesting : {{}};
        DJNesting.LOOKUP_URLS = {};""".format(
            json.dumps(grappelli_lookup_urls)))

    return HttpResponse(server_data_js.strip(),
        content_type='application/javascript')
