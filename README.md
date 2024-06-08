# use-toc

`use-toc` is a React custom hook that automatically generates a table of contents from HTML headings. Since it is headless, you can style it freely, and because it is not a package, it is fully customizable.

- Detects active heading based on scroll position
- Automatically assigns IDs if headings do not have them
- Supports hierarchical structure of headings
- Supports tags other than headings
- Works with elements that have `overflow: scroll`

[Demo](https://hub.nino.plus/c/toc)

## Usage

1. Copy the [use-toc.ts](https://github.com/dninomiya/use-toc/blob/main/use-toc.ts) file into your project.
2. Here is how to use it:

```tsx
'use client';

import { useToc } from '@/app/c/toc/use-toc';
import { Button } from '@/components/ui/button';

export default function Toc() {
  const { activeId, headings } = useToc({
    contentId: 'content',
    containerId: 'content-view',
  });

  return (
    <div id="content-view" className='overflow-scroll'>
      <div id="content">
        <h1>...</h1>
        <h2>....</h2>
        <h3>.....</h3>
      </div>
      <div className="border p-6 rounded-lg">
        <ul>
          {headings.map((heading) => (
            <li key={heading.id}>
              <Button
                className="w-full justify-start"
                variant={activeId === heading.id ? 'secondary' : 'ghost'}
                asChild
              >
                <a href={`#${heading.id}`}>{heading.text}</a>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

## Props

| Prop Name        | Type   | Description                          | Default Value    | Required |
|------------------|--------|--------------------------------------|------------------|----------|
| `contentId`      | string | The ID of the content element.       |                  | Yes      |
| `containerId`    | string | The ID of the container element. (for `overflow: scroll`)     |                  | No       |
| `targetSelectors`| string | CSS selectors for target elements.   | 'h1, h2, h3, h4, h5, h6' | No |

## Contribute

If you have any bugs, improvements, or ideas, feel free to open an issue or submit a pull request!
