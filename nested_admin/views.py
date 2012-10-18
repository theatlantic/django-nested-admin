import textwrap

from django.core.urlresolvers import reverse, NoReverseMatch
from django.http import HttpResponse, HttpResponseForbidden
from django.utils.simplejson import simplejson


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
        DJNesting.LOOKUP_URLS = %s;""" % (
            simplejson.dumps(grappelli_lookup_urls),))

    return HttpResponse(server_data_js.strip(),
        mimetype='application/javascript')
