import { motion } from 'framer-motion';

export function RadarChart({ 
  data, 
  attributes, 
  color = '#8B2E2E', 
  size = 220 
}) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 40;
  const numPoints = attributes.length;

  // Calculate point positions
  const getPoint = (index, value) => {
    const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
    const r = radius * value;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };

  // Background web levels
  const webLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Data polygon path
  const dataPoints = attributes.map((attr, i) => getPoint(i, data[attr] || 0.5));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Axis lines
  const axisLines = attributes.map((attr, i) => {
    const end = getPoint(i, 1);
    return (
      <line
        key={`axis-${i}`}
        x1={centerX}
        y1={centerY}
        x2={end.x}
        y2={end.y}
        stroke="#E8E6E3"
        strokeWidth="1"
      />
    );
  });

  // Web circles
  const webCircles = webLevels.map((level, levelIdx) => {
    const points = attributes.map((attr, i) => getPoint(i, level));
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
    return (
      <path
        key={`web-${levelIdx}`}
        d={path}
        fill="none"
        stroke="#E8E6E3"
        strokeWidth="1"
      />
    );
  });

  // Labels
  const labels = attributes.map((attr, i) => {
    const labelPoint = getPoint(i, 1.25);
    return (
      <text
        key={`label-${i}`}
        x={labelPoint.x}
        y={labelPoint.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize="11"
        fontWeight="600"
      >
        {attr}
      </text>
    );
  });

  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      {webCircles}
      {axisLines}
      <motion.path
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        d={dataPath}
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {dataPoints.map((p, i) => (
        <motion.circle
          key={`point-${i}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
          cx={p.x}
          cy={p.y}
          r="4"
          fill={color}
        />
      ))}
      {labels}
    </motion.svg>
  );
}