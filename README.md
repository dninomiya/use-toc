# use-toc

[Demo](https://hub.nino.plus/c/toc)


## Usage

Copy the [use-toc.ts](https://github.com/dninomiya/use-toc/blob/main/use-toc.ts) file into your project.

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

