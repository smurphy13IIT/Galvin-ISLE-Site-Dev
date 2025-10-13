<?php

/**
 * @file
 * Add custom theme settings to the OHO Base theme.
 */

use Drupal\Core\Form\FormStateInterface;

/**
 * Implements hook_form_FORM_ID_alter().
 */
function oho_base_form_system_theme_settings_alter(&$form, FormStateInterface $form_state) {
  /* Breadcrumbs */

  $form['breadcrumbs'] = [
    '#type' => 'details',
    '#title' => t('Breadcrumbs'),
    '#open' => TRUE,
  ];

  // Add a checkbox to toggle the home breadcrumb link.
  $form['breadcrumbs']['oho_base_breadcrumbs_display_home'] = [
    '#type' => 'checkbox',
    '#title' => t('Display the Home Breadcrumb'),
    '#default_value' => theme_get_setting('oho_base_breadcrumbs_display_home'),
    '#description' => t('Display the home breadcrumb link.'),
  ];

  // Add a field to select the breadcrumb starting level.
  $form['breadcrumbs']['oho_base_breadcrumbs_display_starting_level'] = [
    '#type' => 'number',
    '#min' => 1,
    '#max' => 5,
    '#step' => 1,
    '#title' => t('Starting Level for Breadcrumb Display'),
    '#default_value' => theme_get_setting('oho_base_breadcrumbs_display_starting_level'),
    '#description' => t('The level at which breadcrumbs will start being displayed. Entering a value of "1" will show breadcrumbs on level one pages.'),
  ];
}
