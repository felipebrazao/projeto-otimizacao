import Plot from 'react-plotly.js';

export default function Surface3D({ superficie }) {
  if (!superficie) return null;

  const data = [
    {
      type: 'surface',
      x: superficie.x,
      y: superficie.y,
      z: superficie.z,
      colorscale: 'Viridis',
      showscale: true,
      opacity: 0.92,
      name: 'L(x, y)',
    },
    {
      type: 'scatter3d',
      mode: 'markers+text',
      x: [superficie.x_otimo],
      y: [superficie.y_otimo],
      z: [superficie.z_otimo],
      marker: { size: 7, color: '#ef4444' },
      text: ['Ótimo'],
      textposition: 'top center',
      name: 'Ponto ótimo',
    },
  ];

  const layout = {
    autosize: true,
    height: 480,
    margin: { l: 0, r: 0, b: 0, t: 30 },
    title: { text: 'Superfície do Lucro L(x, y)', font: { size: 14 } },
    scene: {
      xaxis: { title: 'x (Canal A)' },
      yaxis: { title: 'y (Canal B)' },
      zaxis: { title: 'Lucro' },
      camera: { eye: { x: 1.6, y: 1.4, z: 1.0 } },
    },
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <Plot
        data={data}
        layout={layout}
        useResizeHandler
        style={{ width: '100%', height: '480px' }}
        config={{ displaylogo: false, responsive: true }}
      />
    </section>
  );
}
