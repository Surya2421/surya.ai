import { Aperture, Boxes, Route, ScanLine } from 'lucide-react';
const icons = [Aperture, Route, Boxes, ScanLine];
export function ProjectVisual({
  index = 0,
  title,
  compact = false,
}: {
  index?: number;
  title: string;
  compact?: boolean;
}) {
  const Icon = icons[index % icons.length];
  const id = title
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
  return (
    <div className={`build-visual ${compact ? 'build-visual--compact' : ''}`}>
      <div className="build-visual__plane" />
      <div className="build-visual__arc build-visual__arc--a" />
      <div className="build-visual__arc build-visual__arc--b" />
      <div className="build-visual__frame">
        <div>
          <i />
          <i />
          <i />
        </div>
        <span />
        <span />
        <span />
      </div>
      <strong>{id}</strong>
      <em>PROJECT {String(index + 1).padStart(2, '0')}</em>
      <span className="build-visual__icon">
        <Icon />
      </span>
    </div>
  );
}
