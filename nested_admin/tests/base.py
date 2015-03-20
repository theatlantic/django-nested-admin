import contextlib

from django.contrib.auth.models import User
from django.core.urlresolvers import reverse

from django.contrib.admin.tests import AdminSeleniumWebDriverTestCase

from selenium.webdriver.common.by import By
from selenium.webdriver.support.expected_conditions import (
    visibility_of_element_located, element_to_be_clickable)


class BaseNestedAdminTestCase(AdminSeleniumWebDriverTestCase):

    urls = 'nested_admin.tests.urls'

    available_apps = [
        'grappelli',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.messages',
        'django.contrib.sessions',
        'django.contrib.sites',
        'django.contrib.staticfiles',
        'django.contrib.admin',
        'nested_admin',
    ]

    webdriver_class = 'selenium.webdriver.phantomjs.webdriver.WebDriver'

    def setUp(self):
        super(BaseNestedAdminTestCase, self).setUp()
        self.selenium.set_window_size(1120, 1000)
        User.objects.create_superuser('mtwain', 'me@example.com', 'p@ssw0rd')
        self.admin_login("mtwain", "p@ssw0rd", login_url=reverse('admin:index'))

    def wait_until(self, callback, timeout=10, message=None):
        """
        Helper function that blocks the execution of the tests until the
        specified callback returns a value that is not falsy. This function can
        be called, for example, after clicking a link or submitting a form.
        See the other public methods that call this function for more details.
        """
        from selenium.webdriver.support.wait import WebDriverWait
        WebDriverWait(self.selenium, timeout).until(callback, message)

    def wait_until_visible_selector(self, selector, timeout=10):
        self.wait_until(
            visibility_of_element_located((By.CSS_SELECTOR, selector)),
            timeout=timeout,
            message="Timeout waiting for visible element at selector='%s'" % selector)

    def wait_until_clickable_xpath(self, xpath, timeout=10):
        self.wait_until(
            element_to_be_clickable((By.XPATH, xpath)), timeout=timeout,
            message="Timeout waiting for clickable element at xpath='%s'" % xpath)

    def wait_until_clickable_selector(self, selector, timeout=10):
        self.wait_until(
            element_to_be_clickable((By.CSS_SELECTOR, selector)),
            timeout=timeout,
            message="Timeout waiting for clickable element at selector='%s'" % selector)

    def wait_until_available_selector(self, selector, timeout=10):
        self.wait_until(
            lambda driver: driver.find_element_by_css_selector(selector),
            timeout=timeout,
            message="Timeout waiting for available element at selector='%s'" % selector)

    def wait_until_available_xpath(self, xpath, timeout=10):
        self.wait_until(
            lambda driver: driver.find_element_by_xpath(xpath),
            timeout=timeout,
            message="Timeout waiting for available element at xpath='%s'" % xpath)

    @contextlib.contextmanager
    def visible_selector(self, selector, timeout=10):
        self.wait_until_visible_selector(selector, timeout)
        yield self.selenium.find_element_by_css_selector(selector)

    @contextlib.contextmanager
    def clickable_selector(self, selector, timeout=10):
        self.wait_until_clickable_selector(selector, timeout)
        yield self.selenium.find_element_by_css_selector(selector)

    @contextlib.contextmanager
    def clickable_xpath(self, xpath, timeout=10):
        self.wait_until_clickable_xpath(xpath, timeout)
        yield self.selenium.find_element_by_xpath(xpath)

    @contextlib.contextmanager
    def available_selector(self, selector, timeout=10):
        self.wait_until_available_selector(selector, timeout)
        yield self.selenium.find_element_by_css_selector(selector)

    @contextlib.contextmanager
    def available_xpath(self, xpath, timeout=10):
        self.wait_until_available_xpath(xpath, timeout)
        yield self.selenium.find_element_by_xpath(xpath)

    @contextlib.contextmanager
    def switch_to_popup_window(self):
        self.wait_until(lambda d: len(d.window_handles) == 2)
        self.selenium.switch_to.window(self.selenium.window_handles[1])
        yield
        self.wait_until(lambda d: len(d.window_handles) == 1)
        self.selenium.switch_to.window(self.selenium.window_handles[0])
