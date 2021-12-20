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
init_file = os.path.join(os.path.dirname(__file__),
                         'nested_admin', '__init__.py')
with open(init_file, 'r') as f:
    for line in f:
        m = re.search(r'''^__version__ = (['"])(.+?)\1$''', line)
        if m is not None:
            version = m.group(2)
            break
    else:
        raise LookupError('Unable to find __version__ in ' + init_file)


setup(
    name='django-nested-admin',
    version=version,
    install_requires=[
        'python-monkey-business>=1.0.0',
        'six',
    ],
    description="Django admin classes that allow for nested inlines",
    author='The Atlantic',
    author_email='programmers@theatlantic.com',
    url='https://github.com/theatlantic/django-nested-admin',
    packages=find_packages(),
    license='BSD',
    platforms='any',
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        "Programming Language :: Python :: 2",
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Framework :: Django',
        'Framework :: Django :: 1.11',
        'Framework :: Django :: 2.2',
        'Framework :: Django :: 3.2',
        'Framework :: Django :: 4.0',
    ],
    include_package_data=True,
    zip_safe=False,
    long_description=''.join(list(open('README.rst'))[3:]))
