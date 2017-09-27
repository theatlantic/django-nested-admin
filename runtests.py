#!/usr/bin/env python
import os
import re
import warnings

import django_admin_testutils


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


class RunTests(django_admin_testutils.RunTests):

    def execute(self, flags, test_labels):
        test_labels = [expand_test_module(m) for m in test_labels]
        super(RunTests, self).execute(flags, test_labels)


def main():
    warnings.simplefilter("error", Warning)
    warnings.filterwarnings(
        "ignore",
        "name used for saved screenshot does not match file type",
        UserWarning)
    runtests = RunTests("nested_admin.tests.settings", "nested_admin")
    runtests()


if __name__ == '__main__':
    main()
