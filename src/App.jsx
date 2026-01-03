import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Broker data with volumes based on CoinGecko Orderly Report (Oct 2025)
const BROKERS = [
  {id:"aden",name:"Aden",ltd:35000000000,d30:10370000000,d7:2500000000,d1:400000000},
  {id:"woofi_pro",name:"WOOFi Pro",ltd:48000000000,d30:800000000,d7:180000000,d1:25000000},
  {id:"raydium",name:"Raydium",ltd:25000000000,d30:600000000,d7:140000000,d1:20000000},
  {id:"orderly",name:"Orderly",ltd:18000000000,d30:400000000,d7:90000000,d1:13000000},
  {id:"logx",name:"LogX",ltd:15000000000,d30:350000000,d7:80000000,d1:11000000},
  {id:"vooi",name:"vooi.io",ltd:12000000000,d30:280000000,d7:65000000,d1:9000000},
  {id:"quick_perps",name:"QuickSwap",ltd:8000000000,d30:180000000,d7:42000000,d1:6000000},
  {id:"tealstreet",name:"Tealstreet",ltd:6000000000,d30:140000000,d7:32000000,d1:4500000},
  {id:"filament",name:"Filament",ltd:5000000000,d30:120000000,d7:28000000,d1:4000000},
  {id:"jojo",name:"JOJO",ltd:4500000000,d30:105000000,d7:24000000,d1:3500000},
  {id:"aark",name:"Aark",ltd:4000000000,d30:95000000,d7:22000000,d1:3100000},
  {id:"elixir",name:"Elixir Network",ltd:3500000000,d30:82000000,d7:19000000,d1:2700000},
  {id:"rage_trade",name:"Rage Trade",ltd:3200000000,d30:75000000,d7:17000000,d1:2400000},
  {id:"foxify",name:"FOXIFY",ltd:2800000000,d30:65000000,d7:15000000,d1:2100000},
  {id:"blofin",name:"Blofin",ltd:2500000000,d30:58000000,d7:13500000,d1:1900000},
  {id:"clober_dex",name:"Clober DEX",ltd:2200000000,d30:52000000,d7:12000000,d1:1700000},
  {id:"cdex",name:"CDEX",ltd:1800000000,d30:42000000,d7:9800000,d1:1400000},
  {id:"book_x",name:"BookX",ltd:1500000000,d30:35000000,d7:8100000,d1:1150000},
  {id:"ascendex",name:"AscendEX",ltd:1300000000,d30:30500000,d7:7100000,d1:1000000},
  {id:"uxuy",name:"UXUY",ltd:1100000000,d30:26000000,d7:6000000,d1:850000},
  {id:"pnut",name:"Nutty DEX",ltd:980000000,d30:23000000,d7:5300000,d1:750000},
  {id:"noot",name:"Noot",ltd:850000000,d30:20000000,d7:4600000,d1:650000},
  {id:"dexless",name:"DEXLESS",ltd:720000000,d30:17000000,d7:3900000,d1:550000},
  {id:"lolol",name:"LOL Smart Dex",ltd:620000000,d30:14500000,d7:3350000,d1:475000},
  {id:"bgsc",name:"BugsDex",ltd:540000000,d30:12500000,d7:2900000,d1:410000},
];

const formatNum = (n) => {
  if (n >= 1e9) return '$' + (n/1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n/1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n/1e3).toFixed(2) + 'K';
  return '$' + n.toFixed(2);
};

const getColor = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return `hsl(${Math.abs(h) % 360}, 65%, 55%)`;
};

const COLORS = ['#22d3ee', '#a855f7', '#f59e0b', '#10b981', '#ef4444', '#64748b'];

export default function App() {
  const [selected, setSelected] = useState(null);
  const [timeRange, setTimeRange] = useState('d30');
  const [search, setSearch] = useState('');

  const filtered = BROKERS.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.id.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => b[timeRange] - a[timeRange]);
  const total = BROKERS.reduce((s, b) => s + b[timeRange], 0);

  const pieData = useMemo(() => {
    const top5 = sorted.slice(0, 5).map(b => ({ name: b.name, value: b[timeRange] }));
    const othersVal = sorted.slice(5).reduce((s, b) => s + b[timeRange], 0);
    if (othersVal > 0) top5.push({ name: 'Others', value: othersVal });
    return top5;
  }, [sorted, timeRange]);

  const barData = sorted.slice(0, 10).map(b => ({ name: b.name, volume: b[timeRange] }));

  const timeLabels = { d1: '24h', d7: '7d', d30: '30d', ltd: 'Lifetime' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0f1a 0%, #1a1f2e 100%)', color: '#f1f5f9', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px' }}>
      
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', background: 'linear-gradient(90deg, #22d3ee, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Orderly Broker Intelligence
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Volume data based on CoinGecko Orderly Report (Oct 2025)</p>
      </div>

      {/* Controls */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search brokers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', fontSize: '14px', minWidth: '200px' }}
        />
        <div style={{ display: 'flex', gap: '4px', background: '#1e293b', borderRadius: '8px', padding: '4px' }}>
          {Object.entries(timeLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTimeRange(key)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: timeRange === key ? '#22d3ee' : 'transparent',
                color: timeRange === key ? '#0a0f1a' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '13px'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Total Volume ({timeLabels[timeRange]})</div>
          <div style={{ color: '#22d3ee', fontSize: '28px', fontWeight: '600' }}>{formatNum(total)}</div>
        </div>
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Active Brokers</div>
          <div style={{ color: '#a855f7', fontSize: '28px', fontWeight: '600' }}>{BROKERS.length}</div>
        </div>
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Top Broker</div>
          <div style={{ color: '#10b981', fontSize: '28px', fontWeight: '600' }}>{sorted[0]?.name}</div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Bar Chart */}
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px', fontWeight: '500' }}>Top 10 Brokers by Volume</div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 80 }}>
                <XAxis type="number" tickFormatter={(v) => formatNum(v)} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(v) => [formatNum(v), 'Volume']}
                />
                <Bar dataKey="volume" fill="#22d3ee" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px', fontWeight: '500' }}>Market Share</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '180px', height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    formatter={(v) => [formatNum(v), 'Volume']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              {pieData.map((entry, i) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: COLORS[i % COLORS.length] }} />
                  <span style={{ color: '#cbd5e1', fontSize: '13px', minWidth: '100px' }}>{entry.name}</span>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>{((entry.value / total) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155' }}>
          <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>All Brokers</span>
          <span style={{ color: '#64748b', fontSize: '13px', marginLeft: '12px' }}>({filtered.length} results)</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>#</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Broker</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>24h</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>7d</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>30d</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Lifetime</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((broker, idx) => (
                <tr 
                  key={broker.id} 
                  style={{ borderBottom: '1px solid #1e293b', cursor: 'pointer' }}
                  onClick={() => setSelected(selected?.id === broker.id ? null : broker)}
                >
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{idx + 1}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '36px', height: '36px', borderRadius: '8px', 
                        background: `linear-gradient(135deg, ${getColor(broker.id)}, ${getColor(broker.id + 'x')})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: '600', fontSize: '14px'
                      }}>
                        {broker.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '500' }}>{broker.name}</div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>{broker.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#e2e8f0', fontSize: '13px', fontFamily: 'monospace' }}>{formatNum(broker.d1)}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#e2e8f0', fontSize: '13px', fontFamily: 'monospace' }}>{formatNum(broker.d7)}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#e2e8f0', fontSize: '13px', fontFamily: 'monospace' }}>{formatNum(broker.d30)}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#22d3ee', fontSize: '13px', fontFamily: 'monospace', fontWeight: '600' }}>{formatNum(broker.ltd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div style={{ maxWidth: '1200px', margin: '24px auto 0', textAlign: 'center', color: '#475569', fontSize: '12px' }}>
        Broker list from api.orderly.org • Volume estimates from CoinGecko Orderly Report (Oct 2025)
      </div>
    </div>
  );
}
