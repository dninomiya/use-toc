import { useEffect, useState } from 'react';

type Heading = {
  id: string;
  text: string;
  level: number;
};

/**
 * Hook to generate a table of contents from headings in a container
 * and track the active heading based on scroll position.
 *
 * @param contentId The ID of the container element containing the headings
 * @param containerId The ID of the container element to observe for scroll events
 * @param targetSelectors The selectors to use to find the headings
 * @returns The headings and the ID of the active heading
 *
 * @example
 * const { headings, activeId } = useToc({
 *   contentId: 'content',
 *   containerId: 'content-view',
 *   targetSelectors: 'h2, h3',
 * });
 */
export const useToc = ({
  contentId,
  containerId,
  targetSelectors = 'h1, h2, h3, h4, h5, h6',
}: {
  contentId: string;
  containerId?: string;
  targetSelectors?: string;
}) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver is not supported by your browser.');
      return;
    }

    const content = document.getElementById(contentId);

    if (!content) return;

    const headingElements = Array.from(
      content.querySelectorAll(targetSelectors)
    ).filter((heading) => Boolean(heading.textContent));

    const allElements: Element[] = [];

    headingElements.forEach((heading, index) => {
      allElements.push(heading);
      if (index < headingElements.length - 1) {
        const nextHeading = headingElements[index + 1];
        let sibling = heading.nextElementSibling;
        while (sibling && sibling !== nextHeading) {
          allElements.push(sibling);
          sibling = sibling.nextElementSibling;
        }
      }
    });

    headingElements.forEach((heading) => {
      if (!heading.id && heading.textContent) {
        heading.id = encodeURIComponent(heading.textContent);
      }
    });

    setHeadings(
      headingElements.map((heading) => ({
        id: heading.id || heading.textContent!,
        text: heading.textContent!,
        level: Number(heading.tagName.replace('h', '')),
      }))
    );

    const container = containerId && document.getElementById(containerId);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = headingElements.findIndex(
              (heading) => heading.id === entry.target.id
            );
            if (index !== -1) {
              setActiveId(headingElements[index].id);
            } else {
              const closestHeading = findClosestHeading(
                entry.target,
                headingElements
              );

              if (closestHeading) {
                setActiveId(closestHeading.id);
              }
            }
          }
        });
      },
      {
        rootMargin: '0px 0px -90%',
        threshold: 0,
        root: container || null,
      }
    );

    allElements.forEach((element) => observer.observe(element));

    return () => {
      allElements.forEach((element) => observer.unobserve(element));
    };
  }, [contentId, containerId, targetSelectors]);

  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.slice(1);
      const element = document.getElementById(hash);

      if (element) {
        element.scrollIntoView({ block: 'start' });
      }
    }
  }, []);

  return { headings, activeId };
};

const findClosestHeading = (element: Element, headingElements: Element[]) => {
  const elementRect = element.getBoundingClientRect();
  let closestHeading: Element | null = null;
  let closestDistance = Infinity;

  headingElements.forEach((heading) => {
    const headingRect = heading.getBoundingClientRect();
    const distance = Math.abs(headingRect.top - elementRect.top);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestHeading = heading;
    }
  });

  return closestHeading as Element | null;
};
