import { EventData, Page, Frame } from '@nativescript/core';
import { FiltersViewModel } from './filters-view-model';

let viewModel: FiltersViewModel;

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  const navigationContext = page.navigationContext;
  
  viewModel = new FiltersViewModel(navigationContext?.filters || {});
  page.bindingContext = viewModel;
}

export function onBedroomSelect(args) {
  const button = args.object;
  const value = button.data === "null" ? null : parseInt(button.data, 10);
  viewModel.selectedBedrooms = value;
}

export function onBathroomSelect(args) {
  const button = args.object;
  const value = button.data === "null" ? null : parseInt(button.data, 10);
  viewModel.selectedBathrooms = value;
}

export function onPropertyTypeSelect(args) {
  const button = args.object;
  const value = button.data === "null" ? null : button.data;
  viewModel.selectedPropertyType = value;
}

export function onResetTap() {
  viewModel.resetFilters();
}

export function onCancelTap() {
  Frame.topmost().goBack();
}

export function onApplyTap() {
  const filters = viewModel.getFilters();
  
  // Pass filters back to the home page
  const homeViewModel = Frame.topmost().currentPage.bindingContext;
  if (homeViewModel && typeof homeViewModel.updateFilters === 'function') {
    homeViewModel.updateFilters(filters);
  }
  
  Frame.topmost().goBack();
}