import { EventData, Page } from '@nativescript/core';
import { HomeViewModel } from './home-view-model';

let viewModel: HomeViewModel;

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  
  if (!viewModel) {
    viewModel = new HomeViewModel();
  }
  
  page.bindingContext = viewModel;
}

export function onPropertyTap(args) {
  const propertyId = viewModel.properties.getItem(args.index).id;
  viewModel.navigateToPropertyDetails(propertyId);
}

export function onFavoriteTap(args) {
  const propertyId = viewModel.favorites.getItem(args.index).id;
  viewModel.navigateToPropertyDetails(propertyId);
}

export function onFiltersTap() {
  viewModel.navigateToFilters();
}

export function onSearch(args) {
  // Search is handled by the view model through binding
}

export function onClear() {
  viewModel.searchQuery = '';
}

export function onTabChange(args) {
  viewModel.selectedTabIndex = args.newIndex;
}

export function onSignInTap() {
  viewModel.signIn();
}

export function onSignUpTap() {
  viewModel.signUp();
}

export function onSignOutTap() {
  viewModel.signOut();
}

export function onSettingsTap() {
  // Navigate to settings page
}

export function onSavedSearchesTap() {
  // Navigate to saved searches page
}

export function onSearchTap() {
  // Focus the search bar
  // This would require a reference to the search bar element
}