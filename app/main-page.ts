import { EventData, Page } from '@nativescript/core';
import { MainViewModel } from './main-view-model';

let viewModel: MainViewModel;

export function onNavigatingTo(args: EventData) {
    console.log('Navigating to main page');
    const page = args.object as Page;
    
    if (!viewModel) {
        console.log('Creating new view model');
        viewModel = new MainViewModel();
    }
    
    page.bindingContext = viewModel;
    console.log('Properties count:', viewModel.Properties.length);
}
