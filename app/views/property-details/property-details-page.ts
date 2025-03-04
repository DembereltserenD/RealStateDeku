import { EventData, Page } from '@nativescript/core';
import { PropertyDetailsViewModel } from './property-details-view-model';

let viewModel: PropertyDetailsViewModel;

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  const navigationContext = page.navigationContext;
  
  if (navigationContext && navigationContext.propertyId) {
    viewModel = new PropertyDetailsViewModel(navigationContext.propertyId);
    page.bindingContext = viewModel;
  }
}

export function onToggleFavorite() {
  viewModel.toggleFavorite();
}

export function onShareTap() {
  // Implement share functionality
}

export function onContactTap() {
  // Implement contact agent functionality
}

export function onScheduleTap() {
  // Implement schedule viewing functionality
}