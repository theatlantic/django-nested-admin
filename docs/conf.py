import sys
import os
import pkg_resources
from datetime import datetime


sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

on_rtd = os.environ.get('READTHEDOCS', None) == 'True'

os.environ['DJANGO_SETTINGS_MODULE'] = 'nested_admin.tests.settings'


import django  # noqa
from django.conf import settings  # noqa

settings.INSTALLED_APPS
if settings.configured:
    django.setup()


project = 'django-nested-admin'
copyright = '%d, The Atlantic' % datetime.now().year
author = 'The Atlantic'

release = pkg_resources.get_distribution(project).version
version = '.'.join(release.split('.')[:2])

extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.mathjax',
    "sphinx.ext.intersphinx",
    "sphinx.ext.viewcode",
]


def setup(app):
    app.add_stylesheet('nested_admin.css')


templates_path = ['_templates']
source_suffix = '.rst'
master_doc = 'index'
language = None

exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']
add_function_parentheses = True
add_module_names = False
pygments_style = 'trac'
todo_include_todos = False

html_theme = 'default'
html_static_path = ['_static']
html_last_updated_fmt = '%b %d, %Y'
html_show_sphinx = False

htmlhelp_basename = 'django-nested-admindoc'

latex_elements = {}
latex_documents = [
    (master_doc, 'django-nested-admin.tex', 'django-nested-admin Documentation',
     'The Atlantic', 'manual'),
]

man_pages = [
    (master_doc, 'django-nested-admin', 'django-nested-admin Documentation',
     [author], 1)
]

texinfo_documents = [
    (master_doc, 'django-nested-admin', 'django-nested-admin Documentation',
     author, 'django-nested-admin', 'One line description of project.',
     'Miscellaneous'),
]

if not on_rtd:  # only import and set the theme if we're building docs locally
    extensions.insert(0, 'readthedocs_ext.readthedocs')

    import sphinx_rtd_theme
    html_theme = 'sphinx_rtd_theme'
    html_theme_path = [sphinx_rtd_theme.get_html_theme_path()]
