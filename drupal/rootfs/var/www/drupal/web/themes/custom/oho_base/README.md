OHO Base
---------

* Introduction
* Requirements
* Usage

INTRODUCTION
------------
The OHO Base theme provides base functionality for developing a theme.

REQUIREMENTS
------------
* The Twig Field Value module (https://www.drupal.org/project/twig_field_value) is required to to use the macros.

USAGE
------------

## Library Override

When it is time to add the assets to the child theme, the global library will need to be entirely overridden.

Add the following lines to the child theme's info.yml file:

libraries-override:
  oho_base/global: client_theme/global
  core/modernizr:
    js:
      assets/vendor/modernizr/modernizr.min.js: assets/js/dist/modernizr.js

### Modernizr Features

The following feature detects must be added to assets/.modernizrrc.json, as they
are included in the overridden core modernizr.min.js file:
- "test/inputtypes"
- "test/touchevents"
- "test/elem/details"

## Macros

To include and use the macros, insert the following line in the twig template where you intend to use the macros:

{% import "@oho_base/includes/oho-macros.html.twig" as oho_macros %}

You can then use macros in that template. For example, to build an html list from a field with classes:

{{ oho_macros.list(content.field_utility_links|field_value, 'utility-list', 'utility-list-item') }}
