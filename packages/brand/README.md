# @lcs/brand

The LCS brand kit, shared by `apps/site` and `apps/admin`, so a colour, font or image changes in one place.

| File | What |
| --- | --- |
| `tokens.css` | Every brand value: colours, fonts, radii, motion curves, focus ring, the icon pattern |
| `fonts.css` | Dosis and Montserrat, self-hosted through Fontsource |
| `assets/logos/` | LCS icon and long logo, black and white |
| `assets/mascots/` | Krill, Doug and Coco |
| `assets/letters/` | Scrapbook letters for department names and big moments |
| `assets/doodles/` | Asterisk and bracket doodles |
| `assets/patterns/` | The icon pattern background |

## Using it

Each app depends on `"@lcs/brand": "workspace:*"` and aliases `@lcs/brand` to this folder in its Vite config,
so CSS `url()` and `import.meta.glob` resolve here too.

```css
@import "@lcs/brand/fonts.css";
@import "@lcs/brand/tokens.css";
```

```ts
import krill from '@lcs/brand/assets/mascots/Krill.svg';
```

## For Marketing

- Change a colour or font: edit `tokens.css`. Both apps follow.
- Add an asset: put the file in the right `assets/<kind>/` folder, named in `PascalCase` like the others. A
  developer adds one line where that kind is listed.
- Event photos are content, not brand: they are uploaded in the admin, not added here.
