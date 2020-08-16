import warnings

import pytest
from django.test import TestCase


TestCase.pytestmark = pytest.mark.django_db(transaction=True, reset_sequences=True)


@pytest.fixture(autouse=True)
def suppress_warnings():
    warnings.simplefilter("error", Warning)
    warnings.filterwarnings(
        "ignore",
        "name used for saved screenshot does not match file type",
        UserWarning)
    # These deprecation warnings were thrown in django-polymorphic as of 2.1.2
    warnings.filterwarnings("ignore", "django.utils.translation.ugettext", Warning)
    warnings.filterwarnings("ignore", "force_text", Warning)
