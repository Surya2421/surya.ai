'use client';

import { useState } from 'react';
import { ProjectVisual } from './ProjectVisual';

export function SafeProjectImage({
  src,
  alt,
  caption,
  index,
}: {
  src?: string;
  alt: string;
  caption?: string;
  index: number;
}) {
  const [failed, setFailed] = useState(!src);
  return (
    <figure className="safe-project-image">
      <div>
        {!failed && src ? (
          <img src={src} alt={alt} onError={() => setFailed(true)} />
        ) : (
          <ProjectVisual index={index} title={alt} compact />
        )}
      </div>
      <figcaption>{caption || alt}</figcaption>
    </figure>
  );
}
