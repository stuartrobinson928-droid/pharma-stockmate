# Stock Master Pro

Build a simple medical/pharmaceutical Stock Addition Calculator web app for a salesperson who purchases medicines from companies and sells them to medical stores.

Create a modern, professional, clean UI with your own creative freedom. Do not copy the screenshot's visual design, but use its fields and calculation workflow.

Stock Addition Form

Include all these columns:

Code, Name, Batch No, Cmp, Retail, Cp Dis %, TP, Stock, Bon, STax %, Disc %, S.Price, Item Total

Users can manually enter/edit the relevant fields, especially Cp Dis % and Disc %.

Calculations

TP = Retail × (100 − Cp Dis %) / 100

S.Price = TP

Net Unit Price = TP × (100 − Disc %) / 100

Item Total = Net Unit Price × Stock

Example:

Retail = 314, Cp Dis = 15%
→ TP = 266.90

TP = 266.90, Disc = 43%, Stock = 600
→ Net Unit Price = 151.29
→ Item Total = 90,774

Allow multiple medicine rows with automatic real-time calculations and an overall total at the bottom.

Include Add Row, Delete Row, Edit Values, Clear/Reset, and Print functionality.

Keep the MVP focused only on this stock calculation workflow. No inventory management, customers, reports, authentication, or other advanced features.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ec641b70-9e72-4a3a-baa5-5be672bb6e29).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
