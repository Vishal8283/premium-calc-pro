# PremiumCalc Pro

An insurance premium quote calculator built with Angular. Pick a category (vehicle, health, or life), fill in your details, and it works out a premium across three plan tiers in real time as you type no submit button, no page reload.

Live demo: https://premium-calc-pro.vercel.app
Repo: https://github.com/Vishal8283/premium-calc-pro

## Why I built this

I've spent the last couple of years building Angular applications for insurance and financial platforms at work, mostly dashboards and claims tracking tools. I wanted a project outside of work that used the same kind of problems real-time calculations, form-heavy UIs, reactive data but that I could build and design end to end myself.

## What it does

- Choose between Vehicle, Health, or Life insurance, each with its own set of relevant form fields
- Premium recalculates live as you change any input, using RxJS and Angular signals
- Shows Basic, Standard, and Premium pricing side by side so you can compare before picking one
- Form validation with proper error messages (age limits, required fields, etc.)
- Works fully with keyboard only — tab through everything, select plans with Enter/Space, proper ARIA labels for screen readers
- Routes are lazy loaded so the initial page load stays small

## Stack

Angular (standalone components + signals), TypeScript, RxJS, Reactive Forms, SCSS. Tests are written with Vitest. Deployed on Vercel.

## Project structure

```
src/app/
├── core/
│   ├── models/       # types and enums shared across the app
│   └── services/      # PremiumCalculatorService - all the pricing logic lives here
├── features/
│   └── quote-wizard/
│       ├── quote-wizard/            # holds the current step
│       ├── insurance-type-step/     # pick a category
│       └── coverage-details-step/   # form + plan comparison
```

The pricing logic sits entirely in one service, separate from any component. That made it easy to unit test on its own and to add Health and Life calculations after I'd already built out Vehicle without touching any UI code.

## Running it yourself

```bash
git clone https://github.com/Vishal8283/premium-calc-pro.git
cd premium-calc-pro
npm install
ng serve -o
```
Opens at localhost:4200.

## Tests

```bash
ng test
```
Covers the calculation logic for all three insurance types and plan tiers, form validation edge cases, and a few component-level checks (e.g. the confirm button staying disabled while the form is invalid).

## Still on the list

- A proper summary screen after confirming a quote
- Export the quote as a PDF
- Shareable quote links via URL params

## Author

Vishal Mane — [GitHub](https://github.com/Vishal8283)
