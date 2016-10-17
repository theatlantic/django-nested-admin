#!/usr/bin/env python
import argparse
import os
import re
import sys
import warnings

import django
from django.conf import settings
from django.test.utils import get_runner

from nested_admin.tests.selenium import SeleniumTestCaseBase


warnings.simplefilter("error", DeprecationWarning)
warnings.simplefilter("error", PendingDeprecationWarning)
warnings.simplefilter("error", RuntimeWarning)
warnings.filterwarnings('ignore', module="IPython", category=DeprecationWarning)

# A dict for mapping test case classes to their import paths, to allow passing
# TestCaseClass.test_function as shorthand to runtests.py
TEST_CASE_MODULE_PATHS = {
    'TestAdminWidgets': 'nested_admin.tests.admin_widgets.tests',
    'TestGenericInlineAdmin': 'nested_admin.tests.gfk.tests',
    'VisualComparisonTestCase': 'nested_admin.tests.one_deep.tests',
    'TestDeepNesting': 'nested_admin.tests.three_deep.tests',
    'TestStackedInlineAdmin': 'nested_admin.tests.two_deep.tests',
    'TestTabularInlineAdmin': 'nested_admin.tests.two_deep.tests',
    'TestSortablesWithExtra': 'nested_admin.tests.two_deep.tests',
    'TestIdenticalPrefixes': 'nested_admin.tests.identical_prefixes.tests',
}


def expand_test_module(module):
    module = os.path.normpath(module)
    matches = re.search(r'^([^/.]+)(\.[^./]+)?$', module)
    if not matches:
        return module
    cls, test_fn = matches.groups()
    if not test_fn:
        test_fn = ''
    if cls not in TEST_CASE_MODULE_PATHS:
        return module
    return "%s.%s%s" % (TEST_CASE_MODULE_PATHS[cls], cls, test_fn)


def django_tests(verbosity, failfast, test_labels):
    sys.stderr.write('Using Python version %s from %s\n' % (sys.version[:5], sys.executable))
    sys.stderr.write('Using Django version %s from %s\n' % (
        django.get_version(),
        os.path.dirname(os.path.abspath(django.__file__))))

    settings.INSTALLED_APPS
    if settings.configured:
        django.setup()

    if 'grappelli' in settings.INSTALLED_APPS:
        # Grappelli uses the deprecated django.conf.urls.patterns, but we
        # don't want this to fail our tests.
        warnings.filterwarnings("ignore", "django.conf.urls.patterns", PendingDeprecationWarning)
        warnings.filterwarnings("ignore", "django.conf.urls.patterns", DeprecationWarning)

    if not hasattr(settings, 'TEST_RUNNER'):
        settings.TEST_RUNNER = 'nested_admin.tests.runner.DiscoverRunner'

    TestRunner = get_runner(settings)

    test_runner = TestRunner(verbosity=verbosity, failfast=failfast)
    return test_runner.run_tests(test_labels or ['nested_admin'])


class ActionSelenium(argparse.Action):
    """
    Validate the comma-separated list of requested browsers.
    """
    def __call__(self, parser, namespace, values, option_string=None):
        browsers = values.split(',')
        for browser in browsers:
            try:
                SeleniumTestCaseBase.import_webdriver(browser)
            except ImportError:
                raise argparse.ArgumentError(self, "Selenium browser specification '%s' is not valid." % browser)
        setattr(namespace, self.dest, browsers)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the Django test suite.")
    parser.add_argument('modules', nargs='*', metavar='module',
        help='Optional path(s) to test modules; e.g. "nested_admin.tests.two_deep"'
             ' or "nested_admin.tests.three_deep.tests.TestDeepNesting.test_create_new".')
    parser.add_argument(
        '-v', '--verbosity', default=1, type=int, choices=[0, 1, 2, 3],
        help='Verbosity level; 0=minimal output, 1=normal output, 2=all output')
    parser.add_argument(
        '--failfast', action='store_true', dest='failfast', default=False,
        help='Tells Django to stop running the test suite after first failed '
             'test.')
    parser.add_argument(
        '--settings',
        help='Python path to settings module, e.g. "myproject.settings". If '
             'this isn\'t provided, either the DJANGO_SETTINGS_MODULE '
             'environment variable or "nested_admin.tests.settings" will be used.')
    parser.add_argument('--liveserver',
        help='Overrides the default address where the live server (used with '
             'LiveServerTestCase) is expected to run from. The default value '
             'is localhost:8081-8179.')
    parser.add_argument(
        '--selenium', dest='selenium', action=ActionSelenium, metavar='BROWSERS',
        help='A comma-separated list of browsers to run the Selenium tests against. '
             'Defaults to "phantomjs".')

    options = parser.parse_args()

    # Allow including a trailing slash on app_labels for tab completion convenience
    options.modules = [expand_test_module(labels) for labels in options.modules]

    if options.settings:
        os.environ['DJANGO_SETTINGS_MODULE'] = options.settings
    else:
        if "DJANGO_SETTINGS_MODULE" not in os.environ:
            os.environ['DJANGO_SETTINGS_MODULE'] = 'nested_admin.tests.settings'
        options.settings = os.environ['DJANGO_SETTINGS_MODULE']

    if options.liveserver is not None:
        os.environ['DJANGO_LIVE_TEST_SERVER_ADDRESS'] = options.liveserver

    if options.selenium:
        SeleniumTestCaseBase.browsers = options.selenium
    else:
        SeleniumTestCaseBase.import_webdriver('phantomjs')
        SeleniumTestCaseBase.browsers = ['phantomjs']

    os.environ.setdefault('NESTED_ADMIN_LOG_LEVEL',
        ['ERROR', 'WARNING', 'INFO', 'DEBUG'][options.verbosity])

    failures = django_tests(options.verbosity, options.failfast, options.modules)
    if failures:
        sys.exit(bool(failures))
