#!/usr/bin/env python
import re
import os.path

try:
    from setuptools import setup, find_packages
except ImportError:
    from ez_setup import use_setuptools

    use_setuptools()
    from setuptools import setup, find_packages


# Find the package version in __init__.py without importing it
# (which we cannot do because it has extensive dependencies).
init_file = os.path.join(os.path.dirname(__file__), "nested_admin", "__init__.py")
with open(init_file) as f:
    for line in f:
        m = re.search(r"""^__version__ = (['"])(.+?)\1$""", line)
        if m is not None:
            version = m.group(2)
            break
    else:
        raise LookupError("Unable to find __version__ in " + init_file)


tests_require = [
    "pytest",
    "pytest-cov",
    "pytest-xdist",
    "pytest-django",
    "Pillow",
    "dj-database-url",
    "django-selenosis",
    "selenium",
]

dev_require = [
    "black",
    "flake8",
] + tests_require


setup(
    name="django-nested-admin",
    version=version,
    python_requires=">=3.6",
    install_requires=[
        "python-monkey-business>=1.0.0",
    ],
    tests_require=tests_require,
    extras_require={
        "test": tests_require,
        "dev": dev_require,
    },
    description="Django admin classes that allow for nested inlines",
    author="The Atlantic",
    author_email="programmers@theatlantic.com",
    url="https://github.com/theatlantic/django-nested-admin",
    packages=find_packages(),
    license="BSD",
    platforms="any",
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Environment :: Web Environment",
        "Intended Audience :: Developers",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3 :: Only",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Framework :: Django",
        "Framework :: Django :: 3.2",
        "Framework :: Django :: 4.0",
        "Framework :: Django :: 4.1",
    ],
    include_package_data=True,
    zip_safe=False,
    long_description="".join(list(open("README.rst"))[3:]),
)
