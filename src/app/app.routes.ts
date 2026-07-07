import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'quote',
        pathMatch: 'full'
    },
    {
        path: 'quote',
        loadComponent: () =>
            import('./features/quote-wizard/quote-wizard/quote-wizard').then(m => m.QuoteWizard)
    }
];